import React, { useEffect, useState } from 'react'
import './NewCollection.css'
import Item from '../Item/Item'
import new_collections from '../Assets/new_collections';

// Function to fix image URLs that use localhost
const fixProductImageUrls = (products, backendUrl) => {
  if (!products || !Array.isArray(products)) return products;
  
  return products.map(product => {
    if (product.image && product.image.includes('localhost')) {
      // Replace localhost URL with the actual backend URL
      const fixedImageUrl = product.image.replace(
        'http://localhost:5000', 
        backendUrl
      );
      return { ...product, image: fixedImageUrl };
    }
    return product;
  });
};

const NewCollection = () => {
  const [new_collection, setNew_collection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewCollection = async () => {
      try {
        setLoading(true);
        const apiUrl = `${process.env.REACT_APP_API_URL}/newcollection`;
        console.log('Fetching new collection from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch new collection: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('New collection fetched:', data.length);
        
        // Fix image URLs that use localhost
        const fixedProducts = fixProductImageUrls(data, process.env.REACT_APP_API_URL);
        setNew_collection(fixedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching new collection:', err);
        // Use fallback data
        console.log('Using fallback new collection data');
        setNew_collection(new_collections);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewCollection();
  }, []);

  if (loading) {
    return <div className="loading-collection">Loading new collection...</div>;
  }

  return (
    <div className='new-collections'>
        <h1>NEW COLLECTIONS</h1>
        <hr />
        {error && <div className="api-error-notification">{error}</div>}
        <div className="collections">
            {new_collection.map((item, i) => {
                return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
            })}
        </div>
    </div>
  )
}

export default NewCollection
