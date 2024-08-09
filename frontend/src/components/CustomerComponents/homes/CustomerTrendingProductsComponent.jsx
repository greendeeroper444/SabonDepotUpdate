import React from 'react'
import '../../../CSS/CustomerCSS/Home/CustomerTrendingProducts.css';
import trendingProduct1 from '../../../assets/trendingproducts/trending-products-1.png'
import trendingProduct2 from '../../../assets/trendingproducts/trending-products-2.png'
import trendingProduct3 from '../../../assets/trendingproducts/trending-products-3.png';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function CustomerTrendingProductsComponent() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };


  return (
    <div className='customer-trending-products-container'>
        <h3 className='customer-trending-products-header'>Trending Products</h3>
        <Slider {...settings} className='customer-trending-products-content'>
            <div>
                <img src={trendingProduct1} alt="Kitchen Essentials" />
                <h4>Kitchen Essentials</h4>
            </div>
            <div>
                <img src={trendingProduct2} alt="Fabric Care" />
                <h4>Fabric Care</h4>
            </div>
            <div>
                <img src={trendingProduct3} alt="Kitchen Essentials" />
                <h4>Kitchen Essentials</h4>
            </div>
        </Slider>
    </div>
  )
}

export default CustomerTrendingProductsComponent