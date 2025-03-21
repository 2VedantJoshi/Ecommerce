import React, { useContext } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from '../Components/Item/Item'

const ShopCategory = (props) => {
  const {all_product, loading, error} = useContext(ShopContext);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  const filteredProducts = all_product.filter(item => props.category === item.category);

  if (filteredProducts.length === 0) {
    console.log('No products found for category:', props.category);
    console.log('Available products:', all_product);
    return <div className="no-products">No products found in this category.</div>;
  }

  return (
    <div className='shop-category'>
      {error && (
        <div className="api-error-notification">
          {error}
        </div>
      )}
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexsort">
        <p>
          <span>Showing {filteredProducts.length}</span> out of {all_product.length} products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
        {filteredProducts.map((item, i) => (
          <Item 
            key={i} 
            id={item.id} 
            name={item.name} 
            image={item.image} 
            new_price={item.new_price} 
            old_price={item.old_price} 
          />
        ))}
      </div>
      {filteredProducts.length > 12 && (
        <div className="shopcategory-loadmore">
          Explore More
        </div>
      )}
    </div>
  )
}

export default ShopCategory
