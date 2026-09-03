import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from './Login'
import CreateTrip from './Createtrip.jsx'
import Mytrips from './Mytrips.jsx'
import Dashboard from './Dashboard'

import Register from './Register'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createtrip" element={<CreateTrip />} />
        <Route path="/mytrips" element={<Mytrips />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </BrowserRouter>
    
  )
}

export default App