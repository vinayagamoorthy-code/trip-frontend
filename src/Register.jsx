import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Register.css"
import { toast } from "react-toastify";
const Register = () => {
  const[username , setUsername] = useState("");
  const[password , setPassword] = useState("");
  const[email , setEmail] = useState("")
  const navigate = useNavigate();


  const handleSubmit = async(e) =>{
      e.preventDefault();
      if (!username || !password || !email) {
        toast.warning("Please fill all details.");
        return;
      }
     try{
      const res = await axios.post('https://trip-backend-ula1.onrender.com/auth/register',
        { username , email , password }
      );
      console.log(res.status);
       if (res.status === 200 || res.status === 201) {
        toast.success("Registration successful! Please log in.");
         navigate("/");
       }
     } 
     catch (err) {
  console.log("Status:", err.response?.status);
  console.log("Data:", err.response?.data);
  console.log(err);
  if(err.response?.status === 409) {
    toast.error("Username already exists. Please choose a different username.");
  } else if(err.response?.status === 400) {
    toast.error("Invalid input. Please check your details and try again.");
  }
 
}
  }
  return (
    <div>
     <h1 className="maintext">✈️Travel Planner</h1>
    <div className="register">
     
       
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        < label>
          Create Username:
          <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
           Create Password:
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        
       
        <input className="btn" type="submit" value="Register" />

      </form>
      <p>Already have an account? <Link to="/">Login here</Link></p>
      </div>
    <footer className="footer">
      <p>&copy; 2024 Travel Planner.</p> 
      <p>Made with ❤️</p>
    </footer>
    </div>
  
  )
}

export default Register