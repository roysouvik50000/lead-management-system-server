const express = require("express");
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  assignLead,
  logActivity
} = require("../controllers/leadController");

const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

// Manager: Create Lead
router.post("/", auth, authorizeRoles("Manager"), createLead);

// Manager/SalesRep: Get Leads
router.get("/", auth, getLeads);

// Update Lead
router.put("/:id", auth, updateLead);

// Delete Lead (Manager only)
router.delete("/:id", auth, authorizeRoles("Manager"), deleteLead);

// Assign Lead (Manager only)
router.put("/:id/assign/:userId", auth, authorizeRoles("Manager"), assignLead);

// SalesRep logs activity
router.post("/:id/activity", auth, authorizeRoles("SalesRep"), logActivity);

module.exports = router;
