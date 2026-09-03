
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./DashboardAction.css";
import {
  Compass,
  Home,
  Users,
  Heart,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import {  useNavigate } from "react-router-dom";


const TRIP_TYPES = [
  {
    id: "solo",
    label: "Solo",
    icon: Compass,
    tagline: "Just you, a map, and no compromises.",
    ideas: [
      {
        title: "Backpack through the Western Ghats",
        destination: "Wayanad, Kerala",
        blurb: "Forest trails, misty mornings, and quiet places to disappear for a while.",
        duration: "4–7 days",
        budget: "Budget",
      },
      {
        title: "A slow week in the hills",
        destination: "Munnar, Kerala",
        blurb: "Tea gardens, mountain roads, and enough quiet to hear yourself think.",
        duration: "5–7 days",
        budget: "Moderate",
      },
      {
        title: "Temple town escape",
        destination: "Hampi, Karnataka",
        blurb: "Ancient ruins, golden sunsets, and long days exploring at your own pace.",
        duration: "3–5 days",
        budget: "Budget",
      },
      {
        title: "Coastal road trip, no plan",
        destination: "Goa to Gokarna",
        blurb: "Follow the coast, find hidden beaches, and stop wherever the road feels right.",
        duration: "5–8 days",
        budget: "Moderate",
      },
    ],
  },

  {
    id: "family",
    label: "Family",
    icon: Home,
    tagline: "Something for every age, none of the stress.",
    ideas: [
      {
        title: "Wildlife and waterfalls week",
        destination: "Wayanad, Kerala",
        blurb: "Easy trails, wildlife spotting, waterfalls, and plenty of family time.",
        duration: "4–6 days",
        budget: "Moderate",
      },
      {
        title: "Beach holiday with the family",
        destination: "Goa",
        blurb: "Calm mornings by the beach, fun-filled afternoons, and relaxed family dinners.",
        duration: "4–6 days",
        budget: "Moderate",
      },
      {
        title: "Hill station family escape",
        destination: "Ooty, Tamil Nadu",
        blurb: "Toy trains, gardens, cool weather, and enough activities for everyone.",
        duration: "3–5 days",
        budget: "Budget",
      },
      {
        title: "Palace and heritage getaway",
        destination: "Mysuru, Karnataka",
        blurb: "Grand palaces, local food, beautiful gardens, and an easy-paced family trip.",
        duration: "2–4 days",
        budget: "Budget",
      },
    ],
  },

  {
    id: "friends",
    label: "Friends",
    icon: Users,
    tagline: "The group chat finally leaves the group chat.",
    ideas: [
      {
        title: "Beach-hopping with the gang",
        destination: "Goa",
        blurb: "Beaches by day, cafés by evening, and stories you'll still be talking about later.",
        duration: "4–6 days",
        budget: "Moderate",
      },
      {
        title: "Backpacking through Karnataka",
        destination: "Bengaluru to Hampi",
        blurb: "Road trips, ancient ruins, local food, and a different adventure every day.",
        duration: "5–7 days",
        budget: "Budget",
      },
      {
        title: "Hill station adventure",
        destination: "Kodaikanal, Tamil Nadu",
        blurb: "Misty hills, late-night conversations, scenic hikes, and one unforgettable cottage.",
        duration: "3–5 days",
        budget: "Budget",
      },
      {
        title: "River, forest and adventure weekend",
        destination: "Coorg, Karnataka",
        blurb: "Coffee estates, waterfalls, river rafting, and a weekend away from the city.",
        duration: "3–4 days",
        budget: "Moderate",
      },
    ],
  },

  {
    id: "couple",
    label: "Couple",
    icon: Heart,
    tagline: "Just the two of you, somewhere worth remembering.",
    ideas: [
      {
        title: "Tea gardens and slow mornings",
        destination: "Munnar, Kerala",
        blurb: "Misty hills, beautiful viewpoints, long drives, and quiet evenings together.",
        duration: "4–6 days",
        budget: "Moderate",
      },
      {
        title: "Romantic backwater escape",
        destination: "Alappuzha, Kerala",
        blurb: "A private houseboat, sunset over the backwaters, and nowhere else you need to be.",
        duration: "2–4 days",
        budget: "Splurge",
      },
      {
        title: "Beachside couple getaway",
        destination: "Varkala, Kerala",
        blurb: "Cliffside cafés, ocean sunsets, slow walks, and a few days with no schedule.",
        duration: "3–5 days",
        budget: "Moderate",
      },
      {
        title: "Royal weekend for two",
        destination: "Mysuru, Karnataka",
        blurb: "Palaces, beautiful streets, great food, and evenings made for wandering together.",
        duration: "2–3 days",
        budget: "Budget",
      },
    ],
  },
];

const BUDGET_STYLES = {
  Budget: { bg: "#E4EFEA", text: "#0F4C43" },
  Moderate: { bg: "#F3E7D2", text: "#8A6420" },
  Splurge: { bg: "#F7E1D8", text: "#B0431B" },
};


function dateFromToday(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function DashboardActions({ username }) {
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [tripsError, setTripsError] = useState(false);
  const [activeType, setActiveType] = useState(null);
  
 
  const [selectedIdea, setSelectedIdea] = useState(null);
 
  const [form, setForm] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "Moderate",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("https://trip-backend-ula1.onrender.com/trips", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrips(response.data || []);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setTripsError(true);
      } finally {
        setTripsLoading(false);
      }
    };
    fetchTrips();
  }, []);

 

  const activeTrip = useMemo(
    () => TRIP_TYPES.find((t) => t.id === activeType) || null,
    [activeType],
  );

  function handleSelectIdea(idea) {
    setSelectedIdea(idea);
    setCreateError("");
    setForm({
      tripName: idea.title,
      destination: idea.destination,
      startDate: dateFromToday(30), 
      endDate: dateFromToday(30 + parseDurationDays(idea.duration)),
      budget: idea.budget,
    });
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBackToIdeas() {
    setSelectedIdea(null);
    setCreateError("");
  }


  async function handleCreateTrip() {
    setCreateError("");

    if (!form.tripName || !form.destination || !form.startDate || !form.endDate) {
      setCreateError("Please fill in all fields.");
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setCreateError("End date can't be before the start date.");
      return;
    }

    setCreating(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://trip-backend-ula1.onrender.com/trips",
        {
          tripName: form.tripName,
          destination: form.destination,
          startDate: form.startDate,
          endDate: form.endDate,
          budget: form.budget,
          description: selectedIdea?.blurb || "",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setTrips((prev) => [...prev, response.data]);
      setSelectedIdea(null);
      setActiveType(null);
      navigate("/mytrips")
    } catch (error) {
      console.error("Error creating trip:", error);
      setCreateError(
        error.response?.data?.message || "Couldn't create the trip. Try again.",
      );
    } finally {
      setCreating(false);
    }
  }



  // alert();
  return (
    <div>
         <div className="space"></div>
      <div className="head"></div>

      <div className="page">
        <div className="header">
          <p className="eye-user">Welcome Back, {username}</p>

          <h2 className="title">Plan your next trip</h2>
          <p className="subtitle">
            Pick whom you want to travel with!, We'll stamp your passport and
            pull together ideas.
          </p>
        </div>
         {selectedIdea ? (
          <div className="detail-panel">
            <button className="back-button" onClick={handleBackToIdeas}>
              <ArrowLeft size={15} strokeWidth={2.5} />
              Back to ideas
            </button>

            <h3 className="detail-title">{selectedIdea.title}</h3>
            <p className="detail-destination">
              <MapPin size={14} strokeWidth={2} />
              {selectedIdea.destination}
            </p>

            <div className="detail-badge-row">
              <span
                className="badge"
                style={{
                 
                  background: BUDGET_STYLES[selectedIdea.budget].bg,
                  color: BUDGET_STYLES[selectedIdea.budget].text,
                }}
              >
                {selectedIdea.budget}
              </span>
              <span className="duration-row">
                <Clock size={13} strokeWidth={2} />
                {selectedIdea.duration}
              </span>
            </div>

            <p className="detail-blurb">{selectedIdea.blurb}</p>

            <div className="form-grid">
              <label className="form-label">
                Trip name
                <input
                  className="form-input"
                  type="text"
                  value={form.tripName}
                  onChange={(e) => handleFormChange("tripName", e.target.value)}
                />
              </label>

              <label className="form-label">
                Destination
                <input
                  className="form-input"
                  type="text"
                  value={form.destination}
                  onChange={(e) => handleFormChange("destination", e.target.value)}
                />
              </label>

              <label className="form-label">
                Start date
                <input
                  className="form-input"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleFormChange("startDate", e.target.value)}
                />
              </label>

              <label className="form-label">
                End date
                <input
                  className="form-input"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => handleFormChange("endDate", e.target.value)}
                />
              </label>

              <label className="form-label">
                Budget
                <input
                  className="form-input"
                  type="number"
                  value={form.budget}
                  onChange={(e) => handleFormChange("budget", e.target.value)}
                />
              </label>
            </div>

            {createError && <p className="error-text">{createError}</p>}

            <button
             className="create-button"
              style={{
                
                opacity: creating ? 0.7 : 1,
                cursor: creating ? "not-allowed" : "pointer",
              }}
              onClick={handleCreateTrip}
              disabled={creating}
            >
              {creating ? "Creating…" : "Create Trip"}
            </button>
          </div>
        ) : (
          <>
            <div className="dpa-stamps" className="stamp-row">
              {TRIP_TYPES.map((type, i) => {
                const Icon = type.icon;
                const isActive = activeType === type.id;
                return (
                  <button
                    key={type.id}
                    className="dpa-stamp"
                    onClick={() => setActiveType(isActive ? null : type.id)}
                    className="stamp"
                    style={{
                      
                      transform: `rotate(${i % 2 === 0 ? "-3deg" : "3deg"})`,
                      background: isActive ? "#0F4C43" : "transparent",
                      borderColor: isActive ? "#0F4C43" : "#0F4C4355",
                      color: isActive ? "#F1E8D8" : "#0F4C43",
                    }}
                  >
                    <Icon size={22} strokeWidth={1.75} />
                    <span className="stamp-label">{type.label}</span>
                  </button>
                );
              })}
            </div>

            {activeTrip && (
              <div className="panel">
                <div className="panel-header">
                  <h3 className="panel-title">{activeTrip.label} trip ideas</h3>
                  <p className="panel-tagline">{activeTrip.tagline}</p>
                </div>

                <div className="dpa-ideas" className="idea-grid">
                  {activeTrip.ideas.map((idea) => {
                    const budgetStyle = BUDGET_STYLES[idea.budget];
                    return (
                      <button
                        key={idea.title}
                        className="dpa-idea"
                        className="idea-card"
                        
                        onClick={() => handleSelectIdea(idea)}
                      >
                        <div className="idea-top-row">
                          <span
                            className="badge"
                            style={{
                              
                              background: budgetStyle.bg,
                              color: budgetStyle.text,
                            }}
                          >
                            {idea.budget}
                          </span>
                          <span className="duration-row">
                            <Clock size={13} strokeWidth={2} />
                            {idea.duration}
                          </span>
                        </div>
                        <h4 className="idea-title">{idea.title}</h4>
                        <p className="idea-blurb">{idea.blurb}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="space"></div>

      <div className="page">
        <p className="eye">Here your trips</p>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .dpa-stamp { transition: transform 180ms ease, background 180ms ease, color 180ms ease, box-shadow 180ms ease; }
        .dpa-stamp:hover { transform: rotate(0deg) translateY(-2px); }
        .dpa-idea { transition: transform 160ms ease, box-shadow 160ms ease; text-align: left; }
        .dpa-idea:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(15,76,67,0.10); }
        @media (max-width: 640px) {
          .dpa-stamps { grid-template-columns: repeat(2, 1fr) !important; }
          .dpa-ideas { grid-template-columns: 1fr !important; }
        }
      `}</style>

        <div className="trips-section">
          <div className="trips-header-row">
            <MapPin size={16} strokeWidth={2} color="#0F4C43" />
            <h3 className="trips-heading">Your upcoming trips</h3>
          </div>

          {tripsLoading && <p className="muted-text">Loading your trips…</p>}

          {!tripsLoading && tripsError && (
            <p className="muted-text">
              Couldn't reach your trips right now. Try again shortly.
            </p>
          )}

          {!tripsLoading && !tripsError && trips.length === 0 && (
            <p className="muted-text">
              No trips booked yet — pick a trip type above to get started.
            </p>
          )}

          {!tripsLoading && !tripsError && trips.length > 0 && (
            <div className="trip-list">
           {trips
  .filter((trip) => {
    if (!trip.startDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(trip.startDate);
    startDate.setHours(0, 0, 0, 0);

    return startDate > today;
  })
  .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  .map((trip, idx) => (
    <div key={trip._id ?? trip.id ?? idx} className="trip-strip">
      <div>
        <p className="trip-heading">
          {trip.tripName || "Untitled trip"}
        </p>

        {trip.date && <p className="trip-date">{trip.date}</p>}

        <p className="trip-name">
          <ArrowRight size={13} strokeWidth={3} color="#0F4C4399" />
          {trip.destination}
        </p>

        <p className="trip-name">
          <ArrowRight size={13} strokeWidth={3} color="#0F4C4399" />
          {new Date(trip.startDate).toLocaleDateString("en-GB")}
        </p>

        <p className="trip-name">
          <ArrowRight size={13} strokeWidth={3} color="#0F4C4399" />
          {new Date(trip.endDate).toLocaleDateString("en-GB")}
        </p>

        <p className="trip-name">
          <ArrowRight size={13} strokeWidth={3} color="#0F4C4399" />
          {trip.budget}
        </p>
      </div>
    </div>
  ))};
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function parseDurationDays(duration) {
  const match = duration.match(/(\d+)[^\d]+(\d+)?\s*(day|week)/i);
  if (!match) return 7;
  const high = match[2] ? parseInt(match[2], 10) : parseInt(match[1], 10);
  const unit = match[3].toLowerCase();
  return unit === "week" ? high * 7 : high;
}