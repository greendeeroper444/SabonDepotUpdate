// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const StaffProductContext = createContext();

// export const StaffProductProvider = ({ children }) => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await axios.get('/staffProduct/getProductStaff');
//                 setProducts(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 setError('Failed to fetch products');
//                 setLoading(false);
//             }
//         };

//         fetchProducts();
//     }, []);

//     return (
//         <StaffProductContext.Provider value={{ products, loading, error }}>
//             {children}
//         </StaffProductContext.Provider>
//     );
// };
