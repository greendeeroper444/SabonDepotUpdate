import React, { useEffect, useState } from 'react'
import '../../../CSS/AdminCSS/AdminInventory/FinishedProduct.css'
import axios from 'axios';
import editIcon from '../../../assets/staff/stafficons/staff-orders-edit-icon.png';
import deleteIcon from '../../../assets/staff/stafficons/staff-orders-delete-icon.png';
import AdminModalProductsAddComponent from '../../../components/AdminComponents/AdminModalProducts/AdminModalProductsAddComponent';
import AdminModalProductsDeleteComponent from '../../../components/AdminComponents/AdminModalProducts/AdminModalProductsDeleteComponent';
import AdminModalProductsEditComponent from '../../../components/AdminComponents/AdminModalProducts/AdminModalProductsEditComponent';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


function AdminFinishedProductPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [summaryData, setSummaryData] = useState({
        categoryCount: 0,
        totalProducts: 0,
        totalUnitsProduced: 0,
        totalValue: 0,
        lowStockCount: 0,
        notInStock: 0
    });

    useEffect(() => {
        const fetchSummaryData = async() => {
            try {
                const response = await axios.get('/adminProduct/getProductSummaryAdmin');
                setSummaryData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSummaryData();
    }, []);


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
                product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
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
            
            //sort products by quantity in ascending order
            const sortedProducts = response.data.sort((a, b) => a.quantity - b.quantity);
            
            setProducts(sortedProducts);
            setLoading(false);
        } catch (error) {
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
            <div className='admin-finished-product-container'>
            <table className='admin-finished-product-header-table'>
                <thead>
                    <tr>
                        <th>Categories</th>
                        <th>Total Products</th>
                        <th>Total Units Produced</th>
                        <th></th>
                        <th>Low Stocks</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{summaryData.categoryCount}</td>
                        <td>{summaryData.totalProducts}</td>
                        <td>{summaryData.totalUnitsProduced}</td>
                        <td>₱ {summaryData.totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>{summaryData.lowStockCount}</td>
                        <td>{summaryData.notInStock}</td>
                    </tr>
                    <tr className='subtext'>
                        {/* <td>Last 7 days</td>
                        <td>Last 7 days</td>
                        <td>Last 7 days</td> */}
                        <td>Total</td>
                        <td>Ordered</td>
                        <td>Not in stock</td>
                    </tr>
                </tbody>
            </table>
            </div>

        </div>

        <div className='admin-finished-product-controls'>
            <div>Products</div>
            <div>
                <button onClick={handleAddProductClick}>Add Product</button>
                <button onClick={handleGenerateReport}>Print</button>
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
                            <th>Product Code</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Availability</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((product) => (
                                <tr 
                                key={product._id} 
                                className={`${product.isArchived ? 'archived-product' : ''} 
                                ${product.quantity < product.stockLevel ? 'low-quantity' : ''} 
                                ${product.quantity === 0 ? 'out-of-quantity' : ''}
                                ${product.isArchived && product.quantity < product.stockLevel ? 'low-quantity archived-product' : ''}`}
                                >
                                    <td>{product.productCode}</td>
                                    <td className='product-image-name'>
                                        <img src={`http://localhost:8000/${product.imageUrl}`} alt={product.productName} />{' '}{product.productName}
                                    </td>
                                    <td>{product.category}</td>
                                    <td>{product.sizeUnit.slice(0, 1)} - {product.productSize}</td>
                                    <td>{`₱${product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</td>
                                    <td>{product.quantity}</td>
                                    <td className={product.quantity > 0 ? (product.quantity > product.stockLevel ? 'in-stock' : 'low-stock') : 'out-of-stock'}>
                                        {product.quantity > 0 ? (product.quantity > product.stockLevel ? 'In stock' : 'Low stock') : 'Out of stock'}
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