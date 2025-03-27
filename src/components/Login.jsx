import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./LoginStyles.css";
import backgroundImage from "./background.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.role === "pathologist") {
          if (userData.approved === true) {
            navigate("/Pathologist-Dashboard");
          } else {
            alert("Login successful, but your approval is pending or rejected.");
            return;
          }
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div
        className="auth-background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="login-container">
        <h2 className="heading">Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <label className="auth-label">
            <input
              className="auth-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Email</span>
          </label>
          <label className="auth-label">
            <input
              className="auth-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
          </label>
          <button type="submit" className="login-button">
            Login
          </button>
          <div className="redirect-msg">
            Don’t have an account?
            <button
              type="button"
              className="redirect-link"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
