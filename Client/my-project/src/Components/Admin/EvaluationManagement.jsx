import { useEffect, useState } from "react";
import axios from "axios";


const EvaluationManagement = () => {
  const [criteria, setCriteria] = useState([]);
  const [newCriteria, setNewCriteria] = useState({ name: "", weight: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchCriteria = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://automated-content-submission-and-t73b.onrender.com/api/criteria/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCriteria(res.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching criteria:", error);
      setCriteria([]);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

const handleAdd = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");

    // map frontend fields to backend schema
    const payload = {
      criteria_name: newCriteria.name,
      weightage_percent: Number(newCriteria.weight),
      description: newCriteria.description,
    };

    const res = await axios.post(
      "https://automated-content-submission-and-t73b.onrender.com/api/criteria/add",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // update local state
    setCriteria([...criteria, ...res.data.saved]);
    setNewCriteria({ name: "", weight: "", description: "" });
  } catch (error) {
    console.error("❌ Add failed:", error);
  }
};



const handleUpdate = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `https://automated-content-submission-and-t73b.onrender.com/api/criteria/${id}`,
      newCriteria,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCriteria((prev) =>
      prev.map((c) => (c._id === id ? res.data.updated : c))
    );

    setEditingId(null);
    setNewCriteria({
      criteria_name: "",
      weightage_percent: "",
      max_marks: "",
      description: "",
    });
  } catch (error) {
    console.error("❌ Update failed:", error.response?.data || error.message);
  }
};



  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this criteria?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://automated-content-submission-and-t73b.onrender.com/api/criteria/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCriteria(criteria.filter((c) => c._id !== id));
    } catch (error) {
      console.error("❌ Delete failed:", error);
    }
  };
// const role = localStorage.getItem("role");

  return (
    <div className="d-flex">
      {/* <RoleBasedSidebar role={role} />  */}


      <div className="container mt-4">
        <h3 className="mb-4">Evaluation Criteria Management</h3>

        {/* Add Form */}
        <form className="row g-3 mb-4" onSubmit={handleAdd}>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Criteria Name"
              value={newCriteria.name}
              onChange={(e) =>
                setNewCriteria({ ...newCriteria, name: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Weight"
              value={newCriteria.weight}
              onChange={(e) =>
                setNewCriteria({ ...newCriteria, weight: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={newCriteria.description}
              onChange={(e) =>
                setNewCriteria({ ...newCriteria, description: e.target.value })
              }
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              Add
            </button>
          </div>
        </form>

        {/* Table */}
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Weight</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {criteria.length > 0 ? (
              criteria.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>
                    {editingId === item._id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={newCriteria.name}
                        onChange={(e) =>
                          setNewCriteria({ ...newCriteria, name: e.target.value })
                        }
                      />
                    ) : (
                      item.name || item.criteria_name
                    )}
                  </td>
                  <td>
                    {editingId === item._id ? (
                      <input
                        type="number"
                        className="form-control"
                        value={newCriteria.weight}
                        onChange={(e) =>
                          setNewCriteria({ ...newCriteria, weight: e.target.value })
                        }
                      />
                    ) : (
                      item.weight || item.weightage_percent
                    )}
                  </td>
                  <td>
                    {editingId === item._id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={newCriteria.description}
                        onChange={(e) =>
                          setNewCriteria({ ...newCriteria, description: e.target.value })
                        }
                      />
                    ) : (
                      item.description || "—"
                    )}
                  </td>
                  <td>
                    {editingId === item._id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleUpdate(item._id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => {
                            setEditingId(item._id);
                            setNewCriteria({
                              name: item.name || item.criteria_name,
                              weight: item.weight || item.weightage_percent,
                              description: item.description,
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No criteria found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvaluationManagement;
