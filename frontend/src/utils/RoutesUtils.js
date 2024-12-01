//admin page routes
export const adminRoutes = [
    '/admin/dashboard',
    '/admin/orders',
    '/admin/orders/details/:orderId',
    '/admin/inventory/finished-product',
    '/admin/inventory/workin-progress',
    '/admin/accounts',
    '/admin/reports/inventory-report',
    '/admin/reports/sales-report',
    '/admin/accounts/:id'
];
  
export const isAdminRoute = (path) => {
    return adminRoutes.some(route => {
        if(route.includes(':')){
            const basePath = route.split('/:')[0];
            return path.startsWith(basePath);
        }
        return route === path;
    });
};
  
  //staff page routes
export const staffRoutes = [
    '/staff/dashboard',
    // '/staff/home',
    '/staff/products',
    '/staff/direct-orders',
    '/staff/direct-orders/details/:productId',
    '/staff/walkin',
    '/staff/refill',
    '/staff/payment',
    '/staff/orders',
    '/staff/orders/details/:orderId',
    '/staff/settings/:staffId',
    '/staff/order-summary/:staffId/:orderId',
    '/staff/accounts',
];
  
export const isStaffRoute = (path) => {
    return staffRoutes.some(route => {
        if(route.includes(':')){
            const basePath = route.split('/:')[0];
            return path.startsWith(basePath);
        }
        return route === path;
    });
};
  
//admin and staff login routes
export const adminStaffRoutes = [
    '/admin-staff-login',
];
  
export const isAdminStaffRoute = (path) => {
    return adminStaffRoutes.includes(path);
};
  
//customer page routes
export const customerRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/otp',
    '/about-us',
    '/contact',
    '/profile/:customerId',
    '/orders/:customerId',
    '/shop',
    '/shop/product/details/:productId',
    '/cart/:customerId',
    '/checkout/:customerId',
    '/place-order/:customerId/:orderId',
    '/payable/:customerId'
];
  
export const isCustomerRoute = (path) => {
    return customerRoutes.some(route => {
        if(route.includes(':')){
            const basePath = route.split('/:')[0];
            return path.startsWith(basePath);
        }
        return route === path;
    });
};