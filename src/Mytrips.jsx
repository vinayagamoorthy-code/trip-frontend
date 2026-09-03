import { useEffect, useState } from "react";
import axios from "axios";
import "./Mytrips.css";
import { useNavigate } from "react-router-dom";

const Mytrips = () => {
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchTrips = async () => {
    try {
      const response = await axios.get("https://trip-backend-ula1.onrender.com/trips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const deleteTrip = async (tripId) => {
    try {
      await axios.delete(`https://trip-backend-ula1.onrender.com/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips(trips.filter((trip) => trip._id !== tripId));
      alert("Trip deleted successfully!");
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  // FIX: take the whole trip object, not just the id
  const handleEdit = (trip) => {
    setEditingTrip({ ...trip });
  };

  const updateTrip = async () => {
    try {
      await axios.put(
        `https://trip-backend-ula1.onrender.com/trips/${editingTrip._id}`,
        editingTrip,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Trip updated successfully!");
      fetchTrips();
      setEditingTrip(null);
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };

  const checkExpired = (startDate, endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const end = new Date(endDate || startDate);
    if (isNaN(end.getTime())) return false;
    end.setHours(0, 0, 0, 0);

    return end < today;
  };

  return (
    <div className="mytrips-page">
      <div className="mytrips-container">
        <button onClick={() => navigate("/dashboard")} className="back">
          Go To Dashboard
        </button>
        <h2 className="mytrips-title">My Trips</h2>

        {trips.length === 0 ? (
          <p className="empty-state">No trips found.</p>
        ) : (
          <div className="trip-grid">
            {trips
              .filter((trip) => trip.startDate)
              .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
              .map((trip) => {
                const isExpired = checkExpired(trip.startDate, trip.endDate);
                const isEditingThis = editingTrip && editingTrip._id === trip._id;

                return (
                  <div className="trip-card" key={trip._id}>
                    {isEditingThis ? (
                      // ---- INLINE EDIT FORM (renders in place of this card) ----
                      <div className="edit-card">
                        <h3>Edit Trip</h3>

                        <div className="form-group">
                          <label>Trip Name</label>
                          <input
                            type="text"
                            value={editingTrip.tripName}
                            onChange={(e) =>
                              setEditingTrip({ ...editingTrip, tripName: e.target.value })
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label>Destination</label>
                          <input
                            type="text"
                            value={editingTrip.destination}
                            onChange={(e) =>
                              setEditingTrip({ ...editingTrip, destination: e.target.value })
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label>Budget</label>
                          <input
                            type="number"
                            value={editingTrip.budget}
                            onChange={(e) =>
                              setEditingTrip({ ...editingTrip, budget: e.target.value })
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label>Start Date</label>
                          <input
                            type="date"
                            value={editingTrip.startDate?.substring(0, 10) || ""}
                            onChange={(e) =>
                              setEditingTrip({ ...editingTrip, startDate: e.target.value })
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label>End Date</label>
                          <input
                            type="date"
                            value={editingTrip.endDate?.substring(0, 10) || ""}
                            onChange={(e) =>
                              setEditingTrip({ ...editingTrip, endDate: e.target.value })
                            }
                          />
                        </div>

                        {checkExpired(editingTrip.startDate, editingTrip.endDate) && (
                          <p className="trip-expired-msg" style={{ color: "#B00020", fontWeight: 600 }}>
                            Planned date has exceeded
                          </p>
                        )}

                        <button onClick={updateTrip} className="btn btn-save">
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingTrip(null)}
                          className="btn btn-cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                     
                      <>
                        <h3>{trip.tripName}</h3>
                        <p><strong>Destination:</strong> {trip.destination}</p>
                        <p><strong>Budget:</strong> ₹{trip.budget}</p>
                        <p>
                          <strong>From:</strong>{" "}
                          {new Date(trip.startDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>To:</strong>{" "}
                          {new Date(trip.endDate).toLocaleDateString()}
                        </p>

                        {isExpired && (
                          <p className="trip-expired-msg" style={{ color: "#B00020", fontWeight: 600 }}>
                            Planned date has exceeded
                          </p>
                        )}

                        <div className="trip-actions">
                          <button
                            className="btn btn-edit"
                            onClick={() => handleEdit(trip)}
                          >
                            Edit Trip
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => deleteTrip(trip._id)}
                          >
                            Delete Trip
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mytrips;