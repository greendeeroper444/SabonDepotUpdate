import axios from 'axios'
import { createContext, useEffect, useState } from 'react';

export const AdminContext = createContext({});

export function AdminContextProvider({children}){
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        if(!admin){
            axios.get('/adminAuth/getDataAdmin')
            .then(({data}) => {
                setAdmin(data)
            })
        }
    }, [])


    const logout = () => {
        setAdmin(null);
    };
    return (
        <AdminContext.Provider value={{ admin, setAdmin, logout }}>
            {children}
        </AdminContext.Provider>
    )
}