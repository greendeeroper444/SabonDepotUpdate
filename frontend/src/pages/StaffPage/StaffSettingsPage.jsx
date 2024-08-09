import React, { useContext, useEffect, useRef, useState } from 'react'
import '../../CSS/StaffCSS/StaffSettings.css'
import { useParams } from 'react-router-dom';
import { StaffContext } from '../../../contexts/StaffContexts/StaffAuthContext';
import customerDefaultProfilePicture from '../../assets/icons/customer-default-profile-pciture.png';
import axios from 'axios';
import toast from 'react-hot-toast';


function StaffSettingsPage() {
    const {staffId} = useParams();
    const {staff, setStaff} = useContext(StaffContext);
    const [formData, setFormData] = useState({
        fullName: '',
        nickName: '',
        gender: 'Other',
        contactNumber: '',
        address: ''
    });
    const [profilePicture, setProfilePicture] = useState(staff?.profilePicture || '');
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
        if(!staffId) return;

        axios.get(`/staffAuth/getDataUpdateStaff/${staffId}`)
            .then(response => {
                const staffData = response.data.staff;

                setProfilePicture(staffData.profilePicture || '');

                setFormData({
                    fullName: staffData.fullName || '',
                    nickName: staffData.nickName || '',
                    gender: staffData.gender || 'Other',
                    contactNumber: staffData.contactNumber || '',
                    address: staffData.address || ''
                });
                setStaff(staffData);
            })
            .catch(error => console.error(error));
    }, [staffId, setStaff]);

   

    //update profile
    const handleUpdateProfile = async() => {
        const formDataToSend = new FormData();
        formDataToSend.append('fullName', formData.fullName);
        formDataToSend.append('nickName', formData.nickName);
        formDataToSend.append('gender', formData.gender);
        formDataToSend.append('contactNumber', formData.contactNumber);
        formDataToSend.append('address', formData.address);
        if(profilePicture){
            formDataToSend.append('profilePicture', profilePicture);
        }

        try {
            const response = await axios.post(`/staffAuth/updateProfileStaff/${staffId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const updatedStaff = response.data.staff;

            setStaff(updatedStaff);
            setFormData({
                fullName: updatedStaff.fullName,
                nickName: updatedStaff.nickName,
                gender: updatedStaff.gender,
                contactNumber: updatedStaff.contactNumber,
                address: updatedStaff.address
            });
            setProfilePicture(updatedStaff.profilePicture);
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
        <div className='staff-profile-container'>
            <div className='staff-profile-header'></div>
            <div className='staff-profile-content'>
                <div className='staff-profile-info'>
                    <img
                    src={previewImage || (profilePicture ? `http://localhost:8000/${profilePicture}` : customerDefaultProfilePicture)}
                    alt="Profile"
                    className='staff-profile-picture'
                    onClick={handleImageClick}
                    />
                    <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    />
                    <div className='staff-profile-details'>
                        {
                            !!staff && (
                                <>
                                    <h2>{staff.fullName}</h2>
                                    <p>{staff.emailAddress}</p>
                                </>
                            )
                        }
                    </div>
                </div>
                <button className='edit-button' onClick={handleUpdateProfile}>Save</button>
            </div>
            
            <div className='staff-profile-fields'>

                <div className='field-group'>
                    <div className='field'>
                        <label>Full Name</label>
                        <input
                        type="text"
                        name='fullName'
                        value={formData.fullName}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='field'>
                        <label>Nick Name</label>
                        <input 
                        type="text" 
                        name='nickName'
                        value={formData.nickName}
                        onChange={handleChange} />
                    </div>
                </div>

                <div className='field-group'>
                    <div className='field'>
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
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

                <div className='add-contact-number'>
                    <button className='add-contact-button'>+Add Contact Number</button>
                </div>

                <div className='field'>
                    <label>Address</label>
                    <input
                    type="text"
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    />
                    {/* <select name="" id="">
                        <option value="Panabo, Davao del Norte">Panabo, Davao del Norte</option>
                        <option value="Carmen, Davao del Norte">Carmen, Davao del Norte</option>
                    </select> */}
                </div>

                <div className='email-section'>
                    <h3>My email Address</h3>
                    <div className='email-info'>
                        <span className='email-icon'></span>
                        {
                            !!staff && (
                                <div>
                                    <p>{staff.emailAddress}</p>
                                    <small>{formatRelativeTime(staff.date)}</small>
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
    </div>
  )
}

export default StaffSettingsPage