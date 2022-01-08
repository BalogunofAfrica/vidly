const router = require("express").Router();
const { Customer, validateCustomer } = require("../models/customer");
const auth = require("../middleware/auth");

// C
router.post("/", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  await customer.save();

  res.send(customer);
});

// R
router.get("/", async (_, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with the given id was not found");
  res.send(customer);
});

// U
router.put("/:id", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        ...req.body,
      },
    },
    { new: true }
  );
  if (!customer)
    return res.status(404).send("Customer with the given id was not found");

  res.send(customer);
});

// D
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    return res.status(404).send("Customer with the given id was not found");

  res.send(customer);
});

module.exports = router;
