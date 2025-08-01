import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/perfumes-data')
      .then(response => response.json())
      .then(data => {
        const uniqueBrands = [...new Set(data.map(perfume => perfume.brand))];
        
        const brandCategories = uniqueBrands.map(brand => {
          const brandPerfumes = data.filter(perfume => perfume.brand === brand);
          return {
            brand,
            imageUrl: brandPerfumes[0]?.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image',
            count: brandPerfumes.length
          };
        });
        
        setCategories(brandCategories);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching perfumes:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  return (
    <div className="categories-container">
      <h1 className="categories-title">Perfume Brands</h1>
      
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card perfume-card">
            <Link to={`/brand/${encodeURIComponent(category.brand)}`}>
              <div className="category-image-container">
                <img 
                  src={category.imageUrl} 
                  alt={category.brand} 
                  className="category-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
              </div>
              <h2 className="category-brand">{category.brand}</h2>
              <p className="category-count">{category.count} perfumes</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
