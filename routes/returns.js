const router = require("express").Router();
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const Joi = require("joi");

// C
router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  // @ts-ignore
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental not found");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed");

  rental.return();
  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: {
        numberInStock: 1,
      },
    }
  );

  return res.send(rental);
});

function validateReturn(request) {
  const schema = Joi.object({
    // @ts-ignore
    customerId: Joi.objectId().required(),
    // @ts-ignore
    movieId: Joi.objectId().required(),
  });

  return schema.validate(request);
}

module.exports = router;
