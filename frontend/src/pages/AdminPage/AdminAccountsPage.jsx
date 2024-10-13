import React, { useEffect, useState } from 'react'
import '../../CSS/AdminCSS/AdminAccounts.css';
import deleteIcon from '../../assets/admin/adminicons/admin-accounts-delete-icon.png';
import searchIcon from '../../assets/admin/adminicons/admin-accounts-search-icon.png'
import axios from 'axios';

function AdminAccountsPage() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    //delete staff and customer
    const handleDelete = async(id, role) => {
        if(window.confirm(`Are you sure you want to delete this ${role}?`)){
            try {
                await axios.delete('/adminAccounts/deleteAccountAdmin', {
                data: {id, role}
                });
                setAccounts(accounts.filter(account => account._id !== id));
            } catch (err) {
                setError('Error deleting account');
            }
        }
    };

    //display stagg and customer
    useEffect(() => {
        const fetchAccounts = async() => {
            try {
                const response = await axios.get('/adminAccounts/getAllAccountsAdmin');
                const {customers, staff} = response.data;
                setAccounts([...customers, ...staff]);//combine both arrays
                setLoading(false);
            } catch (err) {
                setError('Error fetching accounts');
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    if(loading) return <div>Loading...</div>;
    if(error) return <div>{error}</div>;

  return (
    <div className='admin-accounts-container'>
        <div className='admin-accounts-header'>
            <h1>Accounts</h1>
            <div className='search-bar'>
                <img src={searchIcon} alt="Search Icon" />
                <input type="text" placeholder='Search...' />
            </div>
        </div>
        <div className='admin-accounts-content'>
            {
                accounts.map((account, index) => (
                    <div className='admin-accounts-card' key={index}>
                        <div className='card-info'>
                            <div className='card-info-name'>
                            <h3>{account.firstName}</h3>
                            <span className={`role-badge ${account.role.toLowerCase()}`}>{account.role}</span>
                            </div>
                            <p><strong>Phone no :</strong> {account.contactNumber}</p>
                            <p><strong>Gender :</strong> {account.gender}</p>
                            <p>{account.address}</p>
                        </div>
                        <div className='delete-icon' onClick={() => handleDelete(account._id, account.role)}>
                            <img src={deleteIcon} alt="Delete Icon" />
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default AdminAccountsPage