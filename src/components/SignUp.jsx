import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPathologist = location.pathname.includes("pathologist");

  // Common States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Pathologist States
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [services, setServices] = useState([]);

  // User States
  const [userName, setUserName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");

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

        try {
          const apiKey = "AIzaSyBqkdtcT7470H4x0oH-FTBFOcSWQ_5U3A8";
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );

          const data = await response.json();

          if (data.status === "OK" && data.results.length > 0) {
            if (isPathologist) {
              setLocationAddress(data.results[0].formatted_address);
            } else {
              setAddress(data.results[0].formatted_address);
            }
          } else {
            alert("Failed to retrieve location.");
          }
        } catch (error) {
          alert("Error retrieving location.");
        }
      },
      () => {
        alert("Unable to access location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      if (
        isPathologist &&
        (!name ||
          !companyName ||
          !locationAddress ||
          !contactNumber ||
          !licenseNumber ||
          services.length === 0)
      ) {
        alert("All fields are required for pathologists.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData = {
        email: user.email,
        role: isPathologist ? "pathologist" : "user",
      };

      if (isPathologist) {
        userData.name = name;
        userData.companyName = companyName;
        userData.location = locationAddress;
        userData.contactNumber = contactNumber;
        userData.licenseNumber = licenseNumber;
        userData.services = services;
        userData.approved = false;
      } else {
        userData.name = userName;
        userData.age = age;
        userData.contactNumber = contactNumber;
        userData.address = address;
        userData.weight = weight;
        userData.height = height;
        userData.medicalConditions = medicalConditions;
      }

      await setDoc(doc(db, "users", user.uid), userData);
      alert(
        "Signup successful! " +
          (isPathologist ? "Await admin approval." : "You can log in now.")
      );
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center" }}>
        {isPathologist ? "Pathologist Signup" : "User Signup"}
      </h2>
      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        
        {!isPathologist && (
          <>
            <input type="text" placeholder="Name" onChange={(e) => setUserName(e.target.value)} required />
            <input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)} required />
          </>
        )}

        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} required />
        <input type="text" placeholder="Contact Number" onChange={(e) => setContactNumber(e.target.value)} required />

        {!isPathologist && (
          <>
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <button type="button" onClick={getLocation}>📍 Get Location</button>
            <input type="number" placeholder="Weight (kg)" onChange={(e) => setWeight(e.target.value)} required />
            <input type="number" placeholder="Height (cm)" onChange={(e) => setHeight(e.target.value)} required />
            <input type="text" placeholder="Medical Conditions" onChange={(e) => setMedicalConditions(e.target.value)} />
          </>
        )}

        {isPathologist && (
          <>
            <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
            <input type="text" placeholder="Company/Name" onChange={(e) => setCompanyName(e.target.value)} required />
            <input type="text" placeholder="Address" value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} required />
            <button type="button" onClick={getLocation}>📍 Get Location</button>
            <input type="text" placeholder="License Number" onChange={(e) => setLicenseNumber(e.target.value)} required />
            
            <div>
              <label><strong>Services Provided:</strong></label>
              {availableServices.map((service) => (
                <label key={service} style={{ display: "block" }}>
                  <input type="checkbox" value={service} onChange={handleServiceChange} /> {service}
                </label>
              ))}
            </div>
          </>
        )}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
