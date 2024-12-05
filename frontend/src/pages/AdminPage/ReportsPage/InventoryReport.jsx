import React, { useEffect, useState } from 'react'
import '../../../CSS/AdminCSS/AdminReports/InventoryReport.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logoDepot from '../../../assets/icons/logo-depot.png';
import logoDepot2 from '../../../assets/icons/logo-3.png';

const fetchBase64 = async (filename) => {
    const response = await fetch(filename);
    const text = await response.text();
    return text.trim();
};

function InventoryReport() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [leftLogoBase64, setLeftLogoBase64] = useState('');
    const [rightLogoBase64, setRightLogoBase64] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredReports, setFilteredReports] = useState([]);

    useEffect(() => {
        //set default selectedDate to today's date
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);

        const fetchLogos = async() => {
            const leftLogo = await fetchBase64('/baseLogo.txt');
            const rightLogo = await fetchBase64('/baseLogo2.txt');
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
            const response = await axios.get('/adminReports/getInventoryReportsAdmin');
            setReports(response.data);
            setLoading(false);
        } catch (error) {
            setError(error);
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
        doc.text('FINISHED GOODS PRODUCTION REPORT', 14, 47);
        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
        doc.setFontSize(10).setFont(undefined, 'normal');
        doc.text(`DATE: ${formattedDate}`, 14, 52);

        doc.autoTable({
            startY: 60,
            head: [['PRODUCTS', 'UCM', 'QTY', 'REMARKS']],
            body: filteredReports.map(report => [
                report.productName,
                report.sizeUnit,
                report.quantity,
                report.remarks
            ]),
            styles: { fontSize: 10, halign: 'center' },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0] },
            bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0] },
        });

        doc.setFontSize(10);
        doc.text('Prepared by:', 14, doc.autoTable.previous.finalY + 10);
        doc.text('Checked by:', 80, doc.autoTable.previous.finalY + 10);
        doc.text('Received by:', 150, doc.autoTable.previous.finalY + 10);

        doc.text('___________________', 14, doc.autoTable.previous.finalY + 20);
        doc.text('___________________', 80, doc.autoTable.previous.finalY + 20);
        doc.text('___________________', 150, doc.autoTable.previous.finalY + 20);

        doc.save('Inventory_Report.pdf');
    };

  return (
    <div className='admin-inventory-report-container'>
        <div className='admin-inventory-report-header'>
            <button onClick={handleGenerateReport}>Download</button>
        </div>
        <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
        />
        {
            loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error loading products.</p>
            ) : (
                <div className='admin-inventory-report-content'>
                    <div className='report-header'>
                        <div>
                            <img src={logoDepot2} alt="Logo" className='logo-inventory-report' />
                        </div>
                        <div className='report-title'>
                            <h1>CLEAN UP SOLUTIONS ENTERPRISES, INC.</h1>
                            <p>Prk. Ubas, Brgy. Sto. Nino, Panabo City, Davao del Norte</p>
                            <p>(084) 309-2454/0930-8970769</p>
                            <p>FB Page: Sabon Depot - Mindanao</p>
                        </div>
                        <div>
                            <img src={logoDepot2} alt="Logo" className='logo-inventory-report' />
                        </div>
                    </div>
                    <div className='admin-inventory-report-details'>
                        <h2>FINISHED GOODS PRODUCTION REPORT</h2>
                        <p>Date: {selectedDate ? new Date(selectedDate).toLocaleDateString() : ''}</p>
                    </div>
                    <table className='admin-inventory-report-table'>
                        <thead>
                            <tr>
                                <th>PRODUCTS</th>
                                <th>UCM</th>
                                <th>QTY</th>
                                <th>REMARKS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredReports.length > 0 ? (
                                    filteredReports.map((report) => (
                                        <tr key={report._id}>
                                            <td>{report.productName}</td>
                                            <td>{report.sizeUnit || 'N/A'}</td>
                                            <td>{report.quantity}</td>
                                            <td>{report.remarks}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <p>No inventory report this day.</p>
                                )
                            }
                        </tbody>
                    </table>
                    <div className='admin-inventory-report-footer'>
                        <div>
                            <p>Prepared by:</p>
                            <p>____________________</p>
                        </div>
                        <div>
                            <p>Checked by:</p>
                            <p>____________________</p>
                        </div>
                        <div>
                            <p>Received by:</p>
                            <p>____________________</p>
                        </div>
                    </div>
                    <div className='production-staff'>
                        <p>PRODUCTION STAFF</p>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default InventoryReport
