import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Stethoscope } from 'lucide-react';
import { Eye, EyeOff, Clock, CheckCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginStatus, setLoginStatus] = useState("Login"); // "Login", "Login in Progress", "Login Successful"
  const [btnColor, setBtnColor] = useState("bg-blue-600"); // Button color state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginStatus("Login in Progress");
    setBtnColor("bg-yellow-500"); // Change to yellow when in progress

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.role === "pathologist") {
          if (userData.approved === true) {
            setLoginStatus("Login Successful");
            setBtnColor("bg-green-500"); // Change to green on success
            setTimeout(() => {
              navigate("/Pathologist-Dashboard");
            }, 1500); // Delay to show "Login Successful"
          } else {
            alert("Login successful, but your approval is pending or rejected.");
            setLoginStatus("Login");
            setBtnColor("bg-blue-600");
            return;
          }
        } else {
          setLoginStatus("Login Successful");
          setBtnColor("bg-green-500");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }
      }
    } catch (error) {
      alert("Login failed: " + error.message);
      setLoginStatus("Login");
      setBtnColor("bg-blue-600");
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 animate-gradient-bg z-0"></div>

      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-50 py-4 px-6 border-b border-gray-200 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Stethoscope className="h-6 w-6 text-purple-700" />
          <span className="text-xl font-bold text-gray-900">Karunya</span>
        </div>
        <button
          className={`${btnColor} px-6 py-2 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg`}
          disabled={loginStatus === "Login in Progress"} // Disable the button during login progress
        >
          {loginStatus === "Login in Progress" ? (
            <>
              <Clock className="animate-spin h-5 w-5 mr-2" />
              Login in Progress
            </>
          ) : loginStatus === "Login Successful" ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Login Successful
            </>
          ) : (
            "Login"
          )}
        </button>
      </nav>

      <div className="flex justify-center items-center min-h-screen py-8 mt-16 relative z-10">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-4 border-blue-600">
          <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center">
            <span className="mr-2 w-3 h-3 bg-blue-800 rounded-full animate-ping opacity-75"></span>
            <span className="text-blue-800">Login</span>
          </h2>

          <form onSubmit={handleLogin}>
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

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md mt-4 hover:bg-blue-700 transition-colors"
                disabled={loginStatus === "Login in Progress"} // Disable form submission while login in progress
              >
                Login
              </button>

              <div className="mt-4 text-center text-sm">
                Don’t have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600"
                  onClick={() => navigate("/signup/user")}
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
