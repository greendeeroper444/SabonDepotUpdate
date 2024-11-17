import React, { useEffect, useState } from 'react'
import '../../CSS/AdminCSS/AdminAccounts.css';
import deleteIcon from '../../assets/admin/adminicons/admin-accounts-delete-icon.png';
import searchIcon from '../../assets/admin/adminicons/admin-accounts-search-icon.png'
import axios from 'axios';

function StaffAccountsPage() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');


    //delete staff and customer
    const handleDelete = async(id, clientType) => {
        if(window.confirm(`Are you sure you want to delete this ${clientType}?`)){
            try {
                await axios.delete('/staffAccounts/deleteAccountStaff', {
                data: {id, clientType}
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
                const response = await axios.get('/staffAccounts/getAllAccountsStaff');
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

    
    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredAccounts = accounts.filter(account => {
        const fullName = account.purokStreetSubdivision 
            ? `${account.firstName} ${account.lastName}`
            : account.fullName;
    
        const address = account.purokStreetSubdivision 
            ? `${account.purokStreetSubdivision}, ${account.barangay}, ${account.city}, ${account.province}`
            : account.address;
    
        return (
            (fullName && fullName.toLowerCase().includes(searchTerm)) ||
            (account.firstName && account.firstName.toLowerCase().includes(searchTerm)) ||
            (account.lastName && account.lastName.toLowerCase().includes(searchTerm)) ||
            (account.city && account.city.toLowerCase().includes(searchTerm)) ||
            (account.barangay && account.barangay.toLowerCase().includes(searchTerm)) ||
            (account.province && account.province.toLowerCase().includes(searchTerm)) ||
            (account.clientType && account.clientType.toLowerCase().includes(searchTerm)) ||
            (account.role && account.role.toLowerCase().includes(searchTerm))
        );
    });


    if(loading) return <div>Loading...</div>;
    if(error) return <div>{error}</div>;

  return (
    <div className='admin-accounts-container'>
        <div className='admin-accounts-header'>
            <h1>Accounts</h1>
            <div className='search-bar'>
                <img src={searchIcon} alt="Search Icon" />
                <input 
                    type="text" 
                    placeholder='Search...' 
                    value={searchTerm} 
                    onChange={handleSearch} 
                />
            </div>
        </div>
        <div className='admin-accounts-content'>
        {
            filteredAccounts.length > 0 ? (
                filteredAccounts.map((account, index) => {
                    const fullName = account.purokStreetSubdivision 
                    ? `${account.firstName} ${account.lastName}`
                    : account.fullName;
    
                    const address = account.purokStreetSubdivision 
                    ? `${account.purokStreetSubdivision}, ${account.barangay}, ${account.city}, ${account.province}`
                    : account.address;
    
                    return (
                        <div className='admin-accounts-card' key={index}>
                            <div className='card-info'>
                                <div className='card-info-name'>
                                    <h3>{fullName}</h3>
                                    {
                                        account.clientType && (
                                            <span className={`role-badge ${account.clientType.toLowerCase()}`}>
                                                {account.clientType}
                                            </span>
                                        )
                                    }
                                </div>
                                <p><strong>Phone no : </strong>{account.contactNumber}</p>
                                <p><strong>Gender : </strong>{account.gender}</p>
                                <p><strong>Address : </strong>{address}</p>
                            </div>
                            {/* <div className='delete-icon' onClick={() => handleDelete(account._id, account.clientType)}>
                                <img src={deleteIcon} alt="Delete Icon" />
                            </div> */}
                        </div>
                    );
                })
            ) : ( <p style={{ textAlign: 'center' }}>No results found</p>
               
            )
        }
        </div>
    </div>
  )
}

export default StaffAccountsPage