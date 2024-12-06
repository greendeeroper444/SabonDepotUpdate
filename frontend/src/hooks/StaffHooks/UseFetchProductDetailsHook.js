import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function UseFetchProductDetailsHook(productId) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async() => {
            try {
                const response = await axios.get(`/staffProduct/getProductDetailsStaff/${productId}`);
                if(response.status === 200){
                    setProduct(response.data);
                } else {
                    throw new Error('Failed to fetch product details');
                }
            } catch (error) {
                console.error(error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

  return { product, loading, error };
}
