import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // 1. Import the Link component
import API from "../api/api";
import "./Dashboard.css"; // 2. Import a new CSS file for hover effects

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, stockRes] = await Promise.all([
          API.get("/products"),
          API.get("/stock"),
        ]);
        setProducts(productsRes.data);
        setStock(stockRes.data.movements || []);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
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
      <h2 className="mb-4">Dashboard</h2>
      <div className="row">
        <div className="col-12 col-md-6 mb-4">
          {/* 3. Wrap the card in a Link component */}
          <Link to="/products" className="dashboard-card-link">
            <div className="card p-3 bg-light text-center h-100">
              <h5>Total Products</h5>
              <h3>{products.length}</h3>
            </div>
          </Link>
        </div>
        <div className="col-12 col-md-6 mb-4">
          {/* 4. Do the same for the stock card */}
          <Link to="/stock" className="dashboard-card-link">
            <div className="card p-3 bg-light text-center h-100">
              <h5>Stock Movements</h5>
              <h3>{stock.length}</h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}