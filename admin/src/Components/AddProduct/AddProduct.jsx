import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {
    const [image,setImage] = useState(false);
    const [productDetails,setProductDetails] = useState({
        name: "",
        image:"",
        new_price: "",
        old_price: "",
        category:"women"
    });

    const imageHandler = (e) =>{
        setImage(e.target.files[0]);
    }

    const changeHandler = (e) =>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }

    const Add_Product = async () => {
        try {
            if (!image) {
                alert("Please select an image");
                return;
            }

            if (!productDetails.name || !productDetails.new_price || !productDetails.old_price) {
                alert("Please fill all the fields");
                return;
            }

            let formData = new FormData();
            formData.append('product', image);

            // First, upload the image
            const uploadResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Image upload failed');
            }

            const responseData = await uploadResponse.json();
            
            if (responseData.success) {
                // Update the image URL to use the backend URL instead of localhost
                const imageUrl = responseData.image_url.replace('http://localhost:5000', import.meta.env.VITE_BACKEND_URL);
                
                const product = {
                    ...productDetails,
                    image: imageUrl
                };

                // Then, add the product
                const addProductResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/addproduct`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product),
                });

                if (!addProductResponse.ok) {
                    throw new Error('Failed to add product');
                }

                const addProductData = await addProductResponse.json();
                
                if (addProductData.success) {
                    alert("Product Added Successfully!");
                    // Reset form
                    setProductDetails({
                        name: "",
                        image: "",
                        new_price: "",
                        old_price: "",
                        category: "women"
                    });
                    setImage(false);
                } else {
                    alert("Failed to add product: " + (addProductData.message || "Unknown error"));
                }
            } else {
                alert("Failed to upload image: " + (responseData.message || "Unknown error"));
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert("Error adding product: " + error.message);
        }
    }

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type Here'/>
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type Here'/>
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type Here'/>
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">kid</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img' alt="" />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
            </div>
            <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
        </div>
    )
}

export default AddProduct