import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function UseFetchProductsHook(selectedCategory) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async(category = '') => {
        try {
            const response = await axios.get('/customerProduct/getProductCustomer', {
                params: {category}
            });
            const productData = Array.isArray(response.data) ? response.data : [];
            setProducts(productData);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(selectedCategory);
    }, [selectedCategory]);

  return {products, loading, error};
}
