import React, { useEffect, useState } from 'react'
import '../../../CSS/CustomerCSS/Home/CustomerHashtagSabonDepot.css';
import axios from 'axios';


function CustomerHashtagSabonDepotComponent() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    //products fetching
    const fetchProducts = async() => {
        try {

            const response = await axios.get('/customerProduct/getProductCustomer');
            const productData = Array.isArray(response.data) ? response.data : [];
            
            setProducts(productData.slice(0, 7)); 
            setLoading(false);
        } catch (error){
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    if(loading){
        return <div>Loading...</div>;
    }

    if(error){
        return <div>Error: {error.message}</div>;
    }

  return (
    <div className='customer-hastag-sabon-depot-container'>
        <div className='customer-hastag-sabon-depot-header'>
            <span>BECAUSE QUALITY IS NECESSARY TO EXPERIENCE A HEALTHIER AND CLEANER HOME</span>
            <h3>#SabonDepot</h3>
        </div>
        <div className='customer-hashtag-sabon-depot-products'>
            {
                products.map((product, index) => (
                    <img
                        key={index}
                        src={`http://localhost:8000/${product.imageUrl}`}
                        alt={product.name}
                        className={`product-image product-${index + 1}`}
                    />
                ))
            }
        </div>

    </div>
  )
}

export default CustomerHashtagSabonDepotComponent