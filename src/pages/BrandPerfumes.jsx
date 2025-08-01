import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BrandPerfumes.css';

function BrandPerfumes() {
  const { brand } = useParams();
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/perfumes-data')
      .then(response => response.json())
      .then(data => {
        const brandPerfumes = data.filter(p => p.brand === decodeURIComponent(brand));
        setPerfumes(brandPerfumes);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching perfumes:', error);
        setLoading(false);
      });
  }, [brand]);

  if (loading) {
    return <div className="brand-loading">Loading perfumes...</div>;
  }

  return (
    <div className="brand-perfumes-container">
      <h1 className="brand-title">{decodeURIComponent(brand)} Perfumes</h1>
      
      {perfumes.length === 0 ? (
        <p>No perfumes found for this brand.</p>
      ) : (
        <div className="brand-perfumes-grid">
          {perfumes.map(perfume => (
            <div key={perfume.id} className="brand-perfume-card perfume-card">
              <Link to={`/perfume/${perfume.id}`}>
                <img 
                  src={perfume.imageUrl} 
                  alt={perfume.name} 
                  className="brand-perfume-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
                <h3>{perfume.name}</h3>
                <p>${perfume.price} / {perfume.volume}ml. / {perfume.gender}</p>
                {!perfume.isActive && (
                  <div className="unavailable-overlay">
                    <div className="cross">✖</div>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
      <Link to="/categories" className="back-link">← Back to Categories</Link>
    </div>
  );
}

export default BrandPerfumes;
