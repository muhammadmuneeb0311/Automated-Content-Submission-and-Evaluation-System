const EvaluationCriteria = require("../../Models/EvaluationCriteria");


exports.addCriteria = async (req, res) => {
  try {
    let data = req.body;

    // If it's a single object, convert it to an array
    if (!Array.isArray(data)) {
      data = [data];
    }

    const saved = await EvaluationCriteria.insertMany(data);
    res.status(201).json({ message: "Criteria added successfully ✅", saved });
  } catch (error) {
    res.status(500).json({ message: "Error adding criteria ❌", error: error.message });
  }
};



// 📜 Admin — Get ALL criteria (including inactive)
exports.getAllCriteriaForAdmin = async (req, res) => {
  try {
    const criteria = await EvaluationCriteria.find()
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      success: true,
      count: criteria.length,
      data: criteria
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching all criteria ❌",
      error: error.message
    });
  }
};


// ✅ Public (for authenticated users) — get active criteria only
exports.getActiveCriteria = async (req, res) => {
  try {
  // fetch only active criteria (admin can manage active flag)
  const criteria = await EvaluationCriteria.find({ is_active: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: criteria.length, data: criteria });
  } catch (error) {
    console.error("Error fetching active criteria:", error);
    res.status(500).json({ success: false, message: "Error fetching criteria", error: error.message });
  }
};



// ✍️ Update criteria
exports.updateCriteria = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await EvaluationCriteria.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // important!
    );

    if (!updated) return res.status(404).json({ message: "Criteria not found" });

    res.json({ message: "Criteria updated ✅", updated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Criteria name already exists" });
    }
    res.status(500).json({ message: "Error updating criteria ❌", error });
  }
};


// 🗑️ Delete criteria
exports.deleteCriteria = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await EvaluationCriteria.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Criteria not found" });
    res.json({ message: "Criteria deleted 🗑️" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting criteria ❌" });
  }
};
