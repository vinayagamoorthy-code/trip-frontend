import { Link } from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Swal from "sweetalert2"
import "./Register.css"

const Login = () => {
  const [username, setUsername] = useState("");
  
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async(e) =>{
    e.preventDefault();
    if (!username || !password ) {
      alert("Please fill all details.");
      return;
    };
    try{
      const res = await axios.post('https://trip-backend-ula1.onrender.com/auth/login',
        { username , password }
      );
      let token = res.data.token;
      localStorage.setItem("token", token);
      

      console.log(res.status);
      if (res.status === 200){
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have successfully logged in.",
          timer : 2000,
          showConfirmButton: false
        });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid details.",
      });
    }
  }
  return (
    <div>
    <div className="register">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
      
        <label>
          Password:
          <input type="password"  name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <input className="btn" type="submit" value="Login" />
      </form>
      <p>Don't have an account? <Link to="/Register">Register here</Link></p>
     </div>
     <footer className="footer">
      <p>&copy; 2024 Travel Planner.</p> 
      <p>Made with ❤️ </p>
     </footer>
    </div>
  )
}

export default Login