import React, { useState } from 'react'
import './Popular.css'
import Item from '../Item/Item'
import { useEffect } from 'react';
import data_product from '../Assets/data';

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

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        const apiUrl = `${process.env.REACT_APP_API_URL}/popularinwomen`;
        console.log('Fetching popular products from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch popular products: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Popular products fetched:', data.length);
        
        // Fix image URLs that use localhost
        const fixedProducts = fixProductImageUrls(data, process.env.REACT_APP_API_URL);
        setPopularProducts(fixedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching popular products:', err);
        // Use fallback data
        console.log('Using fallback popular products data');
        setPopularProducts(data_product);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPopularProducts();
  }, []);
  
  if (loading) {
    return <div className="loading-popular">Loading popular products...</div>;
  }
  
  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      {error && <div className="api-error-notification">{error}</div>}
      <div className="popular-item">
        {popularProducts.map((item, i) => {
          return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        })}
      </div>
    </div>
  )
}

export default Popular
