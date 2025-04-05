import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { FaStethoscope } from "react-icons/fa"; // Assuming you're using react-icons for the stethoscope icon.

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [pathologists, setPathologists] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({ lat: 37.7749, lng: -122.4194 });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);


  // Check authentication and user data
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

  // Get user location and fetch pathologists
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        fetchNearbyPathologists(position.coords.latitude, position.coords.longitude);
      },
      (error) => console.error("Error fetching location:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  const fetchNearbyPathologists = (lat, lng) => {
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: 5000,
      keyword: "pathologist",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const pathologistDetails = results.map((place) => ({
          id: place.place_id,
          name: place.name,
          location: place.geometry.location,
          address: place.vicinity,
          rating: place.rating || "N/A",
          reviews: place.user_ratings_total || 0,
          phoneNumber: "Not Available",
        }));

        pathologistDetails.forEach((pathologist, index) => {
          const detailsRequest = {
            placeId: pathologist.id,
            fields: ["formatted_phone_number"],
          };

          service.getDetails(detailsRequest, (details, detailsStatus) => {
            if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK && details.formatted_phone_number) {
              pathologistDetails[index].phoneNumber = details.formatted_phone_number;
            }

            if (index === pathologistDetails.length - 1) {
              setPathologists(pathologistDetails);
            }
          });
        });
      }
    });
  };

  const handleBookNow = (pathologist) => {
    const pathologistData = {
      id: pathologist.id,
      name: pathologist.name,
      phone: pathologist.phoneNumber,
      specialization: pathologist.specialization || "N/A",
      address: pathologist.address,
    };

    navigate("/booking", { state: { pathologist: pathologistData } });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  // Handle profile options
  const handleProfileOption = (option) => {
    if (option === "Personal Details") {
      navigate("/profile");
    } else if (option === "Orders") {
      navigate("/orders");
    } else if (option === "Logout") {
      handleLogout();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gradient-to-b from-blue-50 to-white min-h-screen relative mt-20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-50 py-4 px-6 border-b border-gray-200 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaStethoscope className="h-6 w-6 text-purple-700" />
          <span className="text-xl font-bold text-gray-900">Karunya</span>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="px-6 py-2 bg-transparent text-blue-600 border border-blue-600 rounded-full text-sm font-medium"
            >
              Profile
            </button>
            {dropdownOpen && (
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

      <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-700">🩺 Nearby Pathologists</h2>

      <LoadScript googleMapsApiKey="AIzaSyBqkdtcT7470H4x0oH-FTBFOcSWQ_5U3A8" libraries={["places"]}>
        <GoogleMap
          mapContainerStyle={{ height: "300px", width: "100%", borderRadius: "12px" }}
          center={currentLocation}
          zoom={12}
        >
          <Marker position={currentLocation} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
          {pathologists.map((p) => (
            <Marker key={p.id} position={{ lat: p.location.lat(), lng: p.location.lng() }} />
          ))}
        </GoogleMap>
      </LoadScript>

      <div className="grid gap-6 mt-6">
        {pathologists.map((p) => (
          <div key={p.id} className="p-5 border-l-8 border-blue-500 shadow-xl bg-white rounded-xl">
            <h3 className="font-bold text-xl text-blue-600">{p.name}</h3>
            <p className="text-sm text-gray-500">📍 {p.address}</p>
            <p className="text-sm text-gray-500">⭐ {p.rating} ({p.reviews} reviews)</p>
            <p className="text-sm text-gray-500">📞 {p.phoneNumber}</p>
            <div className="mt-4 flex gap-3 justify-center items-center">
  <button
    className="bg-green-500 hover:bg-green-600 px-4 py-2 text-white rounded-lg"
    onClick={() => handleBookNow(p)}
  >
    ✅ Book Test
  </button>
  <button
    className="bg-gray-500 hover:bg-gray-600 px-4 py-2 text-white rounded-lg"
    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${p.location.lat()},${p.location.lng()}`, "_blank")}
  >
    📍 Get Directions
  </button>
  <button
    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded-lg"
    onClick={() => alert(`Calling ${p.phoneNumber}`)}
  >
    📞 Call Now
  </button>
</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
