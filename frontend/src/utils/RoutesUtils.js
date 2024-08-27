//admin page routes
export const adminRoutes = [
    '/admin/dashboard',
    '/admin/orders',
    '/admin/orders/details/:orderId',
    '/admin/inventory/finished-product',
    '/admin/accounts',
    '/admin/reports/inventory-report',
    '/admin/reports/sales-report',
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
    '/staff/home',
    '/staff/products',
    '/staff/pos',
    '/staff/walkin',
    '/staff/payment',
    '/staff/orders',
    '/staff/orders/details/:orderId',
    '/staff/settings/:staffId',
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