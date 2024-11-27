// import React from 'react'
// import '../../../CSS/AdminCSS/AdminReports/SalesReport.css';
// import logoDepot from '../../../assets/icons/logo-depot.png';

// function SalesReport() {
//   return (
//     <div className='sales-report-container'>
//       <header className='sales-report-header'>
//         <div className='company-info'>
//           <img src={logoDepot} alt="Sabon Depot Logo" className="logo" />
//           <div>
//             <h1>CLEAN UP SOLUTIONS ENTERPRISES, INC.</h1>
//             <p>Prk. Ubos, Brgy. Sto. Niño, Panabo City, Davao del Norte</p>
//             <p>(084) 309-2454 / 0930-8970769</p>
//             <p>FB Page: Sabon Depot - Mindanao</p>
//           </div>
//         </div>
//         <div className="report-title">
//           <h2>Sales Report</h2>
//           <p>Date: MM - DD - YY</p>
//         </div>
//       </header>
      
//       <div className='report-controls'>
//         <input
//           type="text"
//           placeholder='Search by ID, product, or others...'
//           className='search-input'
//         />
//         <div className='date-filter'>
//           <button className='date-range'>April 11 - April 24</button>
//         </div>
//         <button className='print-button'>Print</button>
//       </div>

//       <table className='sales-report-table'>
//         <thead>
//           <tr>
//             <th>Product Name</th>
//             <th>Product Code</th>
//             <th>Size</th>
//             <th>Category</th>
//             <th>Inventory Level</th>
//             <th>Units Sold</th>
//             <th>Total Revenue</th>
//           </tr>
//         </thead>
//         <tbody>
//           {/* Placeholder data */}
//           <tr>
//             <td></td>
//             <td></td>
//             <td></td>
//             <td></td>
//             <td></td>
//             <td></td>
//             <td></td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default SalesReport
// import React, { useEffect, useState } from 'react';
// import '../../../CSS/AdminCSS/AdminReports/SalesReport.css';
// import logoDepot from '../../../assets/icons/logo-depot.png';
// import axios from 'axios';

// function SalesReport() {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [reports, setReports] = useState([]);

//     useEffect(() => {
//         const fetchReports = async () => {
//             try {
//                 const response = await axios.get('/adminReports/getSalesReportsAdmin');
//                 setReports(response.data);
//             } catch (error) {
//                 setError('Error loading sales reports.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchReports();
//     }, []);

//     return (
//         <div className='sales-report-container'>
//             <header className='sales-report-header'>
//                 <div className='company-info'>
//                     <img src={logoDepot} alt="Sabon Depot Logo" className="logo" />
//                     <div>
//                         <h1>CLEAN UP SOLUTIONS ENTERPRISES, INC.</h1>
//                         <p>Prk. Ubos, Brgy. Sto. Niño, Panabo City, Davao del Norte</p>
//                         <p>(084) 309-2454 / 0930-8970769</p>
//                         <p>FB Page: Sabon Depot - Mindanao</p>
//                     </div>
//                 </div>
//                 <div className="report-title">
//                     <h2>Sales Report</h2>
//                     {/* Display the report date from the first report */}
//                     <p>Date: {reports.length > 0 ? new Date(reports[0].reportDate).toLocaleDateString() : ''}</p>
//                 </div>
//             </header>
            
//             <div className='report-controls'>
//                 <input
//                     type="text"
//                     placeholder='Search by ID, product, or others...'
//                     className='search-input'
//                 />
//                 <div className='date-filter'>
//                     <button className='date-range'>April 11 - April 24</button>
//                 </div>
//                 <button className='print-button'>Print</button>
//             </div>

//             <table className='sales-report-table'>
//                 <thead>
//                     <tr>
//                         <th>Product Name</th>
//                         <th>Product Code</th>
//                         <th>Size</th>
//                         <th>Category</th>
//                         <th>Inventory Level</th>
//                         <th>Units Sold</th>
//                         <th>Total Revenue</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {reports.map((report) => (
//                         <tr key={report.productId}>
//                             <td>{report.productName}</td>
//                             <td>{report.productCode}</td>
//                             <td>{report.sizeUnit}</td>
//                             <td>{report.category}</td>
//                             <td>{report.inventoryLevel}</td>
//                             <td>{report.unitsSold}</td>
//                             <td>{report.totalRevenue.toFixed(2)}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

// export default SalesReport;


import React, { useEffect, useState } from 'react';
import '../../../CSS/AdminCSS/AdminReports/SalesReport.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const fetchBase64 = async (filename) => {
    const response = await fetch(filename);
    const text = await response.text();
    return text.trim();
};

function SalesReportPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [leftLogoBase64, setLeftLogoBase64] = useState('');
    const [rightLogoBase64, setRightLogoBase64] = useState('');

    useEffect(() => {
        //set default selectedDate to today's date
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);

        const fetchLogos = async () => {
            const leftLogo = await fetchBase64('/base64.txt');
            const rightLogo = await fetchBase64('/base64.txt');
            setLeftLogoBase64(leftLogo);
            setRightLogoBase64(rightLogo);
        };

        fetchLogos();
        fetchReports();
    }, []);

    useEffect(() => {
        //filter reports based on selected date
        const filtered = reports.filter(report => {
            const reportDate = new Date(report.reportDate).toLocaleDateString();
            return reportDate === new Date(selectedDate).toLocaleDateString();
        });
        setFilteredReports(filtered);
    }, [selectedDate, reports]);

    const fetchReports = async() => {
        try {
            const response = await axios.get('/adminReports/getSalesReportsAdmin');
            setReports(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error loading sales reports.');
            setLoading(false);
        }
    };

    const handleGenerateReport = () => {
        const doc = new jsPDF();
        doc.addImage(leftLogoBase64, 'PNG', 14, 10, 30, 30);
        doc.addImage(rightLogoBase64, 'PNG', 160, 10, 30, 30);
        doc.setFontSize(14).setTextColor(0, 0, 0).setFont(undefined, 'bold');
        doc.text('CLEAN UP SOLUTIONS ENTERPRISES, INC.', 50, 16);
        doc.setFontSize(10).setFont(undefined, 'normal');
        doc.text('Prk. Ubas, Brgy. Sto. Nino, Panabo City, Davao del Norte', 50, 22);
        doc.text('Tel: (084) 309-2454 / 0909-8970769', 50, 26);
        doc.text('FB Page: Sabon Depot-Mindanao', 50, 30);
        doc.setFontSize(12).setFont(undefined, 'bold');
        doc.text('SALES REPORT', 14, 47);
        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
        doc.setFontSize(10).setFont(undefined, 'normal');
        doc.text(`DATE: ${formattedDate}`, 14, 52);

        doc.autoTable({
            startY: 60,
            head: [['PRODUCT NAME', 'CODE', 'SIZE', 'CATEGORY', 'UNITS SOLD', 'TOTAL REVENUE']],
            body: filteredReports.map(report => [
                report.productName,
                report.productCode,
                report.sizeUnit,
                report.category,
                // report.inventoryLevel,
                report.unitsSold,
                report.totalRevenue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }),
            ]),
            styles: {fontSize: 10, halign: 'center'},
            headStyles: {fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0]},
            bodyStyles: {fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0]},
        });

        doc.setFontSize(10);
        doc.text('Prepared by:', 14, doc.autoTable.previous.finalY + 10);
        doc.text('Checked by:', 80, doc.autoTable.previous.finalY + 10);
        doc.text('Received by:', 150, doc.autoTable.previous.finalY + 10);

        doc.text('___________________', 14, doc.autoTable.previous.finalY + 20);
        doc.text('___________________', 80, doc.autoTable.previous.finalY + 20);
        doc.text('___________________', 150, doc.autoTable.previous.finalY + 20);

        doc.save('Sales_Report.pdf');
    };

  return (
    <div className='sales-report-container'>
        <header className='sales-report-header'>
            <div className='company-info'>
                <img src={leftLogoBase64} alt="Logo" className="logo" />
                <div>
                    <h1>CLEAN UP SOLUTIONS ENTERPRISES, INC.</h1>
                    <p>Prk. Ubos, Brgy. Sto. Niño, Panabo City, Davao del Norte</p>
                    <p>(084) 309-2454 / 0930-8970769</p>
                    <p>FB Page: Sabon Depot - Mindanao</p>
                </div>
            </div>
            <div className='report-title'>
                <h2>Sales Report</h2>
                <p>Date: {selectedDate ? new Date(selectedDate).toLocaleDateString() : ''}</p>
            </div>
        </header>

        <div className='report-controls'>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button onClick={handleGenerateReport} className='print-button'>Download PDF</button>
        </div>

        {loading ? (
            <p>Loading...</p>
        ) : error ? (
            <p>{error}</p>
        ) : (
            <table className='sales-report-table'>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Product Code</th>
                        <th>Size</th>
                        <th>Category</th>
                        {/* <th>Inventory Level</th> */}
                        <th>Units Sold</th>
                        <th>Total Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                                <tr key={report.productId}>
                                    <td>{report.productName}</td>
                                    <td>{report.productCode}</td>
                                    <td>{report.sizeUnit}</td>
                                    <td>{report.category}</td>
                                    {/* <td>{report.inventoryLevel}</td> */}
                                    <td>{report.unitsSold}</td>
                                    <td>
                                        {report.totalRevenue.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <p>No sales report this day.</p>
                        )
                    }
                </tbody>
            </table>
        )}
    </div>
  )
}

export default SalesReportPage
