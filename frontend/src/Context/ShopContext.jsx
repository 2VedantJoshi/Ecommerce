import React, { createContext, useEffect, useState } from "react";

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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/allproducts`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched products:', data); // Debug log
                setAll_Product(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchCart = async () => {
            if (localStorage.getItem('auth-token')) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/getcart`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'auth-token': localStorage.getItem('auth-token'),
                            'Content-Type': 'application/json',
                        },
                        body: "",
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch cart: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log('Fetched cart:', data); // Debug log
                    setCartItems(data);
                } catch (err) {
                    console.error('Error fetching cart:', err);
                }
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
