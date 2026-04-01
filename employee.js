const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  country: { type: String, required: true },
  phone_number: { type: String, required: true },
  email: { type: String, required: true },
  national_id_card_number: { type: String, required: true },
  avatar: { type: String },
  address1: { type: String, required: true },
  address2: { type: String }, // optional
  postcode: { type: String, required: true },
});

module.exports = mongoose.model("Employee", employeeSchema, "employees");