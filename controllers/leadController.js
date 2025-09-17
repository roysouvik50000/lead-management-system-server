const Lead = require("../models/Lead");
const User = require("../models/User");

// Create Lead (Manager only)
exports.createLead = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const lead = await Lead.create({ name, email, phone });

    res.status(201).json({ message: "Lead created", lead });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Leads
exports.getLeads = async (req, res) => {
  try {
    let leads;
    if (req.user.role === "Manager") {
      leads = await Lead.find().populate("assignedTo", "name email role");
    } else if (req.user.role === "SalesRep") {
      leads = await Lead.find({ assignedTo: req.user.id })
        .populate("assignedTo", "name email role");
    } else {
      return res.status(403).json({ message: "Insufficient rights" });
    }

    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Lead
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (req.user.role === "Manager") {
      // Manager can update everything
      Object.assign(lead, req.body);
      await lead.save();
      return res.json({ message: "Lead updated", lead });
    }

    if (req.user.role === "SalesRep") {
      // SalesRep can update only own leads
      if (lead.assignedTo?.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized for this lead" });
      }

      const { status, note } = req.body;
      if (status && !["Engaged", "Disposed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status for SalesRep" });
      }

      if (status) lead.status = status;
      if (note) {
        lead.activities.push({
          action: "Note Added",
          note,
          actor: req.user.id
        });
      }

      await lead.save();
      return res.json({ message: "Lead updated by SalesRep", lead });
    }

    res.status(403).json({ message: "Forbidden" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Lead (Manager only)
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Assign Lead to SalesRep (Manager only)
exports.assignLead = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const user = await User.findById(userId);
    if (!user || user.role !== "SalesRep") {
      return res.status(400).json({ message: "Invalid SalesRep ID" });
    }

    lead.assignedTo = userId;
    lead.status = "Assigned";
    lead.activities.push({
      action: "Assigned",
      note: `Lead assigned to ${user.name}`,
      actor: req.user.id
    });

    await lead.save();
    res.json({ message: "Lead assigned successfully", lead });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// SalesRep logs activity
exports.logActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { note, status } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (lead.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized for this lead" });
    }

    if (status && !["Engaged", "Disposed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    if (status) lead.status = status;

    lead.activities.push({
      action: "Sales Activity",
      note,
      actor: req.user.id
    });

    await lead.save();
    res.json({ message: "Activity logged", lead });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
