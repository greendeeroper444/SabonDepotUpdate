import React, { useState } from 'react'
import '../../../CSS/CustomerCSS/Shop/CustomerShopContent.css';
import UseFetchProductsHook from '../../../hooks/CustomerHooks/UseFetchProductsHook';
import IsDiscountValidUtils from '../../../utils/IsDiscountValidUtils';
import { Link } from 'react-router-dom';

function StaffDirectOrdersWalkinContentComponent({onAddToCart, cartItems, setCartItems, staff}) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const { products, loading, error } = UseFetchProductsHook(selectedCategory);

    if(loading){
        return <div>Loading...</div>;
    }

    if(error){
        return <div>Error: {error.message}</div>;
    }


    return (
      <div className='shop-products-content'>
        <ul>
            {
                products.map((product, index) => {
                    const shouldShowDiscount = IsDiscountValidUtils(staff) && product.discountPercentage > 0;
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
                                <Link onClick={() => onAddToCart(product._id)}>Add To Cart</Link>
                            </div>
                        </li>
                    );
                })
            }
        </ul>

        <div className='customer-shop-content-pagination'>
            <button className='page-item active'>1</button>
            <button className='page-item'>2</button>
            <button className='page-item'>3</button>
            <button className='page-item'>Next</button>
        </div>
      </div>
    )
}

export default StaffDirectOrdersWalkinContentComponent