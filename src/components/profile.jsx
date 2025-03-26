import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setAuthUser(currentUser);
        await fetchUserData(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      // Fetch user details
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserDetails(userSnap.data());
      }

      // Fetch orders from Firestore
      const ordersQuery = query(collection(db, "orders"), where("userId", "==", userId));
      const orderSnap = await getDocs(ordersQuery);
      const firestoreOrders = orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch orders from localStorage
      const localOrders = JSON.parse(localStorage.getItem("bookings")) || [];

      // Merge both orders, ensuring uniqueness
      const allOrders = [...firestoreOrders, ...localOrders];

      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {userDetails ? (
        <div className="mb-6">
          <p><strong>Name:</strong> {userDetails.name || "N/A"}</p>
          <p><strong>Phone:</strong> {userDetails.phone || "N/A"}</p>
          <p><strong>Location:</strong> {userDetails.location || "N/A"}</p>
          <p><strong>Email:</strong> {authUser?.email || "N/A"}</p>
        </div>
      ) : <p className="text-gray-500">No user details found.</p>}

      <h3 className="text-xl font-semibold mb-3">Orders Placed</h3>
      {orders.length > 0 ? (
        <ul className="list-disc pl-6">
          {orders.map(order => (
            <li key={order.id} className="mb-2 p-3 border rounded-lg shadow-sm">
              <p><strong>Order ID:</strong> {order.id || "N/A"}</p>
              <p><strong>Appointment Date:</strong> {order.appointment?.date || "N/A"}</p>
              <p><strong>Appointment Time:</strong> {order.appointment?.time || "N/A"}</p>
              <p><strong>Pathologist:</strong> {order.pathologist || "N/A"}</p>
              <p><strong>Test Name(s):</strong> {order.tests?.map(test => test.name).join(", ") || "N/A"}</p>
            </li>
          ))}
        </ul>
      ) : <p className="text-gray-500">No orders found.</p>}
    </div>
  );
};

export default Profile;
