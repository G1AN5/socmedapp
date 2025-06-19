// App.jsx
// Root layout component that renders children (pages) inside the app.

import "./App.css";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
function App({ children }) {
 return (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage /> } />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} /> {/* Your new page */}
    </Routes>
  </Router>
 )
}

export default App;
