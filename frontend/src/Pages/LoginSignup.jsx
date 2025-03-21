import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {

  const [state,setState] = useState("Login");
  const [formData,setFormData] = useState({
    username:"",
    password:"",
    email:""
  })

  const changeHandler = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const login = async () => {
    try {
      if (!formData.email || !formData.password) {
        alert("Please fill in all fields");
        return;
      }

      console.log('Attempting login with URL:', `${process.env.REACT_APP_API_URL}/login`);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Login response status:', response.status);
      const responseData = await response.json();
      console.log('Login response data:', responseData);

      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.errors || "Login failed");
      }
    } catch (error) {
      console.error('Login error details:', error);
      alert("Error during login. Please try again.");
    }
  }

  const signup = async () => {
    try {
      if (!formData.username || !formData.email || !formData.password) {
        alert("Please fill in all fields");
        return;
      }

      console.log('Attempting signup with URL:', `${process.env.REACT_APP_API_URL}/signup`);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Signup response status:', response.status);
      const responseData = await response.json();
      console.log('Signup response data:', responseData);

      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.errors || "Signup failed");
      }
    } catch (error) {
      console.error('Signup error details:', error);
      alert("Error during signup. Please try again.");
    }
  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>
          {state}
        </h1>

        <div className="loginsignup-fields">
          {state==="Sign Up"?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder="Your Name" />:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>

        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state==="Sign Up"?<p className='loginsignup-login'>
           Already have an account? 
           <span onClick={()=>{setState("Login")}}>Sign In</span>
        </p>:<p className='loginsignup-login'>
           Create an account? 
           <span onClick={()=>{setState("Sign Up")}}>Click Here</span>
        </p>}
       
        
        <div className="loginsignup-agree">
          <input type="Checkbox" name="" id="" />
          <p>By Continuing, I agree to the terms of use and privacy policy</p>
        </div>
      </div>
      
    </div>
  )
}

export default LoginSignup
