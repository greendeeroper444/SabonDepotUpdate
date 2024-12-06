import React, { useContext, useState } from 'react'
import '../../CSS/CustomerCSS/CustomerShopProductDetails.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import CustomerModalShopDetailsComponent from '../../components/CustomerComponents/CustomerModalShopDetailsComponent';
import CustomerTopFooterComponent from '../../components/CustomerComponents/CustomerTopFooterComponent';
import CustomerFooterComponent from '../../components/CustomerComponents/CustomerFooterComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';
import UseFetchProductDetailsHook from '../../hooks/CustomerHooks/UseFetchProductDetailsHook';
import UseCartHook from '../../hooks/CustomerHooks/UseCartHook';
import calculateFinalPriceUtils from '../../utils/CalculateFinalPriceUtils';

function CustomerShopProductDetails() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const {productId} = useParams();
    const {customer} = useContext(CustomerContext);
    const {product, loading, error} = UseFetchProductDetailsHook(productId);
    const {cartItems, setCartItems, handleAddToCartClick} = UseCartHook(customer);
    const navigate = useNavigate();
    const [selectedSizeUnit, setSelectedSizeUnit] = useState("");
    const [selectedProductId, setSelectedProductId] = useState("");
    const {customerId} = useParams();

    const handleCheckout = (product) => {
        navigate(`/direct-checkout/${customer?._id}`, {
            state: {
                selectedItems: [
                    {
                        productId: {
                            _id: product._id,
                            productName: product.productName,
                            price: product.price,
                            discountedPrice: product.discountedPrice,
                        },
                        quantity: quantity,
                    },
                ],
            },
        });
    };
    
    
    
    

    //event handler for product relateds
    const handleProductClick = (relatedProductId) => {
        if(relatedProductId){
            setSelectedProductId(relatedProductId);
            navigate(`/shop/product/details/${relatedProductId}`);
        }
    };

    //event handler function for product size
    const handleSizeChange = (event) => {
        const selectedProductId = event.target.value;
        const selectedSizeUnit = event.target.dataset.sizeUnit;

        if(selectedProductId){
            setSelectedProductId(selectedProductId);
            navigate(`/shop/product/details/${selectedProductId}`);
        }

        if(selectedSizeUnit){
            setSelectedSizeUnit(selectedSizeUnit);
        }
    };


    const handleQuantityChange = (e) => {
        // const value = Math.max(1, parseInt(e.target.value, 10) || 1);
        // setQuantity(value);

        //updated
        const value = Math.max(1, parseInt(e.target.value, 10) || 1);
        //ensure the quantity does not exceed available stock
        if(value <= product.quantity){
            setQuantity(value);
        } else{
            alert('Cannot exceed available stock');
        }
    };

    // const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const incrementQuantity = () => {
        //check if the current quantity is less than the available stock

        //updated
        if(quantity < product.quantity){
            setQuantity((prev) => prev + 1);
        } else {
            alert('Cannot add more than available stock');
        }
    };
    const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

    const handleCloseModal = () => setIsModalOpen(false);

    if(loading){
        return <div>Loading...</div>;
    }

    if(error){
        return <div>Error: {error.message}</div>;
    }


    const {shouldShowDiscount, finalPrice} = calculateFinalPriceUtils(customer, product);

    const handleAddToCart = async() => {
        const success = await handleAddToCartClick(customer?._id, productId, quantity);
        if(success){
            setIsModalOpen(true);
        }
    };

    const uniqueSizeUnits = [...new Set(product.sizesAndUnits.map(size => size.sizeUnit))];

  return (
    <div className='customer-shop-product-details-container'>

        <CustomerModalShopDetailsComponent 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        cartItems={cartItems}
        setCartItems={setCartItems}
        customerId={customer?._id}
        />

        <div className='customer-shop-product-details-header'>

            <div className='customer-shop-product-details-header-content'>
                <span>Home</span>
                <FontAwesomeIcon icon={faAngleRight} />
                <span>Shop</span>
                <FontAwesomeIcon icon={faAngleRight} />
                <span>{product.productName}</span>
            </div>

        </div>


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
                                {/* <h4>{product.productSize}</h4> */}
                                <div className='price-container'>
                                {
                                    shouldShowDiscount && !customer.isNewCustomer && (
                                        <h4 className='final-price line-through'>
                                            ₱ {product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </h4>
                                    )
                                }
                                
                                {
                                    customer.isNewCustomer && new Date(customer.newCustomerExpiresAt) > new Date() && (
                                        <h4 className='final-price line-through'>
                                            ₱ {product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </h4>
                                    )
                                }
                                    <h4 className='final-price'>
                                        ₱ {finalPrice}
                                    </h4>
                                </div>
                                {/* <div className='stars-reviews-content'>
                                    {renderStars(rating)}
                                    <span className='customer-review'>5 Customer Review</span>
                                </div> */}
                                {/* <p>Description</p> */}
                            </div>

                            <div className='customer-shop-product-details-content-right-content'>

                                <span className='size-span'>Size</span>
                                <div className='customer-shop-product-details-product-size'>
                                    {
                                        uniqueSizeUnits.map((sizeUnit, unitIndex) => (
                                            <select
                                            key={unitIndex}
                                            className='product-size'
                                            onChange={handleSizeChange}
                                            value={selectedSizeUnit === sizeUnit ? selectedProductId : ""}
                                            data-size-unit={sizeUnit}
                                            >
                                                <option value="" disabled>{sizeUnit}</option>
                                                {
                                                    product.sizesAndUnits
                                                    .filter(size => size.sizeUnit === sizeUnit)
                                                    .map((size, sizeIndex) => (
                                                        <option key={sizeIndex} value={size.productId}>
                                                            {size.productSize}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        ))
                                    }
                                </div>


                                {/* <span className='color-span'>Color</span>
                                <div className='customer-shop-product-details-product-color'>
                                    <button className='product-color'></button>
                                    <button className='product-color'></button>
                                    <button className='product-color'></button>
                                </div> */}

                                {/* add to cart */}
                                {
                                    product.quantity <= 0 ? (
                                        
                                        <div>
                                            <br />
                                            <br />
                                            <span className='out-of-stock'>Out Of Stock</span>
                                        </div>
                                    ) : (
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
                                            {/* <button className='check-out' onClick={() => handleCheckout(product)}>Checkout</button> */}
                                        </div>
                                    )
                                }

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

export default CustomerShopProductDetails