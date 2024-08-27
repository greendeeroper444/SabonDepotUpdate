import React, { useContext, useEffect, useState } from 'react'
import '../../../CSS/CustomerCSS/Home/CustomerOurProduct.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CustomerContext } from '../../../../contexts/CustomerContexts/CustomerAuthContext';


function CustomerOurProductsComponent() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {customer} = useContext(CustomerContext);

    //discount valid
    const isDiscountValid = () => {
        if(customer && customer.newCustomerExpiresAt){
            const expireTime = new Date(customer.newCustomerExpiresAt);
            const currentTime = new Date();
            return currentTime <= expireTime;
        }
        return false;
    };


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
                    products.map((product, index) => {
                        const shouldShowDiscount = isDiscountValid() && product.discountPercentage > 0;
                        const finalPrice = shouldShowDiscount ? product.discountedPrice.toFixed(2) : product.price.toFixed(2);

                        return (
                            <li key={product._id}>
                                <div>
                                    <div className='product-image-container'>
                                        <img src={`http://localhost:8000/${product.imageUrl}`} alt={product.productName} />
                                        {
                                            index === products.length - 1 && (
                                                <div className='new-badge'>New</div>
                                            )
                                        }
                                        {
                                            shouldShowDiscount && (
                                                <div className='discount-badge'>
                                                    {product.discountPercentage}% OFF
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className='details-list'>
                                        <h5>{product.productName}</h5>
                                        <span>{product.category}</span>
                                        <h6>{`Php ${finalPrice}`}</h6>
                                    </div>
                                </div>
                                <div className='view-details'>
                                    <Link to={`/shop/product/details/${product._id}`}>View Details</Link>
                                </div>
                            </li>
                        );
                    })
                }
                
            </ul>

            <button className='show-more'>Show More</button>
        </div>
    </div>
  )
}

export default CustomerOurProductsComponent