import React from 'react'
import CustomerShopHeaderComponent from '../../components/CustomerComponents/shops/CustomerShopHeaderComponent'
import CustomerShopContentComponent from '../../components/CustomerComponents/shops/CustomerShopContentComponent'
import CustomerFooterComponent from '../../components/CustomerComponents/CustomerFooterComponent'
import CustomerTopFooterComponent from '../../components/CustomerComponents/CustomerTopFooterComponent'

function CustomerShopPage() {
  return (
    <>
        <CustomerShopHeaderComponent />

        <CustomerShopContentComponent />

        <CustomerTopFooterComponent />
        
        <CustomerFooterComponent />
    </>
  )
}

export default CustomerShopPage