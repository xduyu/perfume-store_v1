import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './Perfume.css'  // подключаем CSS

function Perfume() {
  const { id } = useParams()
  const [perfume, setPerfume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [bookingStatus, setBookingStatus] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function fetchPerfume() {
      try {
        const res = await fetch(`http://localhost:3000/api/perfumes-data/${id}`)
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
        const data = await res.json()
        setPerfume(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPerfume()
  }, [id])

  async function handleBooking(e) {
    e.preventDefault()
    setBookingStatus(null)

    if (!firstName || !lastName || !customerEmail || !phoneNumber) {
      setBookingStatus({ error: 'Please fill out all fields' })
      return
    }

    try {
      const res = await fetch('http://localhost:3000/api/book-perfume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfumeId: id,
          perfumeName: perfume.name,
          firstName,
          lastName,
          customerEmail,
          phoneNumber,
          address,
        }),
      })

      const text = await res.text()
      let data = {}

      try {
        data = JSON.parse(text)
      } catch {
        console.error('Response is not valid JSON:', text)
        throw new Error('Invalid JSON')
      }

      if (res.ok) {
        setBookingStatus({ success: data.message || 'Booked successfully' })
        setFirstName('')
        setLastName('')
        setCustomerEmail('')
        setPhoneNumber('')
        setAddress('')
      } else {
        setBookingStatus({ error: data.message || 'Booking failed' })
      }
    } catch (err) {
      console.error(err)
      setBookingStatus({ error: 'Network error' })
    }
  }

  if (loading) return <p>Loading perfume details...</p>
  if (error) return <p className="error">Error: {error}</p>
  if (!perfume) return <p>Perfume not found.</p>

  return (
    <div className="perfume-container">
      <div className="perfume-image">
        <img src={perfume.imageUrl} alt={perfume.name} />
      </div>
      <div className="perfume-details">
        <h2 className='perfume-details-h2'>{perfume.name} <span className='parfume-details-is_active'>{perfume.isActive ? 'available' : 'unavailable'}</span></h2>
        <p><strong>Brand:</strong> {perfume.brand}</p>
        <p><strong>Price:</strong> ${perfume.price}</p>
        <p><strong>Gender:</strong> {perfume.gender}</p>
        {/* ЗДЕСЬ ДОБАВТЬ ABOUT, ОБЬЁМ //   TODO */}
        <p className='about_parfume-p'>{perfume.about_parfum}</p>
        <p className='p-d-volume'>{perfume.volume}ml.</p>
        <div className="btnBlocksParfum">
          {perfume.isActive ? (
            <button className="btn-primary" onClick={() => setShowModal(true)}>Book Now</button>
          ) : (<></>)}
          <button className="btn-back" onClick={() => window.location.href = '/'}>← Back</button>
        </div>
        
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="aboutParfumModal">
                <h3><strong>Book:</strong> {perfume.name}</h3>
                <h4><strong>Price:</strong> ${perfume.price} / {perfume.volume}ml. / {perfume.gender}</h4>
              </div>
              <form onSubmit={handleBooking} className="booking-form">
                <input
                  type="text"
                  placeholder="*First Name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="*Last Name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="*Email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="*Phone Number"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              {bookingStatus?.error && <p className="error">{bookingStatus.error}</p>}
              {bookingStatus?.success && <p className="success">{bookingStatus.success}</p>}
                <div className="form-buttons">
                  <button type="submit" className="btn-primary">Confirm Booking</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Perfume
