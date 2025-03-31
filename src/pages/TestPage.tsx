import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

const TestPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAddDoc = async () => {
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        text: "test!",
        timestamp: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "10px 24px" }}>
      <h1>Test API Response</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <br />
      <button onClick={handleAddDoc}>test!</button>
    </div>
  );
};

export default TestPage;
