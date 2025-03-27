import { useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import "./SignUp.css";
import backgroundImage from "./background.jpg";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPathologist = location.pathname.includes("pathologist");
  const isLogin = location.pathname === "/login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [services, setServices] = useState([]);

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
      () => alert("Unable to access location."),
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
        Object.assign(userData, {
          name,
          companyName,
          location: locationAddress,
          contactNumber,
          licenseNumber,
          services,
          approved: false,
        });
      } else {
        Object.assign(userData, {
          name: userName,
          age,
          contactNumber,
          address,
          weight,
          height,
          medicalConditions,
        });
      }

      await setDoc(doc(db, "users", user.uid), userData);
      alert(
        `Signup successful! ${
          isPathologist ? "Await admin approval." : "You can log in now."
        }`
      );
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="page-container">
      <div
        className="background-blur"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="form ">
        <h2 className="title">
          {isLogin ? "Login" : isPathologist ? "Pathologist Signup" : "User Signup"}
        </h2>

        <form className="submit-form"onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && !isPathologist && (
            <>
              <label>
                <input className="input" type="text" required onChange={(e) => setUserName(e.target.value)} />
                <span>Name</span>
              </label>
              <label>
                <input className="input" type="number" required onChange={(e) => setAge(e.target.value)} />
                <span>Age</span>
              </label>
            </>
          )}

          <label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <span>Email</span>
          </label>
          <label>
            <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <span>Password</span>
          </label>

          {!isLogin && (
            <>
              <label>
                <input className="input" type="password" required onChange={(e) => setConfirmPassword(e.target.value)} />
                <span>Confirm Password</span>
              </label>
              <label>
                <input className="input" type="text" required onChange={(e) => setContactNumber(e.target.value)} />
                <span>Contact Number</span>
              </label>
            </>
          )}

          {!isLogin && !isPathologist && (
            <>
              <label>
                <input className="input" type="text" value={address} required onChange={(e) => setAddress(e.target.value)} />
                <span>Address</span>
              </label>
              <button type="button" className="location-btn" onClick={getLocation}>📍 Get Location</button>
              <label>
                <input className="input" type="number" required onChange={(e) => setWeight(e.target.value)} />
                <span>Weight (kg)</span>
              </label>
              <label>
                <input className="input" type="number" required onChange={(e) => setHeight(e.target.value)} />
                <span>Height (cm)</span>
              </label>
              <label>
                <input className="input" type="text" onChange={(e) => setMedicalConditions(e.target.value)} />
                <span>Medical Conditions</span>
              </label>
            </>
          )}

          {!isLogin && isPathologist && (
            <>
              <label>
                <input className="input" type="text" required onChange={(e) => setName(e.target.value)} />
                <span>Name</span>
              </label>
              <label>
                <input className="input" type="text" required onChange={(e) => setCompanyName(e.target.value)} />
                <span>Company/Clinic Name</span>
              </label>
              <label>
                <input className="input" type="text" value={locationAddress} required onChange={(e) => setLocationAddress(e.target.value)} />
                <span>Address</span>
              </label>
              <button type="button" className="location-btn" onClick={getLocation}>📍 Get Location</button>
              <label>
                <input className="input" type="text" required onChange={(e) => setLicenseNumber(e.target.value)} />
                <span>License Number</span>
              </label>
              <div className="services-list">
                <label><strong>Services Provided:</strong></label>
                {availableServices.map((service) => (
                  <label key={service}>
                    <input type="checkbox" value={service} onChange={handleServiceChange} /> {service}
                  </label>
                ))}
              </div>
            </>
          )}

          <button type="submit" className="submit">{isLogin ? "Login" : "Sign Up"}</button>
          <div className="signin-redirect">
  Already a {isPathologist ? "pathologist" : "user"}?{" "}
  <button
    type="button"
    className="signin-link"
    onClick={() => navigate("/login")}
  >
    Sign in
  </button>
</div>

        </form>
      </div>
    </div>
  );
};

export default Signup;
