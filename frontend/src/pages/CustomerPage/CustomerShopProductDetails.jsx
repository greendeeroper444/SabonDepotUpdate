import React, { useContext, useEffect, useState } from 'react'
import '../../CSS/CustomerCSS/CustomerShopProductDetails.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import ourProduct1 from '../../assets/ourproducts/our-products-1.png'
import ourProduct2 from '../../assets/ourproducts/our-products-2.png'
import ourProduct3 from '../../assets/ourproducts/our-products-3.png'
import ourProduct4 from '../../assets/ourproducts/our-products-4.png'
import fullStar from '../../assets/shopproductdetails/stars/fullstar.png';
import halfStar from '../../assets/shopproductdetails/stars/halfstar.png';
import emptyStar from '../../assets/shopproductdetails/stars/emptystar.png';
import CustomerModalShopDetailsComponent from '../../components/CustomerComponents/CustomerModalShopDetailsComponent';
import CustomerTopFooterComponent from '../../components/CustomerComponents/CustomerTopFooterComponent';
import CustomerFooterComponent from '../../components/CustomerComponents/CustomerFooterComponent';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';
import toast from 'react-hot-toast';

function CustomerShopProductDetails() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const rating = 4.5;
    const {productId} = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const {customer} = useContext(CustomerContext);
    const navigate = useNavigate();

    //discount valid
    const isDiscountValid = () => {
        if(customer && customer.newCustomerExpiresAt){
            const expireTime = new Date(customer.newCustomerExpiresAt);
            const currentTime = new Date();
            return currentTime <= expireTime;
        }
        return false;
    };


    const handleAddToCartClick = async(customerId) => {
        if(!customer){
            toast.error('Please login first before adding a product to the cart');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post('/customerCart/addProductToCartCustomer', {
                customerId,
                productId,
                quantity
            });
            if(response.status === 200){
                setCartItems(response.data);
                toast.success('Product successfully added to cart');
                setIsModalOpen(true);

            } else{
                throw new Error('Failed to add product to cart');
            }
        } catch (error) {
            console.error(error);
            setError(error);
        }
    };

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value, 10) || 1);
        setQuantity(value);
    };

    const incrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    useEffect(() => {
        const fetchProductDetails = async() => {
            try {
                const response = await axios.get(`/customerProduct/getProductDetailsCustomer/${productId}`);
                if(response.status === 200){
                    setProduct(response.data);
                } else{
                    throw new Error('Failed to fetch product details');
                }
            } catch (error) {
                console.error(error);
                setError(error);
            } finally{
                setLoading(false);
            }
        };
    
        fetchProductDetails();
    }, [productId]);
    

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if(loading){
        return <div>Loading...</div>;
    }

    if(error){
        return <div>Error: {error.message}</div>;
    }


    //calculate final price and check if discount should be shown
    const shouldShowDiscount = isDiscountValid() && product.discountPercentage > 0;
    const finalPrice = shouldShowDiscount ? product.discountedPrice.toFixed(2) : product.price.toFixed(2);

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
                                <li><img src={ourProduct1} alt="" /></li>
                                <li><img src={ourProduct2} alt="" /></li>
                                <li><img src={ourProduct3} alt="" /></li>
                                <li><img src={ourProduct4} alt="" /></li>
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
                                <h1>{product.productName}</h1>
                                <span>{`Php ${finalPrice}`}</span>
                                <div className='stars-reviews-content'>
                                    {renderStars(rating)}
                                    <span className='customer-review'>5 Customer Review</span>
                                </div>
                                <p>Description</p>
                            </div>

                            <div className='customer-shop-product-details-content-right-content'>
                                <span className='size-span'>Size</span>
                                <div className='customer-shop-product-details-product-size'>
                                    <button className='product-size active'>L</button>
                                    <button className='product-size'>GL</button>
                                    <button className='product-size'>XS</button>
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
                                    onClick={() => handleAddToCartClick(customer?._id)}
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

export default CustomerShopProductDetails