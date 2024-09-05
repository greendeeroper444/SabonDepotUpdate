import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Draggable from 'react-draggable';
import '../../../CSS/CustomerCSS/Home/CustomerHomeMain.css';
import backgroundHome from '../../../assets/backgrounds/background-home.png';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UseCustomerHomeHook from '../../../hooks/CustomerHooks/UseCustomerHomeHook';


function CustomerHomeMainComponent() {
    const navigate = useNavigate();
    const {customer, timeLeft, setOverlayVisible, controls} = UseCustomerHomeHook(navigate);


  return (
    <div className='customer-home-main-container' style={{ backgroundImage: `url(${backgroundHome})` }}>
        
        {
            !!customer && (
                <motion.div
                className='customer-home-main-overlay'
                initial={{y: '-100%', opacity: 0}}
                animate={controls}
                transition={{duration: 0.5}}
                >
                    <Draggable>
                        <div className='customer-home-main-popup'>
                            <FontAwesomeIcon icon={faTimes} className='close-icon' onClick={() => setOverlayVisible(false)} />
                            <h1>
                                <span>Welcome to </span>
                                <span>Sabon</span>
                                <span> Depot</span>
                            </h1>
                            <p className='discount'>Enjoy <span>30% OFF</span> on your first order!</p>
                            <p>Experience premium quality with our exclusive products.</p>
                            <div className='timer'>
                                <p>Offer ends in:</p>
                                <span>{`${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}</span>
                            </div>
                            <button onClick={() => navigate('/shop')}>Get My 30% Off</button>
                        </div>
                    </Draggable>
                </motion.div>
            )
        }
        <div className='customer-home-content'>
            <h6>New Arrival</h6>
            <h1>Discover Our</h1>
            <h1>New Collection</h1>
            <h5>The future of CLEAN IS HERE!!</h5>
            <button onClick={() => navigate('/shop')}>BUY NOW</button>
        </div>
    </div>
  )
}

export default CustomerHomeMainComponent
