import React, { useEffect, useState } from 'react'
import '../../../CSS/AdminCSS/AdminInventory/FinishedProduct.css'
import axios from 'axios';
import editIcon from '../../../assets/staff/stafficons/staff-orders-edit-icon.png';
import deleteIcon from '../../../assets/staff/stafficons/staff-orders-delete-icon.png';
import AdminModalProductsAddComponent from '../../../components/AdminComponents/AdminModalProducts/AdminModalProductsAddComponent';
import AdminModalProductsDeleteComponent from '../../../components/AdminComponents/AdminModalProducts/AdminModalProductsDeleteComponent';
import AdminModalProductsEditComponent from '../../../components/AdminComponents/AdminModalProducts/AdminModalProductsEditComponent';
import toast from 'react-hot-toast';


function AdminFinishedProductPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);


    //edit function
    const handleEditProductClick = async(productId) => {
        try {
            const response = await axios.get(`/adminProduct/getEditProductAdmin/${productId}`);
            setSelectedProduct(response.data);
            setIsEditModalOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    
    //delete function
    const handleConfirmDelete = async() => {
        try {
            const response = await axios.delete(`/adminProduct/deleteProductAdmin/${productIdToDelete}`);
            setProducts(products.filter(product => product._id !== productIdToDelete));
            setIsDeleteModalOpen(false);
            setProductIdToDelete(null);
            toast.success(response.data.message);
        } catch (error) {
            console.log(error)
        }
    };
    
    const handleDeleteProductClick = (productId) => {
        setProductIdToDelete(productId);
        setIsDeleteModalOpen(true);
    };
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setProductIdToDelete(null);
    };


    //display/get product data
    const fetchProducts = async() => {
        try {
            const response = await axios.get('/adminProduct/getProductAdmin');
            setProducts(response.data);
            setLoading(false);
        } catch (error){
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    

    const handleAddProductClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    
    if(loading){
        return <p>Loading...</p>;
    }

  return (
    <div className='admin-finished-product-container'>
        <AdminModalProductsAddComponent
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        fetchProducts={fetchProducts}
        />

        <AdminModalProductsDeleteComponent
        isOpen={isDeleteModalOpen} 
        onClose={handleCloseDeleteModal} 
        onConfirm={handleConfirmDelete} 
        />

        <AdminModalProductsEditComponent
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal} 
        selectedProduct={selectedProduct}
        fetchProducts={fetchProducts}
        />

        <div className='admin-finished-product-header'>
            <div className='admin-finished-product-header-controls'>
                <div>Overall Inventory</div>
            </div>
            <table className='admin-finished-product-header-table'>
                <thead>
                    <tr>
                        <th>Categories</th>
                        <th>Total Products</th>
                        <th></th>
                        <th>Top Selling</th>
                        <th></th>
                        <th>Low Stocks</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>14</td>
                        <td>868</td>
                        <td>Php 2500.00</td>
                        <td>5</td>
                        <td>Php2500.00</td>
                        <td>12</td>
                        <td>2</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div className='admin-finished-product-controls'>
            <div>Products</div>
            <div>
                <button onClick={handleAddProductClick}>Add Product</button>
            </div>
        </div>

        {error && <p>{error}</p>}

        {
            products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <table className='admin-finished-product-table'>
                    <thead>
                        <tr>
                            <th>PRODUCT CODE</th>
                            <th>PRODUCT NAME</th>
                            <th>CATEGORY</th>
                            <th>PRICE</th>
                            <th>QUANTITY</th>
                            <th>Availability</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.productCode}</td>
                                    <td>{product.productName}</td>
                                    <td>{product.category}</td>
                                    <td>{`₱ ${product.price}.00`}</td>
                                    <td>{product.quantity}</td>
                                    <td className={product.quantity > 0 ? 'in-stock' : 'out-of-stock'}>
                                        {product.quantity > 0 ? 'In-stock' : 'Out of stock'}
                                    </td>
                                    <td className='actions-tbody'>
                                        <button className='button-edit-icon'
                                        onClick={() => handleEditProductClick(product._id)}
                                        >
                                            <img src={editIcon} alt="Edit Icon" />
                                            </button>
                                        <button className='button-delete-icon' 
                                        onClick={() => handleDeleteProductClick(product._id)}>
                                            <img src={deleteIcon} alt="Delete Icon" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )
        }
    </div>
  )
}

export default AdminFinishedProductPage