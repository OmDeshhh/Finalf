import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Your tests array remains unchanged
const tests = [
    { 
      id: 1, 
      name: "Glucose Fasting Test", 
      price: 99, 
      originalPrice: 160, 
      description: "This test measures blood sugar levels after an overnight fasting period to check if the blood glucose level is within normal range, helping to assess the risk of diabetes or other glucose-related conditions.", 
      reportsIn: "10 hours" 
    },
    { 
      id: 2, 
      name: "HBA1C Test", 
      price: 299, 
      originalPrice: 440, 
      description: "The HbA1c test, also known as the glycated hemoglobin test, is a blood test that provides an average blood sugar level over the past 2-3 months, aiding in the diagnosis and management of diabetes.", 
      reportsIn: "10 hours" 
    },
    { 
      id: 3, 
      name: "Glucose Random Test", 
      price: 99, 
      originalPrice: 160, 
      description: "This test measures blood glucose levels at random hours, helping in the screening and monitoring of diabetes, regardless of when the last meal was consumed.", 
      reportsIn: "10 hours" 
    },
    { 
      id: 4, 
      name: "Glucose PP (Post Prandial) Test", 
      price: 99, 
      originalPrice: 180, 
      description: "This test checks the body's response to sugar after a meal and is useful for diagnosing and monitoring diabetes or pre-diabetes by analyzing blood glucose levels post-meal.", 
      reportsIn: "10 hours" 
    },
    { 
      id: 5, 
      name: "Insulin Fasting Test", 
      price: 699, 
      originalPrice: 1200, 
      description: "Insulin is produced by the pancreas' beta cells. This test helps evaluate insulin levels in the blood during fasting to identify conditions like Type 1 (IDDM) or Type 2 diabetes.", 
      reportsIn: "48 hours" 
    },
    { 
      id: 6, 
      name: "Microalbumin - Creatinine Ratio, Spot Urine", 
      price: 549, 
      originalPrice: 1140, 
      description: "This test measures small amounts of albumin in a spot urine sample to detect early signs of kidney damage, especially in diabetic patients.", 
      reportsIn: "24 hours" 
    },
    { 
      id: 7, 
      name: "C Peptide Fasting Test", 
      price: 1050, 
      originalPrice: 3000, 
      description: "The C-peptide test measures the concentration of C-peptide in the blood or urine. It is important for evaluating insulin production levels and helps in diagnosing diabetes and pancreatic issues.", 
      reportsIn: "48 hours" 
    },
    { 
      id: 8, 
      name: "Insulin PP (Post Prandial) Test", 
      price: 800, 
      originalPrice: 1200, 
      description: "This test measures insulin levels after a meal and helps diagnose pre-diabetes, diabetes, and insulin resistance by evaluating insulin responses post-meal.", 
      reportsIn: "48 hours" 
    },
    { 
      id: 9, 
      name: "Urine Glucose Fasting Test", 
      price: 99, 
      originalPrice: 160, 
      description: "This test measures glucose levels in urine after an overnight fasting period and is useful in screening for diabetes and monitoring its progression.", 
      reportsIn: "12 hours" 
    },
    { 
      id: 10, 
      name: "HOMA Index Insulin Resistance Test", 
      price: 920, 
      originalPrice: 2200, 
      description: "This test helps in assessing insulin resistance and evaluating the risks of developing type 2 diabetes and cardiovascular diseases. It is an important diagnostic tool for metabolic syndrome.", 
      reportsIn: "48 hours" 
    },
    { 
      id: 11, 
      name: "Urine Glucose PP (Post Prandial) Test", 
      price: 99, 
      originalPrice: 160, 
      description: "This test measures glucose levels in urine after a meal and helps to monitor and screen for diabetes. It provides insight into how the body processes sugar after eating.", 
      reportsIn: "12 hours" 
    },
    { 
      id: 12, 
      name: "Fructosamine Test", 
      price: 520, 
      originalPrice: 1100, 
      description: "This test assesses blood glucose levels over the past 2-3 weeks and is often used for short-term monitoring of diabetes management. It can help adjust treatment for patients with fluctuating blood sugar levels.", 
      reportsIn: "6 days" 
    }
];

const Booking = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedTests, setSelectedTests] = useState([]);
    const [user, setUser] = useState(null);
    const [members, setMembers] = useState([]);
    const [newMember, setNewMember] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    // Listen for authentication state changes
    // Listen for authentication state changes
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
            setMembers((prevMembers) => {
                // Ensure we only add the user if they are not already in the list
                return prevMembers.includes(currentUser.displayName) ? prevMembers : [currentUser.displayName, ...prevMembers];
            });
        }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
}, []);


    const handleTestSelection = (testId) => {
        setSelectedTests((prev) =>
            prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
        );
    };

    const handleAddMember = () => {
        if (newMember.trim()) {
            setMembers((prevMembers) => [...prevMembers, newMember.trim()]); // Update state correctly
            setNewMember(""); // Reset the input field
        }
    };

    const handleSubmit = async () => {
        if (!user) {
            alert("You must be logged in to book a test.");
            return;
        }

        try {
            await addDoc(collection(db, "orders"), {
                userId: user.uid,
                pathologist: state?.pathologist?.name || "Unknown",
                tests: selectedTests.map((id) => tests.find((t) => t.id === id)),
                members,
                appointment: { date, time },
                timestamp: serverTimestamp(),
            });
            alert("Booking Confirmed!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error booking test:", error);
            alert("Error booking test. Please try again.");
        }
    };

    const getMinDate = () => new Date().toISOString().split("T")[0];

    const isSunday = (selectedDate) => new Date(selectedDate).getDay() === 0;

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Step {step} of 4</h2>

            {step === 1 && (
                <div>
                    <h3 className="text-xl font-bold mb-2">Select Tests</h3>
                    <table className="w-full border">
                        <thead>
                            <tr className="border-b">
                                <th>Select</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th>Reports In</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tests.map((test) => (
                                <tr key={test.id} className="border-b">
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedTests.includes(test.id)}
                                            onChange={() => handleTestSelection(test.id)}
                                        />
                                    </td>
                                    <td>{test.name}</td>
                                    <td>₹{test.price} (₹{test.originalPrice})</td>
                                    <td>{test.description}</td>
                                    <td>{test.reportsIn}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={() => setStep(2)}>
                        Next
                    </button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h3 className="text-xl font-bold mb-2">Add Members</h3>
                    {members.map((member, index) => (
                        <p key={index} className="border p-2 rounded">{member}</p>
                    ))}
                    <input
                        type="text"
                        className="border p-2 rounded mt-2"
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                        placeholder="Enter member name"
                    />
                    <button className="bg-gray-500 text-white px-4 py-2 rounded mt-2" onClick={handleAddMember}>
                        + Add Member
                    </button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={() => setStep(3)}>
                        Next
                    </button>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h3 className="text-xl font-bold mb-2">Select Date & Time</h3>
                    <input
                        type="date"
                        className="border p-2 rounded mb-2"
                        min={getMinDate()}
                        value={date}
                        onChange={(e) => !isSunday(e.target.value) && setDate(e.target.value)}
                    />
                    {isSunday(date) && <p className="text-red-500">Sundays are not available.</p>}
                    <input
                        type="time"
                        className="border p-2 rounded mb-2"
                        min="10:00"
                        max="21:00"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={() => setStep(4)}>
                        Next
                    </button>
                </div>
            )}

{step === 4 && (
    <div>
        <h3 className="text-xl font-bold mb-2">Final Review</h3>
        <table className="w-full border">
            <tbody>
                <tr><td>Pathologist</td><td>{state?.pathologist?.name || "Unknown"}</td></tr>
                <tr><td>Tests</td><td>{selectedTests.map(id => tests.find(t => t.id === id)?.name).join(", ")}</td></tr>
                <tr><td>Members</td><td>{members.length > 0 ? members.join(", ") : "No members added"}</td></tr>
                <tr><td>Date</td><td>{date}</td></tr>
                <tr><td>Time</td><td>{time}</td></tr>
            </tbody>
        </table>
        <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={handleSubmit}>
            Confirm Booking
        </button>
    </div>
)}
        </div>
    );
};

export default Booking;
