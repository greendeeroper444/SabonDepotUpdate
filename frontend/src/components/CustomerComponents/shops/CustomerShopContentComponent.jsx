import React, { useContext, useState } from 'react'
import '../../../CSS/CustomerCSS/Shop/CustomerShopContent.css';
import { Link } from 'react-router-dom';
import { CustomerContext } from '../../../../contexts/CustomerContexts/CustomerAuthContext';
import UseFetchCategoriesHook from '../../../hooks/CustomerHooks/UseFetchCategoriesHook';
import UseFetchProductsHook from '../../../hooks/CustomerHooks/UseFetchProductsHook';
import IsDiscountValidUtils from '../../../utils/IsDiscountValidUtils';

function CustomerShopContentComponent() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const {customer} = useContext(CustomerContext);
    const [showCount, setShowCount] = useState(16);
    const [currentPage, setCurrentPage] = useState(1);

    const categories = UseFetchCategoriesHook();
    const {products, loading, error} = UseFetchProductsHook(selectedCategory);

    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / showCount);
    const paginatedProducts = products.slice((currentPage - 1) * showCount, currentPage * showCount);


     //pagination handlers
     const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if(currentPage > 1){
            setCurrentPage(currentPage - 1);
        }
    };

    if(loading){
        return <div>Loading...</div>;
    }

    if(error){
        return <div>Error: {error.message}</div>;
    }
  return (
    <div className='customer-shop-content-container'>
        <div className='customer-shop-content-header'>
            <div className='customer-shop-content-header-left'>
                <div>
                    <select 
                    name='category' 
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
                <button onClick={() => setShowCount(showCount === 16 ? 32 : 16)}>
                    {showCount}
                </button>
            </div>
        </div>

        <div className='shop-products-content'>
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
                                                {product.quantity <= 0 ? '(Out of Stock)' : ''}
                                            </span>
                                        </h5>
                                        <span>{product.category}</span>
                                        <h6>{`Php ${finalPrice}`}</h6>
                                    </div>
                                </div>
                                <div className='view-details'>
                                    {/* {
                                        product.quantity <= 0 ? (
                                            <span className='disabled-link'></span>
                                        ) : (
                                            <Link to={`/shop/product/details/${product._id}`}>View Details</Link>
                                        )
                                    } */}
                                    <Link to={`/shop/product/details/${product._id}`}>View Details</Link>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>

            <div className='customer-shop-content-pagination'>
                {
                    currentPage > 1 && <button onClick={handlePreviousPage}>Previous</button>
                }
                    {
                        [...Array(totalPages)].map((_, index) => (
                            <button
                            key={index + 1}
                            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))
                    }
                {
                    currentPage < totalPages && <button onClick={handleNextPage}>Next</button>
                }
            </div>
        </div>
    </div>
  )
}

export default CustomerShopContentComponent