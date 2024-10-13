import React, { useContext, useState, useEffect, useRef} from 'react'
import '../../CSS/CustomerCSS/CustomerProfile.css'
import CustomerTopFooterComponent from '../../components/CustomerComponents/CustomerTopFooterComponent'
import CustomerFooterComponent from '../../components/CustomerComponents/CustomerFooterComponent';
import customerDefaultProfilePicture from '../../assets/icons/customer-default-profile-pciture.png';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function CustomerProfilePage() {
    const {customerId} = useParams();
    const {customer, setCustomer} = useContext(CustomerContext);
    const [formData, setFormData] = useState({
        firstName: '', 
        lastName: '', 
        middleInitial: '', 
        contactNumber: '', 
        province: '',  
        city: '',
        barangay: '',
        purokStreetSubdivision: '',
        emailAddress: '',
        password: '',
        clientType: ''
    });
    const [profilePicture, setProfilePicture] = useState(customer?.profilePicture || '');
    const [previewImage, setPreviewImage] = useState('');
    const fileInputRef = useRef(null);

    //pick and display profile picture
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevData => ({...prevData, [name]: value}));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage('');
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };


    //display profile
    useEffect(() => {
        if(!customerId) return;

        axios.get(`/customerAuth/getDataUpdateCustomer/${customerId}`)
            .then(response => {
                const customerData = response.data.customer;

                setProfilePicture(customerData.profilePicture || '');

                setFormData({
                    firstName: customerData.firstName || '', 
                    lastName: customerData.lastName || '', 
                    middleInitial: customerData.middleInitial || '', 
                    contactNumber: customerData.contactNumber || '', 
                    province: customerData.province || '',  
                    city: customerData.city || '',
                    barangay: customerData.barangay || '',
                    purokStreetSubdivision: customerData.purokStreetSubdivision || '',
                    emailAddress: customerData.emailAddress || '',
                    clientType: customerData.clientType || '',
                });
                setCustomer(customerData);
            })
            .catch(error => console.error(error));
    }, [customerId, setCustomer]);

   

    //update profile
    const handleUpdateProfile = async() => {
        const formDataToSend = new FormData();
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('middleInitial', formData.middleInitial);
        formDataToSend.append('contactNumber', formData.contactNumber);
        formDataToSend.append('province', formData.province);
        formDataToSend.append('city', formData.city);
        formDataToSend.append('barangay', formData.barangay);
        formDataToSend.append('purokStreetSubdivision', formData.purokStreetSubdivision);
        formDataToSend.append('emailAddress', formData.emailAddress);
        formDataToSend.append('clientType', formData.clientType);
        if(profilePicture){
            formDataToSend.append('profilePicture', profilePicture);
        }

        try {
            const response = await axios.post(`/customerAuth/updateProfileCustomer/${customerId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const updatedCustomer = response.data.customer;

            setCustomer(updatedCustomer);
            setFormData({
                firstName: updatedCustomer.firstName,
                lastName: updatedCustomer.lastName,
                middleInitial: updatedCustomer.middleInitial,
                contactNumber: updatedCustomer.contactNumber,
                province: updatedCustomer.province,
                city: updatedCustomer.city,
                barangay: updatedCustomer.barangay,
                purokStreetSubdivision: updatedCustomer.purokStreetSubdivision,
                emailAddress: updatedCustomer.emailAddress,
                clientType: updatedCustomer.clientType
            });
            setProfilePicture(updatedCustomer.profilePicture);
            setPreviewImage('');
            toast.success(response.data.message);
        } catch (error) {
            console.error(error);
            alert('error updating profile: ' + (error.response?.data.message || 'Internal server error'));
        }
    };



    const formatRelativeTime = (timestamp) => {
        const now = new Date();
        const postDate = new Date(timestamp);
        const timeDiff = now - postDate;

        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);

        if(months > 0){
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else if(weeks > 0){
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else if(days > 0){
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if(hours > 0){
            return `${hours} hr${hours > 1 ? 's' : ''} ago`;
        } else if(minutes > 0){
            return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
        } else{
            return `${seconds} sec${seconds > 1 ? 's' : ''} ago`;
        }
    };

  return (
    <div>
        <div className='customer-profile-container'>
            <div className='customer-profile-header'></div>
            <div className='customer-profile-content'>
                <div className='customer-profile-info'>
                    <img
                    src={previewImage || (profilePicture ? `http://localhost:8000/${profilePicture}` : customerDefaultProfilePicture)}
                    alt="Profile"
                    className='customer-profile-picture'
                    onClick={handleImageClick}
                    />
                    <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    />
                    <div className='customer-profile-details'>
                        {
                            !!customer && (
                                <>
                                    <h2>{customer.firstName} {customer.lastName}</h2>
                                    <p>{customer.emailAddress}</p>
                                </>
                            )
                        }
                    </div>
                </div>
                <button className='edit-button' onClick={handleUpdateProfile}>Save</button>
            </div>
            
            <div className='customer-profile-fields'>

                <div className='field-group'>
                    <div className='field'>
                        <label>First Name</label>
                        <input
                        type="text"
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='field'>
                        <label>Last Name</label>
                        <input 
                        type="text" 
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange} />
                    </div>
                    <div className='field'>
                        <label>Middle Name</label>
                        <input
                        type="text"
                        name='middleInitial'
                        value={formData.middleInitial}
                        onChange={handleChange}
                        />
                    </div>
                </div>

                <div className='field-group'>
                    {/* <div className='field'>
                        <label>Middle Name</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div> */}
                    <div className='field'>
                        <label>Client Type</label>
                        <input
                        type="text"
                        name='clientType'
                        value={formData.clientType}
                        readOnly
                        onChange={handleChange}
                        />
                    </div>
                    <div className='field'>
                        <label>Contact Number</label>
                        <input
                        type="text"
                        name='contactNumber'
                        value={formData.contactNumber}
                        onChange={handleChange}
                        />
                    </div>
                </div>

                <div className='field-group'>
                    <div className='field'>
                        <label>Province</label>
                        <input
                        type="text"
                        name='province'
                        value={formData.province}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='field'>
                        <label>City</label>
                        <input 
                        type="text" 
                        name='city'
                        value={formData.city}
                        onChange={handleChange} />
                    </div>
                    <div className='field'>
                        <label>Barangay</label>
                        <input 
                        type="text" 
                        name='barangay'
                        value={formData.barangay}
                        onChange={handleChange} />
                    </div>
                    <div className='field'>
                        <label>Purok/Street/Subd.</label>
                        <input 
                        type="text" 
                        name='purokStreetSubdivision'
                        value={formData.purokStreetSubdivision}
                        onChange={handleChange} />
                    </div>
                </div>

                <div className='add-contact-number'>
                    <button className='add-contact-button'>+Add Contact Number</button>
                </div>

                <div className='email-section'>
                    <h3>My email Address</h3>
                    <div className='email-info'>
                        <span className='email-icon'></span>
                        {
                            !!customer && (
                                <div>
                                    <p>{customer.emailAddress}</p>
                                    <small>{formatRelativeTime(customer.date)}</small>
                                </div>
                            )
                        }
                    </div>
                    <div className='add-email-address'>
                        <button className='add-email-button'>+Add Email Address</button>
                    </div>
                </div>

            </div>
        </div>

        <CustomerTopFooterComponent />

        <CustomerFooterComponent />
    </div>
  )
}

export default CustomerProfilePage