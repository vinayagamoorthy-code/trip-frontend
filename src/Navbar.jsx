import "./Navbar.css";
import Swal from "sweetalert2";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        Swal.fire("Cancelled", "You are still logged in.", "info");
      }
    });
  };

  return (
    <nav>
      <div className="logo">Travel Planner</div>
      <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
         <li>
          <a href="/dashboard">🏠 Dashboard</a>
        </li>
        <li>
          <a href="/Mytrips">🧳 My Trips</a>
        </li>
        <li>
          <a href="/CreateTrip">➕ Create Trip</a>
        </li>
        <li>
          <a onClick={handleLogout}>🚪 Logout</a>
        </li>
      </ul>
    

    </nav>
  );
};

export default Navbar;
