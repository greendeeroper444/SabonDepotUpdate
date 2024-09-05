import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function UseFetchCategoriesHook() {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async() => {
        try {
            const response = await axios.get('/staffProduct/getUniqueCategoriesStaff');
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

  return categories;
}
