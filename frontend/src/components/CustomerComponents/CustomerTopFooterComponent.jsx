import React from 'react'
import '../../CSS/CustomerCSS/CustomerTopFooter.css';
import trophyIcon from '../../assets/shopproductdetails/footers/trophy-icon.png'; 
import guaranteeIcon from '../../assets/shopproductdetails/footers/guarantee-icon.png'; 
import shippingIcon from '../../assets/shopproductdetails/footers/shipping-icon.png'; 
import customerSupportIcon from '../../assets/shopproductdetails/footers/customer-support-icon.png'; 

function CustomerTopFooterComponent() {
  return (
    <div className='customer-top-fooder-container'>
            <div className='customer-top-fooder-header'>
                <div className='customer-top-fooder-header-content'>
                    <img src={trophyIcon} alt="Phone Number" />
                    <div>
                        <h6>High Quality</h6>
                        <span>crafted from top materials</span>
                    </div>
                </div>

                <div className='customer-top-fooder-header-content'>
                    <img src={guaranteeIcon} alt="Email" />
                    <div>
                        <h6>Warranty Protection</h6>
                        <span>Over 2 years</span>
                    </div>
                </div>

                <div className='customer-top-fooder-header-content'>
                    <img src={shippingIcon} alt="Email" />
                    <div className='email-content'>
                        <h6>Free Shipping</h6>
                        <span>Order over 1500php</span>
                    </div>
                </div>

                <div className='customer-top-fooder-header-content'>
                    <img src={customerSupportIcon} alt="Email" />
                    <div className='email-content'>
                        <h6>24 / 7 Support</h6>
                        <span>Dedicated support</span>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default CustomerTopFooterComponent