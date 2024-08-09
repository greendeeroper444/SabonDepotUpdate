import React, { useEffect, useState } from 'react'
import '../../../CSS/StaffCSS/StaffOrderWalkin/StaffModalOrdersWalkinEdit.css'
import axios from 'axios';
import toast from 'react-hot-toast';

function StaffModalOrdersWalkinEditComponent({isOpen, onClose, selectedOrder, fetchOrderWalkins}) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [dataInput, setDataInput] = useState({
        productCode: '',
        productName: '',
        category: '',
        price: '',
        quantity: '',
    });

    const handleEditWalkinOrderStaff = async(e) => {
        e.preventDefault();
        const {productCode, productName, category, price, quantity} = dataInput;

        try {
            const response = await axios.put(`/staffOrderWalkin/updateOrderWalkinStaff/${selectedOrder._id}`, {
                productCode, 
                productName, 
                category, 
                price, 
                quantity
            });
            toast.success(response.data.message);
            onClose();
            fetchOrderWalkins();
        } catch (error) {
            console.error(error);
        }
    };
    

    useEffect(() => {
        if(selectedOrder){
            const {productCode, productName, category, price, quantity} = selectedOrder;
            setDataInput({
                productCode: productCode || '',
                productName: productName || '',
                category: category || '',
                price: price || '',
                quantity: quantity || '',
            });
        }
    }, [selectedOrder]);

    const categories = ['Dishwashing Liquid', 'Car Soap', 'Fabric Conditioner', 'Pet Shampoo', 'Ethanol'];

    if(!isOpen) return null;
    
  return (
    <div className='staff-modal-order-walkin-edit-container'>
        <div className='staff-modal-order-walkin-edit-content'>
            <div className='label-text'>
                <label>PRODUCT CODE :</label>
                <div>
                    <input type="text" 
                    value={dataInput.productCode} 
                    onChange={(e) => setDataInput({...dataInput, productCode: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>PRODUCT NAME :</label>
                <div>
                    <input type="text" 
                    value={dataInput.productName} 
                    onChange={(e) => setDataInput({...dataInput, productName: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>CATEGORY :</label>
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
                <label>PRICE :</label>
                <div>
                    <input type="number"
                    value={dataInput.price} 
                    onChange={(e) => setDataInput({...dataInput, price: e.target.value})} 
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>QUANTITY :</label>
                <div>
                    <input type="number"
                    value={dataInput.quantity} 
                    onChange={(e) => setDataInput({...dataInput, quantity: e.target.value})} 
                    />
                </div>
            </div>
            <div className='staff-modal-order-walkin-edit-buttons'>
                <button onClick={handleEditWalkinOrderStaff}>Save</button>
                <button onClick={onClose}>CANCEL</button>
            </div>
        </div>
    </div>
  )
}

export default StaffModalOrdersWalkinEditComponent