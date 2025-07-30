import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './AllPerfumes.css'
import { CiSearch } from "react-icons/ci";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}

function AllPerfumes() {
  const [perfumes, setPerfumes] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    async function fetchPerfumes() {
      setLoading(true)
      setError(null)
      try {
        let url = 'http://localhost:3000/api/perfumes-data'
        if (debouncedQuery.trim()) {
          url = `http://localhost:3000/api/perfumes-data/search?query=${encodeURIComponent(debouncedQuery)}`
        }
        const res = await fetch(url)
        if (!res.ok) throw new Error('Network error')
        const data = await res.json()
        setPerfumes(data)
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Ошибка при загрузке данных')
      } finally {
        setLoading(false)
      }
    }
    fetchPerfumes()
  }, [debouncedQuery])

  return (
    <div className="container">
      {/* <h1>All Perfumes</h1> */}
      <div className="searchBlock"><input type="text" className="search-input" placeholder="Search by name..." value={query} onChange={e => setQuery(e.target.value)}/><CiSearch className='searchImg' /></div>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p className='loading_Perfumes'>Loading...</p>
      ) : perfumes.length === 0 ? (
        <p className='not_found_Perfumes' >No perfumes found</p>
      ) : (
        <ul className="perfume-list">
          {perfumes.map(p => (
            <li key={p.id} className="perfume-card">
              <Link to={`/perfume/${p.id}`} className="perfume-link">
                <div className={`card-content ${!p.isActive ? 'blurred' : ''}`}>
                  <div className="imgBlock">
                    <img src={p.imageUrl} alt={p.name} />
                  </div>
                  <div className="aboutBlock">
                    <h3>{p.name}</h3>
                    <p>Brand: {p.brand}</p>
                    <p>Price: ${p.price} / {p.volume}ml. / {p.gender}</p>
                  </div>
                </div>
                {!p.isActive && (
                  <div className="unavailable-overlay">
                    <div className="cross">✖</div>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AllPerfumes
