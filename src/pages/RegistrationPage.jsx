// src/pages/RegistrationPage.jsx

/**
 * RegistrationPage Component
 * -------------------------
 * Renders the registration form for new users.
 * Features:
 * - Collects user details (first name, last name, email, password, confirm password).
 * - Validates input and displays errors above the form.
 * - Requires acceptance of Terms and Conditions & Privacy Policy before proceeding.
 * - Sends a registration request to the backend API.
 * - On successful registration, stores the access token and redirects to the home page.
 * - Displays the full Terms and Conditions & Privacy Policy in a scrollable sidebar.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RegistrationPage.css";

export default function RegistrationPage() {
  const navigate = useNavigate();

  // --- State Management for Inputs ---
  const [fName, setFName] = useState(""); // First Name
  const [lName, setLName] = useState(""); // Last Name
  const [email, setEmail] = useState(""); // Email
  const [password, setPassword] = useState(""); // Password
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm Password
  const [error, setError] = useState(""); // Error message
  const [acceptedTerms, setAcceptedTerms] = useState(false); // Terms acceptance

  // --- API Base URL ---
  const API_URL = "https://supabase-socmed.vercel.app";

  /**
   * Handles form submission for registration.
   * Validates input fields, sends a POST request to the backend,
   * and handles the response.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- Input Validation ---
    if (!fName || !lName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // --- Prepare form data for API ---
      const params = new URLSearchParams();
      params.append('fName', fName);
      params.append('lName', lName);
      params.append('email', email);
      params.append('password', password);

      // --- Send registration request to backend ---
      const response = await axios.post(`${API_URL}/register`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // --- Handle successful registration ---
      if (response.data.access_token) {
        localStorage.setItem("authToken", response.data.access_token);
        navigate("/home");
      }

    } catch (err) {
      // --- Handle registration errors ---
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration Error:", err);
    }
  };

  return (
    <div className="register-container">
      {/* Left section: Registration form and branding */}
      <div className="register-left">
        {/* Logo and navigation */}
        <div 
          onClick={() => navigate("/")} 
          style={{ cursor: 'pointer', alignSelf: 'flex-start' }}
        >
          <h1 className="register-title">
            QUICKEY
            <div className="register-underline"></div>
          </h1>
        </div>
        <h2 className="register-here">Register Here</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          {/* Display error message if any */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* First Name input */}
          <input 
            className="register-input" 
            type="text" 
            placeholder="First Name"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
          />
          {/* Last Name input */}
          <input 
            className="register-input" 
            type="text" 
            placeholder="Last Name"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
          />
          {/* Email input */}
          <input 
            className="register-input" 
            type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Password input */}
          <input 
            className="register-input" 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Confirm Password input */}
          <input 
            className="register-input" 
            type="password" 
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {/* Accept Terms Checkbox */}
          <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
            <input
              type="checkbox"
              id="accept-terms"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              style={{ marginRight: "8px" }}
            />
            <label htmlFor="accept-terms" style={{ fontSize: "0.98rem" }}>
              I have read and accept the <b>Terms and Conditions & Privacy Policy</b>
            </label>
          </div>
          {/* Submit button */}
          <button
            className="register-proceed"
            type="submit"
            disabled={!acceptedTerms}
            style={{
              opacity: acceptedTerms ? 1 : 0.6,
              cursor: acceptedTerms ? "pointer" : "not-allowed"
            }}
          >
            Proceed
          </button>
        </form>
      </div>
      {/* Right section: Terms and Conditions */}
      <div className="register-right">
        <div className="register-terms">
          <h3>Quickey Terms and Conditions & Privacy Policy</h3>
          <div className="register-terms-content" style={{ maxHeight: "350px", overflowY: "auto", textAlign: "left", fontSize: "1rem" }}>
            <p><strong>Last Updated: June 18, 2025</strong></p>
            <p><strong>1. Introduction</strong><br />
              Welcome to <b>Quickey</b> (the “Service”), operated by <b>Quickey</b> (“we,” “us,” or “our”). By accessing or using our Service, you agree to be bound by these Terms and Conditions and our Privacy Policy (collectively, the “Terms”). If you do not agree, please refrain from using our Service.
            </p>
            <p><strong>2. Acceptance of Terms</strong><br />
              Your use of the Service constitutes agreement to these Terms. We may update these Terms periodically, and your continued use of our Service will be subject to the latest version. It is your responsibility to review the Terms from time to time.
            </p>
            <p><strong>Eligibility</strong><br />
              The Service is intended solely for users who are at least 13 years of age or the applicable minimum in your jurisdiction. By using our Service, you confirm that you meet the appropriate age requirements and that any consent from a parent or guardian has been secured if required.
            </p>
            <p><strong>4. Account Registration and Responsibilities</strong><br />
              <ul>
                <li><b>Account Creation:</b> To access certain features, you may need to register for an account. When creating an account, please provide accurate, complete, and up-to-date information.</li>
                <li><b>Security:</b> You are responsible for safeguarding your account credentials. Unauthorized use of your account should be reported to us immediately.</li>
                <li><b>Activity:</b> You are solely responsible for all activities that occur under your account, whether or not authorized by you.</li>
              </ul>
            </p>
            <hr />
            <p><strong>5. The Service</strong><br />
              <b>Quickey</b> is designed to offer social networking capabilities including sharing text, images, videos, and other media formats between users. The Service may include additional interactive features or integrations that are governed by these Terms or separate policies.
            </p>
            <hr />
            <p><strong>6. User Content</strong><br />
              <ul>
                <li><b>Ownership:</b> You retain all rights to any content you post.</li>
                <li><b>License:</b> By posting content on the Service, you grant us a worldwide, royalty-free, non-exclusive license to use, store, reproduce, modify, and distribute your content solely for operating and improving the Service.</li>
                <li><b>Responsibility:</b> You are solely responsible for your content, and it must comply with all applicable laws and not infringe on the rights of any third party.</li>
              </ul>
            </p>
            <hr />
            <p><strong>7. Acceptable Use</strong><br />
              While using the Service, you agree to:
              <ul>
                <li><b>Abide by the Law:</b> Follow all applicable local, national, and international laws.</li>
                <li><b>Respect Others:</b> Avoid harassment, hate speech, or posting any content that could harm others.</li>
                <li><b>Avoid Disruption:</b> Not attempt to disrupt or harm the Service or interfere with other users’ access.</li>
              </ul>
              Any misuse of the Service may result in account termination.
            </p>
            <hr />
            <p><strong>8. Privacy Policy</strong></p>
            <p><b>8.1. Information Collection</b><br />
              <ul>
                <li><b>Direct Information:</b> We collect information you provide during account registration (e.g., name, email address, profile details).</li>
                <li><b>Usage Data:</b> We gather data automatically regarding how you interact with the Service. This may include IP addresses, device type, browser type, and location data where permitted.</li>
                <li><b>Cookies:</b> We use cookies and similar technologies to enhance your experience and personalize content.</li>
              </ul>
            </p>
            <p><b>8.2. Use of Personal Information</b><br />
              We use your data to:
              <ul>
                <li>Operate and improve our Service.</li>
                <li>Personalize your experience.</li>
                <li>Provide customer support.</li>
                <li>Display targeted advertisements (where applicable).</li>
              </ul>
            </p>
            <p><b>8.3. Sharing and Disclosure</b><br />
              <ul>
                <li><b>Third-Party Partners:</b> We may share information with service providers who assist in operating our Service. These third parties are bound by confidentiality obligations.</li>
                <li><b>Legal Requirements:</b> We may disclose your information where required by law or in connection with legal claims.</li>
                <li><b>Consent:</b> We do not sell your personal data to third parties without your explicit consent.</li>
              </ul>
            </p>
            <p><b>8.4. Data Security</b><br />
              While we implement robust security practices to protect your data, no method of data transmission over the internet is 100% secure. You acknowledge that your use of our Service is at your own risk.
            </p>
            <p><b>8.5. Your Rights</b><br />
              Depending on your jurisdiction, you may have rights concerning your personal data, such as the right to access, correct, or delete your data. Please contact us to exercise these rights or for any privacy concerns.
            </p>
            <p><b>8.6. International Data Transfers</b><br />
              Your data may be processed and stored outside your country of residence. By using our Service, you consent to such transfers and processing in accordance with these Terms.
            </p>
            <hr />
            <p><strong>9. Intellectual Property</strong><br />
              All content, designs, graphics, and software provided through the Service are the property of <b>Quickey</b> or our licensors. No portion of the Service may be copied, modified, or redistributed without our express written consent, except as allowed by law.
            </p>
            <hr />
            <p><strong>10. Disclaimers and Limitation of Liability</strong><br />
              <ul>
                <li><b>As-Is Basis:</b> The Service is provided "as is" without any warranties, either express or implied. We do not guarantee that the Service will be uninterrupted or error-free.</li>
                <li><b>Liability:</b> Under no circumstances shall <b>Quickey</b> be liable for any indirect, incidental, consequential, or punitive damages related to your use of the Service.</li>
              </ul>
            </p>
            <hr />
            <p><strong>11. Indemnification</strong><br />
              You agree to indemnify and hold harmless <b>Quickey</b> and its affiliates from any claims, losses, liabilities, and expenses (including attorneys' fees) arising out of your use of the Service or your breach of these Terms.
            </p>
            <hr />
            <p><strong>12. Termination</strong><br />
              We reserve the right, at our sole discretion, to suspend or terminate your account and access to the Service at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or the Service.
            </p>
            <hr />
            <p><strong>13. Governing Law and Dispute Resolution</strong><br />
              These Terms shall be governed by and construed in accordance with the laws of <b>Republic of the Philippines</b>. Any disputes will be resolved through binding arbitration or in the appropriate court within the specified jurisdiction.
            </p>
            <hr />
            <p><strong>14. Changes to These Terms</strong><br />
              We may modify these Terms at any time by posting an updated version on our Service. Your continued use of the Service after such modifications constitutes acceptance of the new Terms.
            </p>
            <hr />
            <p><strong>15. Contact Information</strong><br />
              If you have questions regarding these Terms or our Privacy Policy, please reach out to us:<br />
              <b>Email:</b> support@quickey.com<br />
              <b>Mailing Address:</b> Pablo Ocampo Street, Makati City, Philippines
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}