import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/properties');
        setProperties(response.data);
      } catch (err) {
        setError('Error fetching properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Real Estate Listings</h1>
      </header>
      <main>
        <div className="property-list">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div key={property.id} className="property-card">
                <img src={property.images[0] || 'https://via.placeholder.com/300'} alt={property.title} />
                <div className="property-details">
                  <h2>{property.title}</h2>
                  <p className="price">${property.price.toLocaleString()}</p>
                  <p className="location">{property.location}</p>
                  <p>{property.bedrooms} beds | {property.bathrooms} baths | {property.area} sqft</p>
                </div>
              </div>
            ))
          ) : (
            <div>No properties found.</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
