import React from 'react'
import IsDiscountValidUtils from "./IsDiscountValidUtils";


export default function CalculateFinalPriceUtils(customer, product) {
    const shouldShowDiscount = IsDiscountValidUtils(customer) && product.discountPercentage > 0;
    const finalPrice = shouldShowDiscount ? product.discountedPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    return {shouldShowDiscount, finalPrice};
}



export function calculateFinalPriceModal(cartItem) {
    const price = cartItem.finalPrice 
    ? cartItem.finalPrice 
    : cartItem.productId.price;

    return price;
}

export function calculateFinalPriceModalStaff(cartItem) {
    const price = cartItem.price 
    ? cartItem.price 
    : cartItem.productId.price;

    return price;
}


export function calculateSubtotalModalCustomer(cartItems) {
    const subtotal = cartItems.reduce((acc, cartItem) => {
        const price = calculateFinalPriceModal(cartItem);
        return acc + (price * cartItem.quantity);
    }, 0);

    return subtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

export function calculateSubtotalModal(cartItems) {
    const rawSubtotal = cartItems.reduce((acc, cartItem) => {
        const price = calculateFinalPriceModal(cartItem);
        return acc + price * cartItem.quantity;
    }, 0);

    //initialize discount rate
    let discountRate = 0;

    //determine discount rate based on thresholds
    if(rawSubtotal >= 2000 && rawSubtotal < 10000){
        discountRate = 0.05; //5% discount
    } else if(rawSubtotal >= 10000){
        discountRate = 0.10; //10% discount
    }

    //calculate the discounted amount
    const discountAmount = rawSubtotal * discountRate;

    // Calculate final subtotal after discount
    const finalSubtotal = rawSubtotal - discountAmount;

    return {
        rawSubtotal: rawSubtotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
        finalSubtotal: finalSubtotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
        discountRate: (discountRate * 100).toFixed(0),
        discountAmount: discountAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
    };
}

export function calculateSubtotalModalStaff(cartItems) {
    const rawSubtotal = cartItems.reduce((acc, cartItem) => {
        const price = calculateFinalPriceModalStaff(cartItem);
        return acc + price * cartItem.quantity;
    }, 0);

    //initialize discount rate
    let discountRate = 0;

    //determine discount rate based on thresholds
    if(rawSubtotal >= 2000 && rawSubtotal < 10000){
        discountRate = 0.05; //5% discount
    } else if(rawSubtotal >= 10000){
        discountRate = 0.10; //10% discount
    }

    //calculate the discounted amount
    const discountAmount = rawSubtotal * discountRate;

    // Calculate final subtotal after discount
    const finalSubtotal = rawSubtotal - discountAmount;

    return {
        rawSubtotal: rawSubtotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
        finalSubtotal: finalSubtotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
        discountRate: (discountRate * 100).toFixed(0),
        discountAmount: discountAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
    };
}