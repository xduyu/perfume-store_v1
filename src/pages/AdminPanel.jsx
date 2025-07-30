import React, { useState, useEffect } from 'react';
import './admin_panel.css'; // Assuming you have a CSS file for styling

function AdminPanel() {
  const [perfumes, setPerfumes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', brand: '', price: '', imageUrl: '', about_parfum: '', volume: 50, gender: 'unisex' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchPerfumes();
    fetchBookings();
  }, []);
  
  async function fetchPerfumes() {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/admin/get-all-perfumes');
      const data = await res.json();
      setPerfumes(data);
    } catch {
      setError('Failed to fetch perfumes');
    } finally {
      setLoading(false);
    }
  }
  
  if (localStorage.getItem('adminid') !== 'admin_bzOn29NY1cmpOiXzPVfTjJKnPKc1mV1LszAOx6Jt8H2ojJCajvAi0XmNeWgJiEBB') {
    window.location.href = '/login';
    return null; // Prevent rendering if not logged in
  }
  
  async function fetchBookings() {
    try {
      const res = await fetch('http://localhost:3000/api/admin/booked-perfumes');
      const data = await res.json();
      setBookings(data);
    } catch {
      setError('Failed to fetch bookings');
    }
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

  const { name, brand, price, imageUrl, about_parfum, volume, gender } = form;
  if (!name || !brand || !price || !imageUrl || !about_parfum || !gender) {
    setError('All fields are required');
    return;
  }

  const params = new URLSearchParams({
    name,
    brand,
    price,
    imageUrl,
    about_parfum,
    volume,
    gender
  });

    try {
      let res;
      if (editId) {
        res = await fetch(`http://localhost:3000/api/admin/update-perfume/${editId}?${params}`);
      } else {
        res = await fetch(`http://localhost:3000/api/admin/add-new-perfume/?${params}`);
      }
      const data = await res.json();
      if (res.ok) {
        setSuccess(editId ? 'Perfume updated!' : 'Perfume added!');
        setForm({ name: '', brand: '', price: '', imageUrl: '', about_parfum: '', volume: 50 });
        setEditId(null);
        fetchPerfumes();
      } else {
        setError(data.message || 'Error occurred');
      }
    } catch {
      setError('Network error');
    }
  }

  function handleEdit(p) {
    setForm({
      name: p.name,
      brand: p.brand,
      price: p.price.toString(),
      imageUrl: p.imageUrl || '',
      about_parfum: p.about_parfum || '',
      volume: p.volume || 50,
      gender: p.gender || 'unisex'
    });
    setEditId(p.id);
    setSuccess(null);
    setError(null);
  }

  function cancelEdit() {
    setEditId(null);
    setForm({ name: '', brand: '', price: '', imageUrl: '', about_parfum: '', volume: 50 });
    setError(null);
    setSuccess(null);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this perfume?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/admin/delete-perfume/${id}`);
      const data = await res.json();
      if (res.ok) {
        setSuccess('Perfume deleted!');
        fetchPerfumes();
      } else {
        setError(data.message || 'Failed to delete');
      }
    } catch {
      setError('Network error');
    }
  }

  async function updateBookingStatus(id, status) {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/update-booking-status/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Booking status updated');
        fetchBookings();
      } else {
        setError(data.message || 'Failed to update booking');
      }
    } catch {
      setError('Network error');
    }
  }

  async function deleteBooking(id) {
    if (!window.confirm('Delete this booking?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/admin/delete-booking/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Booking deleted!');
        fetchBookings();
      } else {
        setError(data.message || 'Failed to delete booking');
      }
    } catch {
      setError('Network error');
    }
  }

  async function handleSetActive(id, isActive) {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/set-active-perfume/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Perfume is now ${!isActive ? 'available' : 'unavailable'}`);
        fetchPerfumes();
      } else {
        setError(data.message || 'Failed to update status');
      }
    } catch {
      setError('Network error');
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setForm(prev => ({ ...prev, imageUrl: `http://localhost:3000${data.url}` }));
        setSuccess('Image uploaded');
      } else {
        setError('Image upload failed');
      }
    } catch {
      setError('Image upload error');
    }
  }

  return (
    <div className="admin-container-admin">
      <h1 className="admin-title-admin">For Sellers</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <h3 className="form-title-admin">{editId ? 'Edit Perfume' : 'Add New Perfume'}</h3>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="form-input-admin" />
        <input type="text" name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} className="form-input-admin" />
        <input type="text" name="about_parfum" placeholder="About perfume" value={form.about_parfum} onChange={handleChange} className="form-input-admin" />
        <input type="number" name="volume" placeholder="Volume (ml)" value={form.volume} onChange={handleChange} className="form-input-admin" step="0.01" />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="form-input-admin" step="0.01" />
        <input type="text" name="imageUrl" placeholder="Image URL or upload below" value={form.imageUrl} onChange={handleChange} className="form-input-admin" />
        <select name="gender"value={form.gender}onChange={handleChange}className="form-input-admin">
          <option value="male">Men</option>
          <option value="female">Women</option>
          <option value="unisex">Unisex</option>
        </select>
        <input type="file" accept="image/*" onChange={handleFileUpload} className="form-file-input" />
        <div className="form-buttons">
          <button type="submit" className="btn-admin btn-submit-admin">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={cancelEdit} className="btn-admin btn-cancel-admin">Cancel</button>}
        </div>
      </form>

      {error && <p className="error-message-admin">{error}</p>}
      {success && <p className="success-message-admin">{success}</p>}

      <h3 className="section-title-admin">Perfumes</h3>
      {loading ? (
        <p>Loading...</p>
      ) : perfumes.length === 0 ? (
        <p>No perfumes found</p>
      ) : (
        <div className="perfume-grid-admin">
          {perfumes.map(p => (
            <div key={p.id} className="perfume-card-admin">
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.name} className="perfume-image-admin" />
              )}
              <h4 className="perfume-name-admin">{p.name}</h4>
              <p><strong>Brand:</strong> {p.brand}</p>
              <p><strong>Price:</strong> ${parseFloat(p.price).toFixed(2)} / {p.volume} / {p.gender}</p>
              <div className="perfume-actions-admin">
                <button onClick={() => handleEdit(p)} className="btn-admin btn-edit-admin">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="btn-admin btn-delete-admin">Delete</button>
                <button onClick={() => handleSetActive(p.id, p.isActive)} className="btn-admin btn-setActive-admin">{p.isActive ? 'unavailable' : 'available'}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="section-title-admin">Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="bookings-grid-admin">
          {bookings.map(b => (
            <div key={b.id} className="booking-card-admin">
              <p><strong>ID:</strong> {b.id}</p>
              <p><strong>Customer:</strong> {b.customerFullName || 'Unknown'}</p>
              <p><strong>Email:</strong> {b.customerEmail}</p>
              <p><strong>Perfume:</strong> {b.perfumeName}</p>
              <p><strong>Phone:</strong> {b.phoneNumber}</p>
              <p><strong>Address:</strong> {b.address}</p>
              <p><strong>Status:</strong> {b.status}</p>
              <div className="booking-actions-admin">
                <select
                  value={b.status}
                  onChange={e => updateBookingStatus(b.id, e.target.value)}
                  className="status-select-admin"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={() => deleteBooking(b.id)} className="btn-admin btn-delete-admin">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
