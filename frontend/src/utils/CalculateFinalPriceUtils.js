import React from 'react'
import IsDiscountValidUtils from "./IsDiscountValidUtils";


export default function CalculateFinalPriceUtils(customer, product) {
    const shouldShowDiscount = IsDiscountValidUtils(customer) && product.discountPercentage > 0;
    const finalPrice = shouldShowDiscount ? product.discountedPrice.toFixed(2) : product.price.toFixed(2);

    return {shouldShowDiscount, finalPrice};
}



export function calculateFinalPriceModal(cartItem) {
    const price = cartItem.finalPrice 
    ? cartItem.finalPrice 
    : cartItem.productId.price;

    return price;
}


export function calculateSubtotalModal(cartItems) {
    const subtotal = cartItems.reduce((acc, cartItem) => {
        const price = calculateFinalPriceModal(cartItem);
        return acc + (price * cartItem.quantity);
    }, 0);

    return subtotal.toFixed(2);
}
