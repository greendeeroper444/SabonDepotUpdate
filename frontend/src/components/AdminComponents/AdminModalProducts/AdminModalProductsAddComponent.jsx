import React, { useState } from 'react'
import '../../../CSS/AdminCSS/AdminModalProducts/AdminModalProductsAdd.css';
import uploadIcon from '../../../assets/staff/stafficons/staff-prices-upload-icon.png'
import toast from 'react-hot-toast';
import axios from 'axios';

function AdminModalProductsAddComponent({isOpen, onClose, fetchProducts}) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [dataInput, setDataInput] = useState({
        productCode: '', 
        productName: '', 
        category: '', 
        price: '', 
        quantity: '',
        stockLevel: '',
        discountPercentage: '',
        discountedDate: '',
        productSize: '',
        sizeUnit: '',
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
        const {productCode, productName, category, price, quantity, stockLevel, discountPercentage, discountedDate, productSize, sizeUnit, expirationDate} = dataInput;

        if(!productCode || !productName || !category || !price || !quantity || !stockLevel || !stockLevel || !productSize || !sizeUnit || !expirationDate){
            toast.error('Please input all fields');
            return;
        }

        const formData = new FormData();
        formData.append('productCode', productCode);
        formData.append('productName', productName);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('stockLevel', stockLevel);
        formData.append('discountPercentage', discountPercentage);
        formData.append('discountedDate', discountedDate);
        formData.append('image', selectedImage);
        formData.append('productSize', productSize);
        formData.append('sizeUnit', sizeUnit);
        formData.append('expirationDate', expirationDate);
        try {
            const response = await axios.post('/adminProduct/uploadProductAdmin', formData, {
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
                    stockLevel: '',
                    discountPercentage: '',
                    discountedDate: '',
                    productSize: '',
                    sizeUnit: '',
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
    const unitSize = ['Milliliters', 'Liters', 'Gallons'];

    const handleSizeUnitChange = (e) => {
        setDataInput({
            ...dataInput,
            sizeUnit: e.target.value,
            productSize: '', //reset product size when unit changes
        });
    };

    const renderSizeInputOptions = () => {
        switch (dataInput.sizeUnit) {
            case 'Milliliters':
                return (
                    <select
                    value={dataInput.productSize}
                    onChange={(e) => setDataInput({ ...dataInput, productSize: e.target.value })}
                    >
                        <option value="">Select size in mL</option>
                        <option value="1ml">1ml</option>
                        <option value="5ml">5 mL</option>
                        <option value="10ml">10ml</option>
                        <option value="50ml">50ml</option>
                        <option value="100ml">100ml</option>
                        <option value="200ml">200ml</option>
                        <option value="250ml">250ml</option>
                        <option value="500ml">500ml</option>
                        <option value="750ml">750ml</option>
                        <option value="1000ml">1000ml (1 L)</option>
                    </select>
                );
            case 'Liters':
                return (
                    <select
                    value={dataInput.productSize}
                    onChange={(e) => setDataInput({ ...dataInput, productSize: e.target.value })}
                    >
                        <option value="">Select size in L</option>
                        <option value="1L">1L</option>
                        <option value="1.5L">1.5L</option>
                        <option value="2L">2L</option>
                        <option value="3L">3L</option>
                        <option value="5L">5L</option>
                        <option value="10L">10L</option>
                        <option value="20L">20L</option>
                    </select>
                );
            case 'Gallons':
                return (
                    <select
                    value={dataInput.productSize}
                    onChange={(e) => setDataInput({...dataInput, productSize: e.target.value})}
                    >
                        <option value="">Select size in gal</option>
                        <option value="1gal">1gal</option>
                        <option value="2gal">2gal</option>
                        <option value="5gal">5gal</option>
                        <option value="10gal">10gal</option>
                        <option value="50gal">50gal</option>
                    </select>
                );
            default:
                return null;
        }
    };

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
                <label>SIZE UNIT:</label>
                <div>
                    <select value={dataInput.sizeUnit} onChange={handleSizeUnitChange}>
                        <option value="">Select size unit</option>
                        {
                            unitSize.map((size, index) => (
                                <option key={index} value={size}>{size}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
            {
                dataInput.sizeUnit && (
                    <div className='label-text'>
                        <label>PRODUCT SIZE:</label>
                        <div>
                            {renderSizeInputOptions()}
                        </div>
                    </div>
                )
            }
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
                <label>STOCK LEVEL:</label>
                <div>
                    <input type="number"
                    value={dataInput.stockLevel} 
                    onChange={(e) => setDataInput({...dataInput, stockLevel: e.target.value})}
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
                <label>DISCOUNTED DATE:</label>
                <div>
                    <input
                    type="date"
                    value={dataInput.discountedDate}
                    onChange={(e) => setDataInput({...dataInput, discountedDate: e.target.value})}
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

export default AdminModalProductsAddComponent