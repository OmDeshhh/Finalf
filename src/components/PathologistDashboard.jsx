import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { 
  doc, getDoc, collection, query, where, onSnapshot, Timestamp, getDocs 
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth"; // ✅ Fixed missing import
import { useNavigate } from "react-router-dom";
import CreateAvailability from "./CreateAvailability"; // Import the component

const PathologistDashboard = () => {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  // Force refresh user token
  const refreshUserToken = async () => {
    if (auth.currentUser) {
      await auth.currentUser.getIdToken(true); // Force refresh
      console.log("🔄 User token refreshed!");
    }
  };

  useEffect(() => {
    refreshUserToken();
  }, []);

  // Handle authentication state changes (separated from availability fetching)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      } else {
        navigate("/login"); // Redirect if not logged in
      }
    });

    return () => unsubscribeAuth(); // Cleanup on unmount
  }, [navigate]);

  // Fetch availability in real-time
  useEffect(() => {
    if (auth.currentUser) {
      const q = query(
        collection(db, "availability"),
        where("userId", "==", auth.currentUser.uid),
        where("expiresAt", ">", Timestamp.now()) // Fetch only non-expired data
      );

      const unsubscribeAvailability = onSnapshot(q, (snapshot) => {
        const slots = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Updated Availability List: ", slots); // Debugging
        setAvailability(slots);
      });

      return () => unsubscribeAvailability(); // ✅ Fixed duplicate unsubscribe issue
    }
  }, []);

  // Fetch requests received from users
  useEffect(() => {
    if (user) {
      const fetchRequests = async () => {
        const requestsQuery = query(collection(db, "requests"), where("pathologistId", "==", auth.currentUser.uid));
        const requestsSnapshot = await getDocs(requestsQuery);
        const requestList = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(requestList);
      };
      fetchRequests();
    }
  }, [user]);

  // Handle Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Pathologist Dashboard</h2>
      <button onClick={() => setShowProfile(!showProfile)}>Profile</button>

      {showProfile && user && (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Company Name:</strong> {user.companyName}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p><strong>Services:</strong> {user.services?.join(", ")}</p>
        </div>
      )}

      {/* Create Availability Component */}
      <CreateAvailability />

      <h3>Current Availability</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        {availability.length > 0 ? (
          availability.map((slot) => (
            <div key={slot.id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
              <p><strong>Date:</strong> {slot.date}</p>
              <p><strong>Time:</strong> {slot.openingTime} - {slot.closingTime}</p>
            </div>
          ))
        ) : (
          <p>No availability set.</p>
        )}
      </div>

      <h3>Requests Received</h3>
      <table border="1" style={{ margin: "20px auto" }}>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Name</th>
            <th>Location</th>
            <th>WhatsApp Contact</th>
            <th>Upload</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req, index) => (
            <tr key={req.id}>
              <td>{index + 1}</td>
              <td>{req.userName}</td>
              <td>{req.location || "N/A"}</td>
              <td><a href={`https://wa.me/${req.contact}`} target="_blank">Chat</a></td>
              <td><button>Upload Report</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default PathologistDashboard;
