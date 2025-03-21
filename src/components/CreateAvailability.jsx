import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

const CreateAvailability = () => {
  const [date, setDate] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAvailability = async () => {
    if (!date || !openingTime || !closingTime) {
      alert("Please select date and time");
      return;
    }

    if (!auth.currentUser) {
      alert("User not authenticated");
      return;
    }

    setLoading(true);

    try {
      const pathologistId = auth.currentUser.uid;
      const closingTimestamp = new Date(`${date}T${closingTime}`);

      const docRef = await addDoc(collection(db, "availability"), {
        userId: pathologistId,
        date,
        openingTime,
        closingTime,
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(closingTimestamp),
      });

      console.log("New Availability Created:", docRef.id);

      alert("Availability Created Successfully!");

      // Reset form
      setDate("");
      setOpeningTime("");
      setClosingTime("");
    } catch (error) {
      console.error("Error adding availability:", error);
      alert("Failed to create availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Create Availability</h3>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} />
      <input type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} />
      <button onClick={handleCreateAvailability} disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
};

export default CreateAvailability;
