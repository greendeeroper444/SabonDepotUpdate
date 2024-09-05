import React, { useContext, useEffect, useState } from 'react'
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';
import { useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function UseCustomerHomeHook() {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [overlayVisible, setOverlayVisible] = useState(true);
    const {customer} = useContext(CustomerContext);
    const controls = useAnimation();

    useEffect(() => {
        if(customer && customer.isNewCustomer){
            const currentTime = new Date();
            const expireTime = new Date(customer.newCustomerExpiresAt);

            const calculateTimeLeft = () => {
                const now = new Date();
                const timeDiff = expireTime - now;

                if(timeDiff > 0){
                    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
                    const seconds = Math.floor((timeDiff / 1000) % 60);
                    setTimeLeft({hours, minutes, seconds});
                } else {
                    setOverlayVisible(false);
                }
            };

            calculateTimeLeft();
            const interval = setInterval(calculateTimeLeft, 1000);

            return () => clearInterval(interval);
        } else{
            setOverlayVisible(false);
        }
    }, [customer]);

    useEffect(() => {
        if(overlayVisible){
            controls.start({y: 0, opacity: 1});
        } else {
            controls.start({y: '-100%', opacity: 0});
        }
    }, [overlayVisible, controls]);

  return {customer, timeLeft, overlayVisible, setOverlayVisible, controls, navigate};
}
