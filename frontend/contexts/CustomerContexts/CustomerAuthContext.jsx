import axios from 'axios'
import { createContext, useEffect, useState } from 'react';

export const CustomerContext = createContext({});

export function CustomerContextProvider({children}){
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        if(!customer){
            axios.get('/customerAuth/getDataCustomer')
            .then(({data}) => {
                setCustomer(data)
            })
        }
    }, [])


    const logout = () => {
        setCustomer(null);
    };
    return (
        <CustomerContext.Provider value={{customer, setCustomer, logout}}>
            {children}
        </CustomerContext.Provider>
    )
}