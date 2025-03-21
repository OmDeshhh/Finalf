import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const AdminPanel = () => {
  const [pathologists, setPathologists] = useState([]);

  useEffect(() => {
    const fetchPathologists = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const pendingPathologists = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "pathologist" && !user.approved);
      setPathologists(pendingPathologists);
    };

    fetchPathologists();
  }, []);

  const approvePathologist = async (id) => {
    await updateDoc(doc(db, "users", id), { approved: true });
    alert("Pathologist approved!");
    setPathologists(pathologists.filter((user) => user.id !== id));
  };

  return (
    <div>
      <h2>Admin Approval Panel</h2>
      {pathologists.length > 0 ? (
        pathologists.map((p) => (
          <div key={p.id}>
            <p>{p.email}</p>
            <button onClick={() => approvePathologist(p.id)}>Approve</button>
          </div>
        ))
      ) : (
        <p>No pending approvals.</p>
      )}
    </div>
  );
};

export default AdminPanel;
