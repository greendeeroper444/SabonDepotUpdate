import React, { useContext, useState } from 'react'
import '../../../CSS/CustomerCSS/Shop/CustomerShopContent.css';
import UseFetchCategoriesHook from '../../../hooks/CustomerHooks/UseFetchCategoriesHook';
import UseFetchProductsHook from '../../../hooks/CustomerHooks/UseFetchProductsHook';
import IsDiscountValidUtils from '../../../utils/IsDiscountValidUtils';
import { StaffContext } from '../../../../contexts/StaffContexts/StaffAuthContext';
import UseCartHook from '../../../hooks/StaffHooks/UseCartHook';
import StaffModalPosContentDetailsComponent from '../../../components/StaffComponents/StaffModalPosContentDetailsComponent';
import { Link } from 'react-router-dom';

function StaffPosContentComponent() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const {staff} = useContext(StaffContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const categories = UseFetchCategoriesHook();
    const {products, loading, error} = UseFetchProductsHook(selectedCategory);
    const {cartItems, setCartItems, handleAddToCartClick} = UseCartHook(staff);

    if(loading){
        return <div>Loading...</div>;
    }

    if(error){
        return <div>Error: {error.message}</div>;
    }

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

    return (
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
            <StaffModalPosContentDetailsComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                cartItems={cartItems}
                setCartItems={setCartItems}
                staffId={staff?._id}
            />
        </div>
    );
}

export default StaffPosContentComponent;
