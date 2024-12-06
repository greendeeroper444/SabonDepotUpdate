import React, { useContext, useState } from 'react'
import '../../../CSS/CustomerCSS/Home/CustomerOurProduct.css';
import { Link } from 'react-router-dom';
import { CustomerContext } from '../../../../contexts/CustomerContexts/CustomerAuthContext';
import UseFetchProductsHook from '../../../hooks/CustomerHooks/UseFetchProductsHook';
import IsDiscountValidUtils from '../../../utils/IsDiscountValidUtils';


function CustomerOurProductsComponent() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const {customer} = useContext(CustomerContext);

    const {products, loading, error} = UseFetchProductsHook(selectedCategory);


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
                        const shouldShowDiscount = IsDiscountValidUtils(customer) && product.discountPercentage > 0;
                        const finalPrice = shouldShowDiscount ? product.discountedPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

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
                                        <h5>{product.productName}
                                            {' '}
                                            <span className='out-of-stock'>
                                                {product.quantity <= 0 ? '(Out of Stock)' : ``}
                                            </span>
                                        </h5>
                                        <span>{product.category}</span>
                                        <h6>{`₱ ${finalPrice}`}</h6>
                                    </div>
                                </div>
                                <div className='view-details'>
                                    {
                                        product.quantity <= 0 ? (
                                            <span className='disabled-link'></span>
                                        ) : (
                                            <Link to={`/shop/product/details/${product._id}`}>View Details</Link>
                                        )
                                    }
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