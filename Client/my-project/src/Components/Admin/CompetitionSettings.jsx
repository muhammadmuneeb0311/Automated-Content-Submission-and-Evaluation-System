
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const CompetitionSettings = () => {
  const [settings, setSettings] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    settingName: "",
    settingValue: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const getSettings = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/competition-settings",
        config
      );

      setSettings(res.data);
    } catch (err) {
      console.error(
        "Error fetching settings:",
        err.response?.data || err.message
      );
    }
  }, [config]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/admin/competition-settings/${editingId}`,
          form,
          config
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/admin/competition-settings",
          form,
          config
        );
      }

      setForm({
        settingName: "",
        settingValue: "",
        start_date: "",
        end_date: "",
        description: "",
      });

      setEditingId(null);
      getSettings();
    } catch (err) {
      console.error(
        "Error submitting setting:",
        err.response?.data || err.message
      );
    }
  };

  const deleteSetting = async (id) => {
    if (!window.confirm("Are you sure you want to delete this setting?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/competition-settings/${id}`,
        config
      );

      getSettings();
    } catch (err) {
      console.error(
        "Error deleting setting:",
        err.response?.data || err.message
      );
    }
  };

  const handleEdit = (setting) => {
    setEditingId(setting._id);

    setForm({
      settingName: setting.settingName,
      settingValue: setting.settingValue,
      start_date: setting.start_date?.split("T")[0] || "",
      end_date: setting.end_date?.split("T")[0] || "",
      description: setting.description || "",
    });
  };

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="mb-4 fw-bold">Competition Settings</h3>

          <form onSubmit={handleSubmit} className="row g-3 mb-4">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Setting Name"
                value={form.settingName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    settingName: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Status (Active/Inactive)"
                value={form.settingValue}
                onChange={(e) =>
                  setForm({
                    ...form,
                    settingValue: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={form.start_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    start_date: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={form.end_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    end_date: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-12 text-end">
              <button
                type="submit"
                className={`btn ${
                  editingId ? "btn-warning" : "btn-primary"
                } px-4`}
              >
                {editingId ? "Update Setting" : "Add Setting"}
              </button>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Description</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {settings.length > 0 ? (
                  settings.map((s) => (
                    <tr key={s._id}>
                      <td>{s.settingName}</td>
                      <td>{s.settingValue}</td>
                      <td>
                        {new Date(s.start_date).toLocaleDateString()}
                      </td>
                      <td>
                        {new Date(s.end_date).toLocaleDateString()}
                      </td>
                      <td>{s.description}</td>

                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(s)}
                        >
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteSetting(s._id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No settings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionSettings;
