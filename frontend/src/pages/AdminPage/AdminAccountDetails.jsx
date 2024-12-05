import React, { useEffect, useState } from 'react'
import '../../CSS/AdminCSS/AdminAccountDetails.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function AdminAccountDetails() {
    const {id } = useParams();
    const [account, setAccount] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const response = await axios.get(`/adminAccounts/getAllAccountDetailsAdmin/${id}`);
                setAccount(response.data);
            } catch (err) {
                setError('Error fetching account details');
            }
        };

        fetchAccountDetails();
    }, [id]);

    if(error) return <div>{error}</div>;
    if(!account) return <div>Loading...</div>;

  return (
    <div className='admin-account-details'>
        <table className='account-details-table'>
            <thead>
                <tr>
                    <th>Customer</th>
                    <th>Transaction Number</th>
                    <th>Date</th>
                    <th>Customer Balance</th>
                </tr>
            </thead>
            <tbody>
            {
                Array.from({ length: 7 }).map((_, index) => (
                    <tr key={index}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                ))
            }
            </tbody>
        </table>
    </div>
  )
}

export default AdminAccountDetails
