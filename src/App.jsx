import {BrowserRouter, Routes, Route} from 'react-router-dom'
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
    </BrowserRouter>
  )
}

export default App