const express = require("express");
const router = express.Router();
const multer = require("multer");
const Employee = require("../models/employee");

// =================== File upload setup ===================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// =================== GET /api/admin/employees ===================
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalEmployees = await Employee.countDocuments();
    const employees = await Employee.find().skip(skip).limit(limit);

    const totalPages = Math.ceil(totalEmployees / limit);

    res.json({ employees, totalPages });
  } catch (err) {
    console.error("Fetch Employees Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// =================== POST /api/admin/employees ===================
router.post("/", upload.single("avatar"), async (req, res) => {
  try {
    const { firstName, lastName, country, phone_number, email, national_id_card_number, address1, address2, postcode } = req.body;

    if (!firstName || !lastName || !country || !phone_number || !email || !national_id_card_number || !address1 || !postcode) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    const newEmployee = new Employee({
      firstName,
      lastName,
      country,
      phone_number,
      email,
      national_id_card_number,
      address1,
      address2: address2 || "",
      postcode,
      avatar: req.file ? req.file.filename : null,
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error("Add Employee Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// =================== PUT /api/admin/employees/:id ===================
router.put("/:id", upload.single("avatar"), async (req, res) => {
  try {
    console.log(req.body);
    const employeeId = req.params.id;
    const { firstName, lastName, country, phone_number, email, national_id_card_number, address1, address2, postcode } = req.body;

    if (!firstName || !lastName || !country || !phone_number || !email || !national_id_card_number || !address1 || !postcode) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    const updatedData = {
      firstName,
      lastName,
      country,
      phone_number,
      email,
      national_id_card_number,
      address1,
      address2: address2 || "",
      postcode,
    };

    if (req.file) updatedData.avatar = req.file.filename;

    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updatedData, { new: true });
    if (!updatedEmployee) return res.status(404).json({ msg: "Employee not found" });

    res.json(updatedEmployee);
  } catch (err) {
    console.error("Update Employee Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// =================== DELETE /api/admin/employees/:id ===================
router.delete("/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ msg: "Employee not found" });

    res.json({ msg: "Employee deleted successfully" });
  } catch (err) {
    console.error("Delete Employee Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;