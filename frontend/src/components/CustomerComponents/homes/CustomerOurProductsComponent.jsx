import React, { useEffect, useState } from 'react'
import '../../../CSS/CustomerCSS/Home/CustomerOurProduct.css';
import axios from 'axios';
import { Link } from 'react-router-dom';


function CustomerOurProductsComponent() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    //products fetching
    const fetchProducts = async() => {
        try {

            const response = await axios.get('/customerProduct/getProductCustomer');
            const productData = Array.isArray(response.data) ? response.data : [];
            
            setProducts(productData);
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
    <div className='customer-our-products-container'>
        <h3 className='customer-our-products-header'>Our Products</h3>
        <div className='customer-our-products-content'>
            <ul>
                {
                    products.map((product, index) => (
                        <li key={product._id}>
                            <div className='product-image-container'>
                                <img src={`http://localhost:8000/${product.imageUrl}`} alt={product.productName} />
                                {
                                    index === products.length - 1 && (
                                        <div className='new-badge'>New</div>
                                    )
                                }
                                {
                                    product.discountPercentage > 0 && (
                                        <div className='discount-badge'>
                                            {product.discountPercentage}% OFF
                                        </div>
                                    )
                                }
                            </div>
                            <div className='details-list'>
                                <h5>{product.productName}</h5>
                                <span>{product.category}</span>
                                <h6>Php {`${product.price}.00`}</h6>
                            </div>
                            <div className='view-details'>
                                <Link to={`/shop/product/details/${product._id}`}>View Details</Link>
                            </div>
                        </li>
                    ))
                }
                
            </ul>

            <button className='show-more'>Show More</button>
        </div>
    </div>
  )
}

export default CustomerOurProductsComponent