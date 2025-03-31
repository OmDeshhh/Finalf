import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { Stethoscope } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");

  const [loading, setLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

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
            setAddress(data.results[0].formatted_address);
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
      setLoading(true);
      setRegistrationStatus("User Registration in Progress");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        email: user.email,
        role: "user",
        name: userName,
        contactNumber,
        age,
        address,
        location: locationAddress,
        weight,
        height,
        medicalConditions,
      };

      await setDoc(doc(db, "users", user.uid), userData);
      setRegistrationStatus("Sign Up Successfully!");
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      alert(error.message);
      setLoading(false);
      setRegistrationStatus("Sign Up Failed");
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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(prevState => !prevState);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 animate-gradient-bg z-0"></div>

      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-50 py-4 px-6 border-b border-gray-200 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Stethoscope className="h-6 w-6 text-purple-700" />
          <span className="text-xl font-bold text-gray-900">HealthGuard</span>
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
          {registrationStatus || 'Sign Up / Login'}
        </button>
      </nav>

      <div className="flex justify-center items-center min-h-screen py-8 mt-16 relative z-10">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-4 border-blue-600">
          <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center">
            <span className="mr-2 w-3 h-3 bg-blue-800 rounded-full animate-ping opacity-75"></span>
            <span className="text-blue-800">{isLogin ? "Login" : "User Signup"}</span>
          </h2>

          <form onSubmit={isLogin ? handleLogin : handleSignup}>
            <div className="space-y-4">
              <label className="block">
                <input
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                />
                <span className="text-sm text-gray-600">Email</span>
              </label>

              <label className="block relative">
                <input
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                  type={isPasswordVisible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                />
                <span className="text-sm text-gray-600">Password</span>
                <button type="button" onClick={togglePasswordVisibility} className="absolute right-4 top-3">
                  {isPasswordVisible ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </label>

              {!isLogin && (
                <>
                  <label className="block relative">
                    <input
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      id="confirmPassword"
                      name="confirmPassword"
                    />
                    <span className="text-sm text-gray-600">Confirm Password</span>
                    <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute right-4 top-3">
                      {isConfirmPasswordVisible ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                    </button>
                  </label>

                  <label className="block">
                    <input
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      id="userName"
                      name="userName"
                    />
                    <span className="text-sm text-gray-600">Name</span>
                  </label>

                  <label className="block">
                    <input
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                      type="number"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      id="age"
                      name="age"
                    />
                    <span className="text-sm text-gray-600">Age</span>
                  </label>

                  <label className="block">
                    <input
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      id="address"
                      name="address"
                    />
                    <span className="text-sm text-gray-600">Address</span>
                  </label>

                  <button
                    type="button"
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md mt-2"
                    onClick={getLocation}
                    id="getLocationBtn"
                    name="getLocation"
                  >
                    📍 Get Location
                  </button>

                  <label className="block">
                    <input
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                      type="number"
                      required
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      id="weight"
                      name="weight"
                    />
                    <span className="text-sm text-gray-600">Weight (kg)</span>
                  </label>

                  <label className="block">
                    <input
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                      type="number"
                      required
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      id="height"
                      name="height"
                    />
                    <span className="text-sm text-gray-600">Height (cm)</span>
                  </label>

                  <label className="block">
                    <input
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                      type="text"
                      value={medicalConditions}
                      onChange={(e) => setMedicalConditions(e.target.value)}
                      id="medicalConditions"
                      name="medicalConditions"
                    />
                    <span className="text-sm text-gray-600">Medical Conditions</span>
                  </label>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md mt-4 hover:bg-blue-700 transition-colors"
              >
                {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
              </button>

              <div className="mt-4 text-center text-sm">
                Already a user?{" "}
                <button
                  type="button"
                  className="text-blue-600"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
