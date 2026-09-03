import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plane, MapPin, Calendar, Wallet, FileText, ArrowRight } from "lucide-react";
import "./CreateTrip.css";
import Navbar from "./Navbar";


const EMPTY_TRIP = {
  tripName: "",
  destination: "",
  startDate: "",
  endDate: "",
  budget: "",
  description: "",
};

const FIELDS = [
  { name: "tripName", label: "Trip name", icon: Plane, type: "text", placeholder: "Summer in the Alps" },
  { name: "destination", label: "Destination", icon: MapPin, type: "text", placeholder: "Goa, India" },
  { name: "startDate", label: "Start date", icon: Calendar, type: "date" },
  { name: "endDate", label: "End date", icon: Calendar, type: "date" },
  { name: "budget", label: "Budget", icon: Wallet, type: "number", placeholder: "3000" },
];

const CreateTrip = () => {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(EMPTY_TRIP);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!tripData.tripName.trim()) return "Give your trip a name.";
    if (!tripData.destination.trim()) return "Add a destination.";
    if (!tripData.startDate || !tripData.endDate) return "Pick a start and end date.";
    if (new Date(tripData.endDate) < new Date(tripData.startDate)) {
      return "End date can't be before the start date.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setErrorMsg("");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://trip-backend-ula1.onrender.com/trips", tripData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTripData(EMPTY_TRIP);
    
      console.log("Trip created successfully");
    
      navigate("/mytrips");
    } catch (error) {
      console.error("Error creating trip:", error);
      setErrorMsg("Couldn't create the trip. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar/>
    <div className="page">
    
     <div className="create-trip-page">
    
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .ct-input:focus { outline: none; border-color: #0F4C43 !important; box-shadow: 0 0 0 3px #0F4C4322; }
        .ct-submit:hover:not(:disabled) { background: #0C3C36; }
        .ct-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        @media (max-width: 640px) {
          .ct-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
       

      <div className="create-trip-card">
       
        <p className="create-trip-eyebrow">New trip</p>
        <h2 className="create-trip-title">Create a trip</h2>
        <p className="create-trip-subtitle">Fill in the basics — you can add the details later.</p>

        <form onSubmit={handleSubmit} className="create-trip-form">
          <Field field={FIELDS[0]} value={tripData.tripName} onChange={handleChange} />
          <Field field={FIELDS[1]} value={tripData.destination} onChange={handleChange} />
           
          <div className="create-trip-row"  >
            <Field field={FIELDS[2]} value={tripData.startDate} onChange={handleChange} />
            <Field field={FIELDS[3]} value={tripData.endDate} onChange={handleChange} />
          </div>

          <Field field={FIELDS[4]} value={tripData.budget} onChange={handleChange} />

          <label className="field-label" >
            <FileText size={14} strokeWidth={2} className="field-icon"/>
            Description
          </label>
          <textarea
            className="ct-input"
            name="description"
            placeholder="What's the plan for this trip?"
            value={tripData.description}
            onChange={handleChange}
            rows={5}
            
          />

          {errorMsg && <p className="error-message">{errorMsg}</p>}

          <button className="ct-submit" type="submit" disabled={submitting} >
            {submitting ? "Creating…" : "Create trip"}
            {!submitting && <ArrowRight size={16} strokeWidth={2} />}
          </button>
        </form>
      </div>
    </div>
    </div>
   </>
  );
};

const Field = ({ field, value, onChange }) => {
  const Icon = field.icon;
  return (
    <div className="field-group">
      <label className="field-label">
        <Icon size={14} strokeWidth={2} className="field-icon"/>
        {field.label}
      </label>
      <input
        className="ct-input"
        type={field.type}
        name={field.name}
        placeholder={field.placeholder}
        value={value}
        onChange={onChange}
        
      />
    </div>
  
  );
};



export default CreateTrip;