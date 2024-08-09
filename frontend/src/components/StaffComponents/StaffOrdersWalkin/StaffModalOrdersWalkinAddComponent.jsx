import React, { useState } from 'react'
import '../../../CSS/StaffCSS/StaffOrderWalkin/StaffModalOrdersWalkinAdd.css'
import axios from 'axios';
import toast from 'react-hot-toast';

function StaffModalOrdersWalkinAddComponent({isOpen, onClose, fetchOrderWalkins}) {
    const [dataInput, setDataInput] = useState({
        productCode: '', 
        productName: '', 
        category: '', 
        price: '', 
        quantity: '',
    })

    const handleAddOrderWalkin = async(e) => {
        e.preventDefault();
        const {productCode, productName, category, price, quantity} = dataInput;

      
        try {
            const response = await axios.post('/staffOrderWalkin/addOrderWalkinStaff', {
                productCode,
                productName, 
                category, 
                price, 
                quantity
            })
            if(response.data.error){
                toast.error(response.data.error)
            } else{
                setDataInput({ 
                    productCode: '',
                    productName: '', 
                    category: '', 
                    price: '', 
                    quantity: '',
                })
                toast.success(response.data.message);
                onClose();
                fetchOrderWalkins();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const categories = ['Dishwashing Liquid', 'Car Soap', 'Fabric Conditioner', 'Pet Shampoo', 'Ethanol'];

    if(!isOpen) return null;
    
  return (
    <div className='staff-modal-order-walkin-add-container'>
        <div className='staff-modal-order-walkin-add-content'>
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
            <div className='staff-modal-order-walkin-add-buttons'>
                <button onClick={handleAddOrderWalkin}>OKAY</button>
                <button onClick={onClose}>CANCEL</button>
            </div>
        </div>
    </div>
  )
}

export default StaffModalOrdersWalkinAddComponent