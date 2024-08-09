import React, { useEffect, useState } from 'react'
import '../../CSS/StaffCSS/StaffProducts.css';
import editIcon from '../../assets/staff/stafficons/staff-orders-edit-icon.png';
import deleteIcon from '../../assets/staff/stafficons/staff-orders-delete-icon.png';
import archiveIcon from '../../assets/staff/stafficons/staff-products-archive-icon.png';
import axios from 'axios';
import StaffModalProductsAddComponent from '../../components/StaffComponents/StaffModalProducts/StaffModalProductsAddComponent';
import StaffModalProductsDeleteComponent from '../../components/StaffComponents/StaffModalProducts/StaffModalProductsDeleteComponent';
import StaffModalProductsEditComponent from '../../components/StaffComponents/StaffModalProducts/StaffModalProductsEditComponent';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


function StaffProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);


    //generate PDF report
    const handleGenerateReport = () => {
        const doc = new jsPDF();
    
        //title
        doc.setFontSize(18);
        doc.setTextColor(34, 31, 197);
        doc.setFont(undefined, 'bold');
        doc.text('CLEAN-UP SOLUTIONS ENTERPRISES, INC.', 14, 16);
    
        //subtitle
        doc.setFontSize(14);
        doc.setTextColor(197, 31, 41);
        doc.setFont(undefined, 'bold');
        doc.text('PRICE MONITORING SHEET', 14, 24);
    
        //date
        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }).format(now);
        const upperCaseDate = formattedDate.toUpperCase();
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text(`AS OF ${upperCaseDate}`, 14, 32);
    
        //table
        doc.autoTable({
            startY: 40,
            head: [['Product Code', 'Product', 'Category', 'Price']],
            body: products.map(product => [
                product.productCode,
                product.productName,
                product.category,
                product.price.toFixed(2)
            ]),
            styles: {fontSize: 12, halign: 'center'},
            headStyles: {fillColor: [0, 0, 139]},
        });
    
        //save the PDF
        doc.save('product_report.pdf');
    };


    //edit function
    const handleEditProductClick = async(productId) => {
        try {
            const response = await axios.get(`/staffProduct/getEditProductStaff/${productId}`);
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
            const response = await axios.delete(`/staffProduct/deleteProductStaff/${productIdToDelete}`);
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
            const response = await axios.get('/staffProduct/getProductStaff');
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
    <div className='staff-products-container'>

        <StaffModalProductsAddComponent 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        fetchProducts={fetchProducts}
        />

        <StaffModalProductsDeleteComponent
        isOpen={isDeleteModalOpen} 
        onClose={handleCloseDeleteModal} 
        onConfirm={handleConfirmDelete} 
        />

        <StaffModalProductsEditComponent
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal} 
        selectedProduct={selectedProduct}
        fetchProducts={fetchProducts}
        />

        <div className='staff-products-header'>
            <h1>CLEAN-UP SOLUTIONS ENTERPRISES, INC.</h1>
            <h2>PRICE MONITORING SHEET</h2>
            <p>As of May 30, 2022</p>
        </div>
        <div className='staff-products-controls'>
            <button onClick={handleAddProductClick}>Add Product</button>
            <button onClick={handleGenerateReport}>Reports</button>
        </div>

        {error && <p>{error}</p>}
        
        {
            products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <table className='staff-products-table'>
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
                                    <td>{`₱${product.price.toFixed(2)}`}</td>
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
                                            <img src={archiveIcon} alt="Delete Icon" />
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

export default StaffProductsPage