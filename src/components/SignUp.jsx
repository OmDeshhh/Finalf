import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPathologist = location.pathname.includes("pathologist");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [services, setServices] = useState([]);

  const availableServices = [
    "HBA1c",
    "Fasting Insulin",
    "Homa IR",
    "Lipid Profile",
    "Blood Sugar Test",
  ];

  const handleServiceChange = (e) => {
    const value = e.target.value;
    setServices((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const getLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Coordinates:", latitude, longitude);

        try {
          const apiKey = "AIzaSyBqkdtcT7470H4x0oH-FTBFOcSWQ_5U3A8"; // Replace with your actual API key
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );

          const data = await response.json();
          console.log("Geocode API Response:", data);

          if (data.status === "OK" && data.results.length > 0) {
            setLocationAddress(data.results[0].formatted_address);
          } else {
            alert("Failed to retrieve location. Check API key and billing settings.");
          }
        } catch (error) {
          console.error("Error fetching geolocation data:", error);
          alert("Error retrieving location. Try again later.");
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        alert(
          "Unable to access location. Ensure GPS is enabled and try again."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (isPathologist && (!companyName || !locationAddress || !contactNumber || !licenseNumber || services.length === 0)) {
        alert("All fields are required for pathologists.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        email: user.email,
        role: isPathologist ? "pathologist" : "user",
      };

      if (isPathologist) {
        userData.companyName = companyName;
        userData.location = locationAddress;
        userData.contactNumber = contactNumber;
        userData.licenseNumber = licenseNumber;
        userData.services = services;
        userData.approved = false; // Needs admin approval
      }

      await setDoc(doc(db, "users", user.uid), userData);
      alert("Signup successful! " + (isPathologist ? "Await admin approval." : "You can log in now."));
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center" }}>{isPathologist ? "Pathologist Signup" : "User Signup"}</h2>
      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />

        {isPathologist && (
          <>
            <input type="text" placeholder="Company/Name" onChange={(e) => setCompanyName(e.target.value)} required style={inputStyle} />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input type="text" placeholder="Click to get location" value={locationAddress} readOnly required style={{ ...inputStyle, flex: 1 }} />
              <button type="button" onClick={getLocation} style={buttonStyle}>📍</button>
            </div>
            <input type="text" placeholder="Contact Number (WhatsApp)" onChange={(e) => setContactNumber(e.target.value)} required style={inputStyle} />
            <input type="text" placeholder="License Number" onChange={(e) => setLicenseNumber(e.target.value)} required style={inputStyle} />
            <div>
              <label><strong>Services Provided:</strong></label>
              {availableServices.map((service) => (
                <label key={service} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <input type="checkbox" value={service} onChange={handleServiceChange} /> {service}
                </label>
              ))}
            </div>
          </>
        )}

        <button type="submit" style={buttonStyle}>Sign Up</button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "none",
  background: "#007bff",
  color: "#fff",
  cursor: "pointer",
};

export default Signup;
