import React from "react";
import "./RegistrationPage.css";

export default function RegistrationPage() {
  return (
    <div className="register-container">
      <div className="register-left">
        <h1 className="register-title">
          QUICKEY
          <div className="register-underline"></div>
        </h1>
        <h2 className="register-here">Register Here</h2>
        <form className="register-form">
          <input className="register-input" type="text" placeholder="Username" />
          <input className="register-input" type="email" placeholder="Email" />
          <input className="register-input" type="password" placeholder="Password" />
          <input className="register-input" type="password" placeholder="Re-enter password" />
          <button className="register-proceed" type="submit">Proceed</button>
        </form>
      </div>
      <div className="register-right">
        <div className="register-terms">
          <h3>Terms and Conditions:</h3>
          <div className="register-terms-content">
            <p>etc...............................................................</p>
            <p>accept terms and conditions</p>
            <p>...............................................................</p>
            <p>privacy policy</p>
            <p>...............................................................</p>
          </div>
        </div>
      </div>
    </div>
  );
}