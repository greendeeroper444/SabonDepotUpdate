import React, { useEffect, useState } from 'react'
import '../../../CSS/AdminCSS/AdminModalProducts/AdminModalProductsEdit.css';
import uploadIcon from '../../../assets/staff/stafficons/staff-prices-upload-icon.png';
import toast from 'react-hot-toast';
import axios from 'axios';

function AdminModalProductsEditComponent({isOpen, onClose, selectedProduct, fetchProducts}) {
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
        expirationDate: '',
        updatedAt: ''
    });
    const [inputValue, setInputValue] = useState(0); 

    const handleEditProductAdmin = async(e) => {
        e.preventDefault();

        const updatedQuantity = parseInt(dataInput.quantity) + parseInt(inputValue);

        const formData = new FormData();
        formData.append('productCode', dataInput.productCode);
        formData.append('productName', dataInput.productName);
        formData.append('category', dataInput.category);
        formData.append('price', dataInput.price);
        formData.append('quantity', updatedQuantity);
        formData.append('stockLevel', dataInput.stockLevel)
        formData.append('discountPercentage', dataInput.discountPercentage);
        formData.append('discountedDate', dataInput.discountedDate);
        formData.append('productSize', dataInput.productSize);
        formData.append('sizeUnit', dataInput.sizeUnit);
        formData.append('expirationDate', dataInput.expirationDate);
        formData.append('updatedAt', dataInput.updatedAt);
        if(selectedImage && typeof selectedImage !== 'string'){
            formData.append('image', selectedImage);
        }

        try {
            const response = await axios.put(`/adminProduct/editProductAdmin/${selectedProduct._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(response.data.message);
            onClose();
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };
    

    useEffect(() => {
        if(selectedProduct){
            const {productCode, productName, category, price, quantity, stockLevel, imageUrl, discountPercentage, discountedDate, productSize, sizeUnit, expirationDate, updatedAt} = selectedProduct;
            setDataInput({
                productCode: productCode || '',
                productName: productName || '',
                category: category || '',
                price: price || '',
                quantity: quantity || 0,
                stockLevel: stockLevel || '',
                discountPercentage: discountPercentage || '',
                discountedDate: discountedDate ? new Date(discountedDate).toISOString().split('T')[0] : '',
                productSize: productSize || '',
                sizeUnit: sizeUnit || '',
                expirationDate: expirationDate ? new Date(expirationDate).toISOString().split('T')[0] : '',
                updatedAt: updatedAt ? new Date(updatedAt).toISOString().split('T')[0] : ''
            });
            setSelectedImage(imageUrl || null);
        }
    }, [selectedProduct]);

    const handleFileInputClick = () => {
        document.getElementById('file-input').click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
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

    if(!isOpen) return null;

  return (
    <div className='admin-modal-products-edit-container'>
        <form className='admin-modal-products-edit-content'>
            <div className='admin-modal-products-edit-image-upload'>
                <div className='admin-modal-products-edit-image-upload-left'>
                    <label htmlFor="file-input">
                        <img
                        src={selectedImage ? (typeof selectedImage === 'string' 
                            ? `http://localhost:8000/${selectedImage}` 
                            : URL.createObjectURL(selectedImage)) 
                            : uploadIcon}
                        alt="upload placeholder"
                        className='upload-placeholder'
                        onError={(e) => {e.target.onerror = null; e.target.src = uploadIcon; }}
                        />
                    </label>
                </div>
                <div className='admin-modal-products-edit-image-upload-right'>
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
                <label>UPDATE QUANTITY:</label>
                <div>
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => {
                            const newValue = Number(e.target.value);
                            setInputValue(newValue);
                        }}
                    />
                </div>
                <span>
                    = {dataInput.quantity + inputValue}
                </span>
            </div>
            <div className='label-text'>
                <label>UPDATE STOCK LEVEL:</label>
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
                <label>EXPIRATION DATE:</label>
                <div>
                    <input
                    type="date"
                    value={dataInput.expirationDate}
                    onChange={(e) => setDataInput({...dataInput, expirationDate: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>UPLOADED DATE:</label>
                <div>
                    <input
                    type="date"
                    value={dataInput.updatedAt}
                    onChange={(e) => setDataInput({...dataInput, updatedAt: e.target.value})}
                    />
                </div>
            </div>
            <div className='admin-modal-products-edit-buttons'>
                <button onClick={handleEditProductAdmin}>SAVE</button>
                <button onClick={onClose}>CANCEL</button>
            </div>
        </form>
    </div>
  )
}

export default AdminModalProductsEditComponent
