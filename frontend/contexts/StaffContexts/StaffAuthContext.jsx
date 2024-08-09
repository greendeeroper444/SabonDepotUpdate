import axios from 'axios'
import { createContext, useEffect, useState } from 'react';

export const StaffContext = createContext({});

export function StaffContextProvider({children}){
    const [staff, setStaff] = useState(null);

    useEffect(() => {
        if(!staff){
            axios.get('/staffAuth/getDataStaff')
            .then(({data}) => {
                setStaff(data)
            })
        }
    }, [])


    const logout = () => {
        setStaff(null);
    };
    return (
        <StaffContext.Provider value={{ staff, setStaff, logout }}>
            {children}
        </StaffContext.Provider>
    )
}