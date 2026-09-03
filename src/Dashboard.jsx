import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import DashboardActions from "./DashboardActions";
import { LucideMapPinPlus  } from "lucide-react";
import "./Dashboard.css";
import Navbar from "./Navbar";

const Dashboard = () => {

  const [username, setUsername] = useState("");
 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "User");
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

   return (
    
  
    <div className="dashboard-container">
     <Navbar/>
      <DashboardActions username={username} />

      <div className="dashboard-actions">
     
      <div className="action-card1">
        <Link to="/createtrip">
          <span className="icon">
            <LucideMapPinPlus  /> </span>
            <span className="text">Create Trip</span>
          
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;