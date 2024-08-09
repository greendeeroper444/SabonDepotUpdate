import React from 'react'
import '../../CSS/CustomerCSS/CustomerFooter.css'

function CustomerFooterComponent() {
  return (
    <footer className='customer-footer'>
        <div className='customer-footer-content'>
            <div className='customer-footer-left'>
                <h2>SabonTech.</h2>
                <address>
                    Panabo City, Davao del Norte<br />
                    Philippines
                </address>
            </div>
            <div className='customer-footer-right'>
                <ul className='customer-footer-links'>
                    <li>Home</li>
                    <li>Shop</li>
                    <li>About</li>
                    <li>Contact</li>
                </ul>
            </div>
        </div>
        <div className='customer-footer-bottom'>
            <p>2024 SabonTech. All rights reserved</p>
        </div>
    </footer>
  )
}

export default CustomerFooterComponent