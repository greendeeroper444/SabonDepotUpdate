import React, { useContext, useState } from 'react'
import '../../CSS/CustomerCSS/CustomerShopProductDetails.css'
import fullStar from '../../assets/shopproductdetails/stars/fullstar.png';
import halfStar from '../../assets/shopproductdetails/stars/halfstar.png';
import emptyStar from '../../assets/shopproductdetails/stars/emptystar.png';
import CustomerTopFooterComponent from '../../components/CustomerComponents/CustomerTopFooterComponent';
import CustomerFooterComponent from '../../components/CustomerComponents/CustomerFooterComponent';
import { useNavigate, useParams } from 'react-router-dom';
import UseFetchProductDetailsHook from '../../hooks/CustomerHooks/UseFetchProductDetailsHook';
import UseCartHook from '../../hooks/StaffHooks/UseCartHook';
import calculateFinalPriceUtils from '../../utils/StaffCalculateFinalPriceUtils';
import { StaffContext } from '../../../contexts/StaffContexts/StaffAuthContext';
import StaffModalWalkinContentDetailsComponent from '../../components/StaffComponents/StaffPos/modals/StaffModalWalkinContentDetailsComponent';

function StaffDirectOrdersDetailsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const {productId} = useParams();
    const {staff} = useContext(StaffContext);
    const {product, loading, error} = UseFetchProductDetailsHook(productId);
    const {cartItems, setCartItems, handleAddToCartClick} = UseCartHook(staff);
    const navigate = useNavigate();
    const [selectedSizeUnit, setSelectedSizeUnit] = useState("");
    const [selectedProductId, setSelectedProductId] = useState("");
    //event handler for product relateds
    const handleProductClick = (relatedProductId) => {
        if(relatedProductId){
            setSelectedProductId(relatedProductId);
            navigate(`/staff/pos/product/details/${relatedProductId}`);
        }
    };

    //event handler for product relateds
    const handleSizeChange = (event) => {
        const selectedProductId = event.target.value;
        const selectedSizeUnit = event.target.dataset.sizeUnit;

        if(selectedProductId){
            setSelectedProductId(selectedProductId);
            navigate(`/staff/pos/product/details/${selectedProductId}`);
        }

        if(selectedSizeUnit){
            setSelectedSizeUnit(selectedSizeUnit);
        }
    };


    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value, 10) || 1);
        setQuantity(value);
    };

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

    const handleCloseModal = () => setIsModalOpen(false);

    if(loading){
        return <div>Loading...</div>;
    }

    if(error){
        return <div>Error: {error.message}</div>;
    }


    const {shouldShowDiscount, finalPrice} = calculateFinalPriceUtils(staff, product);

    const handleAddToCart = async() => {
        const success = await handleAddToCartClick(staff?._id, productId, quantity);
        if(success){
            setIsModalOpen(true);
        }
    };

  return (
    <div className='customer-shop-product-details-container'>

        <StaffModalWalkinContentDetailsComponent
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        cartItems={cartItems}
        setCartItems={setCartItems}
        staffId={staff?._id}
        />


        {
            product ? (
                <div className='customer-shop-product-details-content'>

                    {/* left side */}
                    <div className='customer-shop-product-details-content-left'>

                        <div className='shop-products-left'>
                            <ul>
                                {
                                    product?.relatedProducts?.map((relatedProduct, index) => (
                                        <li 
                                        key={index} 
                                        onClick={() => handleProductClick(relatedProduct._id)}
                                        style={{ cursor: 'pointer' }}
                                        >
                                            <img 
                                            src={`http://localhost:8000/${relatedProduct.imageUrl}`} 
                                            alt={relatedProduct.productName} 
                                            />
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>

                        <div className='shop-products-right'>
                            <div className='product-image-container'>
                                <img src={`http://localhost:8000/${product.imageUrl}`} alt={product.productName} />
                                {
                                    shouldShowDiscount && (
                                        <div className='discount-badge'>
                                            {product.discountPercentage}% OFF
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    {/* right side */}
                    <div className='customer-shop-product-details-content-right'>

                        <div className='customer-shop-product-details-content-right-container'>

                            <div className='customer-shop-product-details-content-right-header'>
                                <h1>{`${product.productName} (${product.productSize})`}</h1>
                                <h4>{product.productSize}</h4>
                                <span>{`₱ ${finalPrice}`}</span>
                                <div className='stars-reviews-content'>
                                    {/* {renderStars(rating)} */}
                                    <span className='customer-review'>5 Customer Review</span>
                                </div>
                                <p>Description</p>
                            </div>

                            <div className='customer-shop-product-details-content-right-content'>

                                <span className='size-span'>Size</span>
                                <div className='customer-shop-product-details-product-size'>
                                    {
                                        product.sizesAndUnits.map((size, index) => (
                                            <select
                                            key={index}
                                            className='product-size'
                                            onChange={handleSizeChange}
                                            value={selectedProductId === size.productId ? size.productId : ""}
                                            data-size-unit={size.sizeUnit}
                                            >
                                                <option value="" disabled>{size.sizeUnit.slice(0, 1)}</option>
                                                <option value={size.productId}>
                                                    {size.productSize}
                                                </option>
                                            </select>
                                        ))
                                    }
                                </div>

                                <span className='color-span'>Color</span>
                                <div className='customer-shop-product-details-product-color'>
                                    <button className='product-color'></button>
                                    <button className='product-color'></button>
                                    <button className='product-color'></button>
                                </div>

                                {/* add to cart */}
                                <div className='customer-shop-product-details-product-add-buttons'>
                                    <div className='plus-and-minus-quantity'>
                                        <button className='minus-quantity' onClick={decrementQuantity}>-</button>
                                        <input
                                        type='number'
                                        className='quantity-input'
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        min='1'
                                        />
                                        <button className='plus-quantity' onClick={incrementQuantity}>+</button>
                                    </div>
                                    <button className='add-to-cart' 
                                    onClick={handleAddToCart}
                                    >Add To Cart</button>
                                </div>

                            </div>
                        </div>

                        <div className='customer-shop-product-details-product-sku'>
                            <span>SKU</span>
                            <span>: SS001</span>
                        </div>
                        <div className='customer-shop-product-details-product-category'>
                            <span>Category</span>
                            <span>: Dishwashing Liquid</span>
                        </div>

                    </div>
                </div>
            ) : (
                <div>Product not found or loading...</div>
            )
        }
        
        <CustomerTopFooterComponent />

        <CustomerFooterComponent />
    </div>
  )
}

const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
    return (
      <div className='stars'>
        {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className='star-full' style={{ backgroundImage: `url(${fullStar})` }}></span>)}
        {hasHalfStar && <span className='star-half' style={{ backgroundImage: `url(${halfStar})` }}></span>}
        {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className='star-empty' style={{ backgroundImage: `url(${emptyStar})` }}></span>)}
      </div>
    )
}

export default StaffDirectOrdersDetailsPage