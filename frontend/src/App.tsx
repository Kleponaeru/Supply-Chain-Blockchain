// src/App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Manufacturer from "./pages/Manufacturer";
import Distributor from "./pages/Distributor";
import Retailer from "./pages/Retailer";

function App() {
  const [role, setRole] = useState<number>(0);

  if (!role) return <Login setUserRole={setRole} />;

  return (
    <Router>
      <Routes>
        {role === 1 && <Route path="/" element={<Manufacturer />} />}
        {role === 2 && <Route path="/" element={<Distributor />} />}
        {role === 3 && <Route path="/" element={<Retailer />} />}
      </Routes>
    </Router>
  );
}

export default App;
