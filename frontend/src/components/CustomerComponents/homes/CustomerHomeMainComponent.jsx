import React, { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Draggable from 'react-draggable';
import '../../../CSS/CustomerCSS/Home/CustomerHomeMain.css';
import backgroundHome from '../../../assets/backgrounds/background-home.png';
import { useNavigate } from 'react-router-dom';
import { CustomerContext } from '../../../../contexts/CustomerContexts/CustomerAuthContext';
import { motion, useAnimation } from 'framer-motion';


function CustomerHomeMainComponent() {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [overlayVisible, setOverlayVisible] = useState(true);
    const {customer} = useContext(CustomerContext);
    const controls = useAnimation();

    useEffect(() => {
      if (overlayVisible) {
          controls.start({ y: 0, opacity: 1 });
      } else {
          controls.start({ y: '-100%', opacity: 0 });
      }
  }, [overlayVisible, controls]);


    useEffect(() => {
        // Set countdown timer to 24 hours from the current time
        const targetTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        
        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const difference = targetTime - currentTime;

            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            if(difference < 0){
                clearInterval(interval);
            } else {
                setTimeLeft({ hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);


  return (
    <div className='customer-home-main-container' style={{ backgroundImage: `url(${backgroundHome})` }}>
        {
            !!customer && (
                <motion.div
                className='customer-home-main-overlay'
                initial={{ y: '-100%', opacity: 0 }}
                animate={controls}
                transition={{ duration: 0.5 }}
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
