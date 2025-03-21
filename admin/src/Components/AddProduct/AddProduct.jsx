import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {
    const [image,setImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [productDetails,setProductDetails] = useState({
        name: "",
        image:"",
        new_price: "",
        old_price: "",
        category:"women"
    });

    const imageHandler = (e) =>{
        setImage(e.target.files[0]);
        setErrorMessage("");
    }

    const changeHandler = (e) =>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
        setErrorMessage("");
    }

    const Add_Product = async () => {
        try {
            setErrorMessage("");
            setLoading(true);
            
            if (!image) {
                setErrorMessage("Please select an image");
                setLoading(false);
                return;
            }

            if (!productDetails.name || !productDetails.new_price || !productDetails.old_price) {
                setErrorMessage("Please fill all the required fields");
                setLoading(false);
                return;
            }

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            console.log('Using backend URL:', backendUrl);
            
            let formData = new FormData();
            formData.append('product', image);

            // First, upload the image
            console.log('Uploading image to:', `${backendUrl}/upload`);
            const uploadResponse = await fetch(`${backendUrl}/upload`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });

            console.log('Upload response status:', uploadResponse.status);
            
            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                console.error('Image upload failed:', errorText);
                throw new Error(`Image upload failed: ${uploadResponse.status} ${errorText}`);
            }

            const responseData = await uploadResponse.json();
            console.log('Upload response data:', responseData);
            
            if (responseData.success) {
                // Fix the image URL to ensure it uses the correct backend URL
                let imageUrl = responseData.image_url;
                
                // Replace any localhost URL with the backend URL
                if (imageUrl.includes('localhost')) {
                    imageUrl = imageUrl.replace(/http:\/\/localhost:\d+/g, backendUrl);
                    console.log('Fixed image URL:', imageUrl);
                }
                
                const product = {
                    ...productDetails,
                    image: imageUrl
                };

                console.log('Adding product with data:', product);

                // Then, add the product
                const addProductResponse = await fetch(`${backendUrl}/addproduct`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product),
                });

                console.log('Add product response status:', addProductResponse.status);
                
                if (!addProductResponse.ok) {
                    const errorText = await addProductResponse.text();
                    console.error('Failed to add product:', errorText);
                    throw new Error(`Failed to add product: ${addProductResponse.status} ${errorText}`);
                }

                const addProductData = await addProductResponse.json();
                console.log('Add product response data:', addProductData);
                
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
                    setErrorMessage("Failed to add product: " + (addProductData.message || "Unknown error"));
                }
            } else {
                setErrorMessage("Failed to upload image: " + (responseData.message || "Unknown error"));
            }
        } catch (error) {
            console.error('Error adding product:', error);
            setErrorMessage("Error adding product: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='add-product'>
            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}
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
            <button 
                onClick={Add_Product} 
                className='addproduct-btn'
                disabled={loading}
            >
                {loading ? 'ADDING...' : 'ADD'}
            </button>
        </div>
    )
}

export default AddProduct