const router = require("express").Router();
const { Genre, validateGenre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");

// C
router.post("/", [auth, validate(validateGenre)], async (req, res) => {
  const genre = new Genre({
    name: req.body.name,
  });
  await genre.save();

  res.send(genre);
});

// R
router.get("/", async (_, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given id was not found.");

  res.send(genre);
});

// U
router.put(
  "/:id",
  [auth, validateObjectId, validate(validateGenre)],
  async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
        },
      },
      { new: true }
    );
    if (!genre)
      return res.status(404).send("The genre with the given id was not found.");

    res.send(genre);
  }
);

// D
router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given id was not found.");

  res.send(genre);
});

module.exports = router;
