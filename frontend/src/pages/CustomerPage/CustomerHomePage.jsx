import React from 'react'
import CustomerHomeMainComponent from '../../components/CustomerComponents/homes/CustomerHomeMainComponent'
import CustomerTrendingProductsComponent from '../../components/CustomerComponents/homes/CustomerTrendingProductsComponent'
import CustomerOurProductsComponent from '../../components/CustomerComponents/homes/CustomerOurProductsComponent'
import CustomerHashtagSabonDepotComponent from '../../components/CustomerComponents/homes/CustomerHashtagSabonDepotComponent'
import CustomerFooterComponent from '../../components/CustomerComponents/CustomerFooterComponent'

function CustomerHomePage() {
  return (
    <>
      <CustomerHomeMainComponent />

      <CustomerTrendingProductsComponent />

      <CustomerOurProductsComponent />

      <CustomerHashtagSabonDepotComponent />

      <CustomerFooterComponent />
    </>
  )
}

export default CustomerHomePage