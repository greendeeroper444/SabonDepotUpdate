import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function UseOrderDetailsHook(customerId, orderId) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async() => {
            try {
                const response = await axios.get(`/customerOrder/getOrderCustomer/${customerId}/${orderId}`);
                setOrder(response.data.order);
            } catch (error){
                setError('Failed to fetch order details');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [customerId, orderId]);

  return {order, loading, error};
}
