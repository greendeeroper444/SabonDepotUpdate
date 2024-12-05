import React from 'react'
import IsDiscountValidUtils from "./IsDiscountValidUtils";


export default function CalculateFinalPriceUtils(customer, product) {
    const shouldShowDiscount = product.discountPercentage > 0;
    let finalPrice = product.price;

    //check if customer is new and the discount is valid
    if (customer.isNewCustomer && new Date(customer.newCustomerExpiresAt) > new Date()) {
        //apply a 30% discount for new customers
        finalPrice = product.price * 0.70; // 30% discount
    } else {
        //if there's an existing product discount
        finalPrice = shouldShowDiscount ? product.discountedPrice : product.price;
    }

    return {
        shouldShowDiscount,
        finalPrice: finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };
}



export function calculateFinalPriceModal(cartItem) {
    const price = cartItem.finalPrice 
    ? cartItem.finalPrice 
    : cartItem.productId.price;

    return price;
}


export function calculateSubtotalModalCustomer(cartItems, customer) {
    const subtotal = cartItems.reduce((acc, cartItem) => {
        const price = calculateFinalPriceModal(cartItem, customer);
        return acc + (price * cartItem.quantity);
    }, 0);

    return subtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}


export function calculateSubtotalModal(cartItems, customer) {
    const rawSubtotal = cartItems.reduce((acc, cartItem) => {
        const price = calculateFinalPriceModal(cartItem, customer);
        return acc + price * cartItem.quantity;
    }, 0);

    let discountRate = 0;

    //apply 30% discount for new customers
    if(customer.isNewCustomer && new Date(customer.newCustomerExpiresAt) > new Date()){
        discountRate = 0.30; //30% discount
    } else{
        //pply other discount based on thresholds
        if (rawSubtotal >= 2000 && rawSubtotal < 10000) {
            discountRate = 0.05; //5% discount
        } else if (rawSubtotal >= 10000) {
            discountRate = 0.10; //10% discount
        }
    }

    const discountAmount = rawSubtotal * discountRate;
    const finalSubtotal = rawSubtotal - discountAmount;

    return {
        rawSubtotal: rawSubtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
        finalSubtotal: finalSubtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
        discountRate: (discountRate * 100).toFixed(0),
        discountAmount: discountAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
    };
}