import React, { createContext, useEffect, useState } from "react";
import all_product_data from '../Components/Assets/all_product';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingFallbackData, setUsingFallbackData] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const apiUrl = `${process.env.REACT_APP_API_URL}/allproducts`;
                console.log('Attempting to fetch products from:', apiUrl);
                console.log('Current environment:', process.env.NODE_ENV);
                console.log('API URL from env:', process.env.REACT_APP_API_URL);
                
                const response = await fetch(apiUrl);
                
                console.log('Products response status:', response.status);
                console.log('Response headers:', Object.fromEntries(response.headers.entries()));
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`);
                }

                const data = await response.json();
                console.log('Products fetched successfully:', {
                    count: data.length,
                    sample: data[0],
                    apiUrl: apiUrl
                });
                
                if (!Array.isArray(data)) {
                    console.error('Received data is not an array:', data);
                    throw new Error('Invalid data format received');
                }
                
                setAll_Product(data);
                setError(null);
                setUsingFallbackData(false);
            } catch (err) {
                console.error('Error fetching products - Using fallback data:', {
                    error: err.message,
                    stack: err.stack,
                    apiUrl: process.env.REACT_APP_API_URL
                });
                
                // Use fallback data from local file
                console.log('Using fallback data from local files');
                setAll_Product(all_product_data);
                setUsingFallbackData(true);
                setError(`Using fallback data. API error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        const fetchCart = async () => {
            const authToken = localStorage.getItem('auth-token');
            if (authToken) {
                try {
                    console.log('Fetching cart with auth token:', authToken.substring(0, 10) + '...');
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/getcart`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'auth-token': authToken,
                            'Content-Type': 'application/json',
                        },
                        body: "",
                    });

                    console.log('Cart response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch cart: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log('Cart items count:', Object.keys(data).length);
                    setCartItems(data);
                } catch (err) {
                    console.error('Error fetching cart - Full details:', err);
                }
            } else {
                console.log('No auth token found, skipping cart fetch');
            }
        };

        fetchProducts();
        fetchCart();
    }, []);

    const addToCart = async (itemId) => {
        try {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
            
            if (localStorage.getItem('auth-token')) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/addtocart`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'auth-token': localStorage.getItem('auth-token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to add to cart');
                }

                const data = await response.json();
                console.log('Add to cart response:', data);
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            setCartItems((prev) => ({ ...prev, [itemId]: Math.max(prev[itemId] - 1, 0) }));
            
            if (localStorage.getItem('auth-token')) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/removefromcart`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'auth-token': localStorage.getItem('auth-token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to remove from cart');
                }

                const data = await response.json();
                console.log('Remove from cart response:', data);
            }
        } catch (err) {
            console.error('Error removing from cart:', err);
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalItems = () => {
        let totalItems = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItems += cartItems[item];
            }
        }
        return totalItems;
    };

    const contextValue = {
        all_product,
        cartItems,
        loading,
        error,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalItems,
    };

    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
