import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, signOut } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>User Dashboard</h2>
      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserDashboard;
