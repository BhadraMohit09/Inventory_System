import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../api/api";
// Import a new CSS file for our responsive table styles
import "./Products.css"; 

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    sku: "",
    name: "",
    category: "",
    stock: "",
    unitPrice: "",
  });
  const [editingId, setEditingId] = useState(null);

  // --- 1. Add loading and error states ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, form);
        toast.info("Product updated ✏️");
      } else {
        await API.post("/products", form);
        toast.success("Product added ✅");
      }
      setForm({ sku: "", name: "", category: "", stock: "", unitPrice: "" });
      setEditingId(null);
      fetchProducts();
    } catch {
      toast.error("Something went wrong ❌");
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product._id);
    window.scrollTo(0, 0); // Scroll to top to see the form
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await API.delete(`/products/${id}`);
      toast.warn("Product deleted 🗑️");
      fetchProducts();
    }
  };

  // --- Render loading and error states ---
  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2 className="mb-3">Products</h2>

      {/* --- 2. Make the form responsive --- */}
      <form onSubmit={handleSubmit} className="mb-4 row g-3 p-3 border rounded bg-light">
        <h5 className="col-12">{editingId ? "Edit Product" : "Add New Product"}</h5>
        <div className="col-sm-6 col-md-4 col-lg-2">
          <input type="text" name="sku" value={form.sku} placeholder="SKU" onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-sm-6 col-md-8 col-lg-3">
          <input type="text" name="name" value={form.name} placeholder="Name" onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-2">
          <input type="text" name="category" value={form.category} placeholder="Category" onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-6 col-sm-3 col-md-4 col-lg-2">
          <input type="number" name="stock" value={form.stock} placeholder="Stock" onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-6 col-sm-3 col-md-4 col-lg-2">
          <input type="number" step="0.01" name="unitPrice" value={form.unitPrice} placeholder="Unit Price" onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-12 col-lg-1 d-grid">
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {/* --- 3. Update the table for responsiveness --- */}
      <div className="table-responsive-cards">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Unit Price(₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td data-label="SKU">{p.sku}</td>
                <td data-label="Name">{p.name}</td>
                <td data-label="Category">{p.category}</td>
                <td data-label="Stock">{p.stock}</td>
                <td data-label="Unit Price">{p.unitPrice}</td>
                <td data-label="Actions">
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}