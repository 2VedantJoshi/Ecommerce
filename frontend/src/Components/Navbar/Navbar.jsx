import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import nav_dropdown from '../Assets/nav_dropdown.png'
import { ShopContext } from '../../Context/ShopContext'

const Navbar = () => {

    const [menu,setMenu] = useState("shop");
    const {getTotalItems} = useContext(ShopContext);
    const menuRef = useRef();

    const dropdown_toggle = (e) =>{
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }

  return (
    <div className='navbar'>
        <div className="nav-logo">
            <img src="data:image/png;base64,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" alt="" />
            <p>Vcommerce</p>
        </div>
        <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
            <ul ref={menuRef} className="nav-menu">
              <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration: 'none'}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
              <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration: 'none'}} to='/mens'>Men</Link>{menu==="mens"?<hr/>:<></>}</li>
              <li onClick={()=>{setMenu("womens")}}><Link style={{textDecoration: 'none'}} to='/womens'>Women</Link>{menu==="womens"?<hr/>:<></>}</li>
              <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration: 'none'}} to='/kids'>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
            </ul>
            <div className="nav-login-cart">
              {localStorage.getItem('auth-token')
                ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
                :<Link to='/Login'><button>Login</button></Link>}              
                <Link to='/cart'><img src={cart_icon} alt="" /></Link>
                <div className="nav-cart-counter">{getTotalItems()}</div>
            </div>
      
    </div>
  )
}

export default Navbar
