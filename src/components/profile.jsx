import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

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
        setHeight(userSnap.data().height || "");
        setWeight(userSnap.data().weight || "");
      }

      // Fetch orders from Firestore
      const ordersQuery = query(collection(db, "orders"), where("userId", "==", userId));
      const orderSnap = await getDocs(ordersQuery);
      const firestoreOrders = orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch orders from localStorage
      const localOrders = JSON.parse(localStorage.getItem("bookings")) || [];

      // Merge both orders, ensuring uniqueness
      const allOrders = [...firestoreOrders];

      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle dropdown menu options
  const handleProfileOption = (option) => {
    if (option === "Logout") {
      auth.signOut();
    }
    setIsDropdownOpen(false);
  };

  // Handle profile editing (Height & Weight)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", authUser.uid);
      await updateDoc(userRef, {
        height,
        weight,
      });
      setEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-50 py-4 px-6 border-b border-gray-200 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900">Karunya</span>
        </div>
        <div className="flex space-x-4">
          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="px-6 py-2 bg-transparent text-blue-600 border border-blue-600 rounded-full text-sm font-medium"
            >
              Profile
            </button>
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <ul className="space-y-2 p-2">
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded"
                    onClick={() => handleProfileOption("Personal Details")}
                  >
                    Personal Details
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded"
                    onClick={() => handleProfileOption("Orders")}
                  >
                    Orders
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded"
                    onClick={() => handleProfileOption("Logout")}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-24">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
        
        {userDetails ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p><strong>Name:</strong> {userDetails.name || "N/A"}</p>
              <p><strong>Email:</strong> {authUser?.email || "N/A"}</p>
            </div>

            {/* Editable fields: Height and Weight */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p><strong>Height:</strong> {editing ? (
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Height"
                  />
                ) : (
                  height || "N/A"
                )}</p>
                {editing ? (
                  <button
                    onClick={handleEditSubmit}
                    className="bg-blue-500 text-white py-2 px-4 rounded-full"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-full"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center">
                <p><strong>Weight:</strong> {editing ? (
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Weight"
                  />
                ) : (
                  weight || "N/A"
                )}</p>
                {editing ? (
                  <button
                    onClick={handleEditSubmit}
                    className="bg-blue-500 text-white py-2 px-4 rounded-full"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-full"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            
          </div>
        ) : (
          <p className="text-gray-500">No user details found.</p>
        )}

        <h3 className="text-xl font-semibold mb-3">Orders Placed</h3>
        {orders.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2">
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
        ) : (
          <p className="text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
