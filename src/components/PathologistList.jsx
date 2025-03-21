import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const PathologistList = () => {
  const [pathologists, setPathologists] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const pathologistData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "pathologist" && user.approved); // Show only approved pathologists
      setPathologists(pathologistData);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div>
      <h2>Available Pathologists</h2>
      <ul>
        {pathologists.map((p) => (
          <li key={p.id}>{p.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default PathologistList;
