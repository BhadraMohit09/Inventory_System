import { useEffect, useState } from "react";
import API from "../api/api";
// Import a CSS file for our responsive styles
import "./Stock.css";

export default function Stock() {
  const [movements, setMovements] = useState([]);
  
  // --- 1. Add loading and error states ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await API.get("/stock");
        setMovements(res.data.movements || []);
      } catch (err) {
        setError("Failed to fetch stock movements.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  // --- 2. Render loading and error states ---
  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-3">Stock Movements</h2>
      
      {/* --- 3. Update table for responsiveness --- */}
      <div className="table-responsive-cards">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Unit Price(₹)</th>
              <th>Total Value(₹)</th>
              <th>Reference</th>
              <th>Remarks</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m._id}>
                <td data-label="Product">{m.productId?.name || "N/A"}</td>
                <td data-label="Type">
                  {/* Bonus: Add a visual badge for the type */}
                  <span className={`badge ${m.type === 'IN' ? 'bg-success' : 'bg-danger'}`}>
                    {m.type}
                  </span>
                </td>
                <td data-label="Quantity">{m.qty}</td>
                <td data-label="Unit Price">{m.unitPrice?.toFixed(2)}</td>
                <td data-label="Total Value">{m.totalValue?.toFixed(2)}</td>
                <td data-label="Reference">{m.reference}</td>
                <td data-label="Remarks">{m.remarks}</td>
                <td data-label="Location">{m.location}</td>
              </tr>
            ))}
            {movements.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center">No stock movements found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}