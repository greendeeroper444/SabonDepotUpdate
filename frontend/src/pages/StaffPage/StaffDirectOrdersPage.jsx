import React, {useContext, useState } from 'react'
import '../../CSS/StaffCSS/StaffPayment.css';
import UseFetchCategoriesHook from '../../hooks/CustomerHooks/UseFetchCategoriesHook';
import UseFetchProductsHook from '../../hooks/CustomerHooks/UseFetchProductsHook';
import StaffDirectOrdersWalkinContentComponent from '../../components/StaffComponents/StaffPos/StaffDirectOrdersWalkinContentComponent';
import StaffDirectOrdersRefillContentComponent from '../../components/StaffComponents/StaffPos/StaffDirectOrdersRefillContentComponent';
import StaffModalWalkinContentDetailsComponent from '../../components/StaffComponents/StaffPos/modals/StaffModalWalkinContentDetailsComponent';
import { StaffContext } from '../../../contexts/StaffContexts/StaffAuthContext';
import UseCartHook from '../../hooks/StaffHooks/UseCartHook';

function StaffDirectOrdersPage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [orderType, setOrderType] = useState('Walkin');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    
    const categories = UseFetchCategoriesHook();
    const { products, loading, error } = UseFetchProductsHook(selectedCategory);
    const { staff } = useContext(StaffContext);
    const { cartItems, setCartItems, handleAddToCartClick } = UseCartHook(staff);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleAddToCart = async (productId) => {
        const success = await handleAddToCartClick(staff?._id, productId, 1);
        if (success) {
            setSelectedProductId(productId);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProductId(null);
    };


  return (
    <>
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
                {/* select of walkin or refilling */}
                <div>
                    <select
                    name="orderType"
                    id="orderType"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    >
                        <option value="Walkin">Walkin Order</option>
                        <option value="Refilling">Refilling</option>
                    </select>
                </div>
                <div className='customer-shop-content-header-section-right'>
                    <span>Show</span>
                    <button>16</button>
                </div>
                
            </div>
            {
                orderType === 'Walkin' ? (
                    <StaffDirectOrdersWalkinContentComponent
                    onAddToCart={handleAddToCart}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    staff={staff}
                    />
                ) : (
                    <StaffDirectOrdersRefillContentComponent />
                )
            }
        </div>
    </div>
        {/* modal to show when item is added to cart */}
        <StaffModalWalkinContentDetailsComponent
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        cartItems={cartItems}
        setCartItems={setCartItems}
        staffId={staff?._id}
        />
    </>
  )
}

export default StaffDirectOrdersPage