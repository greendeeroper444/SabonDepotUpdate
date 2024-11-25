import React, { useState } from 'react'
import '../../../CSS/AdminCSS/AdminModalProducts/AdminModalProductsAdd.css';
import uploadIcon from '../../../assets/staff/stafficons/staff-prices-upload-icon.png'
import toast from 'react-hot-toast';
import axios from 'axios';

function AdminModalWorkinProgressProductAddComponent({isOpen, onClose, fetchProducts}) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [dataInput, setDataInput] = useState({
        productCode: '', 
        productName: '', 
        category: '', 
        price: '', 
        quantity: '',
        discountPercentage: '',
        expirationDate: ''
    })

    const handleFileInputClick = () => {
        document.getElementById('file-input').click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(file){
            setSelectedImage(file);
        }
    };

    if(!isOpen) return null;

    const handleUploadProductAdmin = async(e) => {
        e.preventDefault();
        const {productCode, productName, category, price, quantity, discountPercentage, expirationDate} = dataInput;

        if(!productCode || !productName || !category || !price || !quantity || !expirationDate){
            toast.error('Please input all fields');
            return;
        }

        const formData = new FormData();
        formData.append('productCode', productCode);
        formData.append('productName', productName);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('discountPercentage', discountPercentage);
        formData.append('image', selectedImage);
        // formData.append('productSize', productSize);
        // formData.append('sizeUnit', sizeUnit);
        formData.append('expirationDate', expirationDate);
        try {
            const response = await axios.post('/adminWorkinProgressProduct/uploadWorkinProgressProductAdmin', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data' 
                }
            });
            
            if(response.data.error){
                toast.error(response.data.error)
            } else{
                setDataInput({ 
                    productCode: '', 
                    productName: '', 
                    category: '', 
                    price: '', 
                    quantity: '',
                    discountPercentage: '',
                    expirationDate: ''
                })
                toast.success(response.data.message);
                onClose();
                fetchProducts();//toupdate the table in the prices page
            }
        } catch (error) {
            console.log(error)
        }
    };

    const categories = ['Dishwashing Liquid', 'Car Soap', 'Fabric Conditioner', 'Pet Shampoo', 'Ethanol'];


  return (
    <div className='admin-modal-products-add-container'>
        <form className='admin-modal-products-add-content'>
            <div className='admin-modal-products-add-image-upload'>
                <div className='admin-modal-products-add-image-upload-left'>
                    <label htmlFor="file-input">
                        <img 
                        src={selectedImage ? URL.createObjectURL(selectedImage) : uploadIcon} 
                        alt="upload placeholder" 
                        className='upload-placeholder' 
                        />
                    </label>
                </div>
                <div className='admin-modal-products-add-image-upload-right'>
                    <span className='upload-instructions'>Please upload square image, size less than 100KB</span>
                    <div className='file-input-container'>
                        <input 
                        id='file-input' 
                        type="file" 
                        accept='image/png, image/jpeg, image/jpg' 
                        onChange={handleFileChange}
                        />
                        <span className='file-input-label' onClick={handleFileInputClick}>Choose File</span>
                        <span className='file-input-text'>{selectedImage ? 'File Chosen' : 'No File Chosen'}</span>
                    </div>
                </div>
            </div>
            <div className='label-text'>
                <label>PRODUCT CODE:</label>
                <div>
                    <input type="text" 
                    value={dataInput.productCode} 
                    onChange={(e) => setDataInput({...dataInput, productCode: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>PRODUCT NAME:</label>
                <div>
                    <input type="text"
                    value={dataInput.productName} 
                    onChange={(e) => setDataInput({...dataInput, productName: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>CATEGORY:</label>
                <div>
                    <select 
                    value={dataInput.category} 
                    onChange={(e) => setDataInput({...dataInput, category: e.target.value})}
                    >
                        <option value="" disabled>Select category</option>
                        {
                            categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
            <div className='label-text'>
                <label>PRICE:</label>
                <div>
                    <input type="number"
                    value={dataInput.price} 
                    onChange={(e) => setDataInput({...dataInput, price: e.target.value})} 
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>QUANTITY:</label>
                <div>
                    <input type="number"
                    value={dataInput.quantity} 
                    onChange={(e) => setDataInput({...dataInput, quantity: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>DISCOUNT PERCENTAGE:</label>
                <div>
                    <input
                    type="number"
                    value={dataInput.discountPercentage}
                    onChange={(e) => setDataInput({...dataInput, discountPercentage: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>Expiration Date:</label>
                <div>
                    <input
                    type="date"
                    value={dataInput.expirationDate}
                    onChange={(e) => setDataInput({...dataInput, expirationDate: e.target.value})}
                    />
                </div>
            </div>
            <div className='admin-modal-products-add-buttons'>
                <button onClick={handleUploadProductAdmin}>OKAY</button>
                <button onClick={onClose}>CANCEL</button>
            </div>
        </form>
    </div>
  )
}

export default AdminModalWorkinProgressProductAddComponent