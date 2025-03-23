import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs, query, where, addDoc } from "firebase/firestore"; // ✅ Fixed missing import
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [pathologists, setPathologists] = useState([]);
  const [selectedPathologist, setSelectedPathologist] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [requests, setRequests] = useState([]); // ✅ Track requests sent by user
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchAvailablePathologists = async () => {
      try {
        const availabilityQuery = query(collection(db, "availability"));
        const availabilitySnapshot = await getDocs(availabilityQuery);
        const availablePathologistIds = availabilitySnapshot.docs.map(doc => doc.data().userId);

        if (availablePathologistIds.length === 0) {
          setPathologists([]); 
          return;
        }

        const pathologistsQuery = query(
          collection(db, "users"),
          where("role", "==", "pathologist"),
          where("approved", "==", true),
          where("__name__", "in", availablePathologistIds)
        );

        const pathologistsSnapshot = await getDocs(pathologistsQuery);
        const pathologistList = pathologistsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPathologists(pathologistList);
      } catch (error) {
        console.error("Error fetching pathologists:", error);
      }
    };

    fetchAvailablePathologists();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchRequests = async () => {
        const requestsQuery = query(collection(db, "requests"), where("userId", "==", auth.currentUser.uid));
        const requestsSnapshot = await getDocs(requestsQuery);
        const requestList = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(requestList);
      };

      fetchRequests();
    }
  }, [user]);

  const handleRequest = async () => {
    if (!selectedPathologist || !selectedDate || !selectedTime) {
      alert("Please select a pathologist, date, and time.");
      return;
    }

    try {
      await addDoc(collection(db, "requests"), {
        userId: auth.currentUser.uid,
        userName: user.name,
        pathologistId: selectedPathologist.id,
        pathologistName: selectedPathologist.companyName,
        date: selectedDate,
        time: selectedTime,
        status: "pending",
      });
      alert("Request sent successfully!");
    } catch (error) {
      console.error("Error sending request: ", error);
    }
  };

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

          <h3>Select Available Pathologist</h3>
          <select onChange={(e) => setSelectedPathologist(JSON.parse(e.target.value))}>
            <option value="">-- Select Pathologist --</option>
            {pathologists.map((pathologist) => (
              <option key={pathologist.id} value={JSON.stringify(pathologist)}>
                {pathologist.companyName} - {pathologist.contactNumber}
              </option>
            ))}
          </select>

          <h3>Select Date & Time</h3>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />

          <button onClick={handleRequest}>Send Request</button>

          <h3>Requests Sent</h3>
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
                  <td>{req.pathologistName}</td>
                  <td>{req.location || "N/A"}</td>
                  <td><a href={`https://wa.me/${req.contact}`} target="_blank">Chat</a></td>
                  <td>--</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserDashboard;
