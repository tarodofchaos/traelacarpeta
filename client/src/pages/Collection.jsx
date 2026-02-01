import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Collection = () => {
  const [collection, setCollection] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    const res = await api.get('/collection');
    setCollection(res.data);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    setLoading(true);
    try {
      const res = await api.get(`/collection/search?q=${search}`);
      setSearchResults(res.data);
    } finally {
      setLoading(false);
    }
  };

  const addToCollection = async (card) => {
    await api.post('/collection', {
      card_id: card.id,
      quantity: 1
    });
    fetchCollection();
    setSearchResults([]); // Clear search after add
    setSearch('');
  };

  const removeItem = async (id) => {
    await api.delete(`/collection/${id}`);
    fetchCollection();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Virtual Binder</h2>
      
      {/* Search Section */}
      <div style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch}>
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search cards to add..." 
            style={{ padding: '0.5rem', width: '300px' }}
          />
          <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem' }}>Search</button>
        </form>
        
        {loading && <p>Searching...</p>}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {searchResults.map(card => (
            <div key={card.id} style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center' }}>
              <img src={card.small_image_uri} alt={card.name} style={{ width: '100%' }} />
              <p>{card.name}</p>
              <button onClick={() => addToCollection(card)}>Add to Binder</button>
            </div>
          ))}
        </div>
      </div>

      {/* Collection Grid */}
      <h3>Your Cards ({collection.length})</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {collection.map(item => (
          <div key={item.id} style={{ border: '1px solid #333', padding: '1rem', textAlign: 'center' }}>
             <img src={item.card.small_image_uri} alt={item.card.name} style={{ width: '100%' }} />
             <p><strong>{item.card.name}</strong></p>
             <p>Qty: {item.quantity} | {item.condition}</p>
             <button onClick={() => removeItem(item.id)} style={{ background: 'red', color: 'white' }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;
