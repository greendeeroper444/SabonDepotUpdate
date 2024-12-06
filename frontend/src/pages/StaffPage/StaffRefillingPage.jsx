import React, { useContext, useEffect, useState } from 'react'
import '../../CSS/CustomerCSS/Shop/CustomerShopContent.css';
import '../../CSS/StaffCSS/StaffPayment.css';
import UseFetchCategoriesHook from '../../hooks/StaffHooks/UseFetchCategoriesHook';
import UseFetchProductsHook from '../../hooks/StaffHooks/UseFetchProductsHook';
import IsDiscountValidUtils from '../../utils/IsDiscountValidUtils';
import { StaffContext } from '../../../contexts/StaffContexts/StaffAuthContext';
import UseCartHook from '../../hooks/StaffHooks/UseCartHook';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StaffModalRefillingContentDetailsComponent from '../../components/StaffComponents/StaffPos/modals/StaffModalRefillingContentDetailsComponent';

function StaffRefillingPage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const {staff} = useContext(StaffContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [orderWalkins, setOrderWalkins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = UseFetchCategoriesHook();
    const {products, loading: productsLoading, error: productsError} = UseFetchProductsHook(selectedCategory);
    const {cartItems, setCartItems, handleAddToCartClick} = UseCartHook(staff);

    //display/get orders walk-in data
    const fetchOrderWalkins = async () => {
        try {
            const response = await axios.get('/staffOrderRefill/getAllOrderRefillStaff');
            setOrderWalkins(response.data);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderWalkins();
    }, []);

    const handleAddToCart = async(productId) => {
        const success = await handleAddToCartClick(staff?._id, productId, 1);
        if(success){
            setSelectedProductId(productId);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProductId(null);
    };

    if(loading || productsLoading){
        return <p>Loading...</p>;
    }

    if(error || productsError){
        return <div>Error: {error?.message || productsError.message}</div>;
    }

  return (
    <div className='staff-payment-container'>
        <div className='customer-shop-content-container'>
            <div className='customer-shop-content-header'>
                <div className='customer-shop-content-header-left'>
                    <div>
                        <select
                        name="category"
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All Products</option>
                            {
                                categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        <span>Showing {products.length} results</span>
                    </div>
                </div>
                <div className='customer-shop-content-header-section-right'>
                    <span>Show</span>
                    <button>16</button>
                </div>
            </div>

            <div className='shop-products-content'>
                <ul>
                    {
                        products.map((product, index) => {
                            const shouldShowDiscount = IsDiscountValidUtils(staff) && product.discountPercentage > 0;
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
                                            <h5>{product.productName}</h5>
                                            <span>{product.category}</span>
                                            <h6>{`₱ ${finalPrice}`}</h6>
                                        </div>
                                    </div>
                                    <div className='view-details'>
                                        <Link onClick={() => handleAddToCart(product._id)}>Add To Cart</Link>
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

            {/* Modal to show when item is added to cart */}
            <StaffModalRefillingContentDetailsComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                cartItems={cartItems}
                setCartItems={setCartItems}
                staffId={staff?._id}
            />
        </div>
    </div>
  )
}

export default StaffRefillingPage
