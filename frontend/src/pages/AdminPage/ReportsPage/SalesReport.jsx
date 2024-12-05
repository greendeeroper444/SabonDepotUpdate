import React, { useEffect, useState } from 'react'
import '../../../CSS/AdminCSS/AdminReports/SalesReport.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-multi-date-picker';
import logoDepot from '../../../assets/icons/logo-depot.png'

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
    const [selectedDates, setSelectedDates] = useState([new Date()]);
    const [leftLogoBase64, setLeftLogoBase64] = useState('');

    useEffect(() => {
        const fetchLogos = async () => {
            const leftLogo = await fetchBase64('/baseLogo.txt');
            // const rightLogo = await fetchBase64('/base64.txt');
            setLeftLogoBase64(leftLogo);
            // setRightLogoBase64(rightLogo);
        };

        fetchLogos();
        fetchReports();
    }, []);

    useEffect(() => {
        const filtered = reports.filter(report => {
            const reportDate = new Date(report.reportDate).toLocaleDateString();
            return selectedDates.some(date =>
                new Date(date).toLocaleDateString() === reportDate
            );
        });
        setFilteredReports(filtered);
    }, [selectedDates, reports]);

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

    const getDateRange = () => {
        if(selectedDates.length === 0) return '';
        const sortedDates = [...selectedDates].sort((a, b) => new Date(a) - new Date(b));
        const startDate = new Date(sortedDates[0]).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const endDate = new Date(sortedDates[sortedDates.length - 1]).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        return startDate === endDate ? startDate : `${startDate} to ${endDate}`;
    };

    //uppdated handleGenerateReport method
    const handleGenerateReport = () => {
        const doc = new jsPDF();
        doc.addImage(leftLogoBase64, 'PNG', 14, 10, 30, 30);
        // doc.addImage(rightLogoBase64, 'PNG', 160, 10, 30, 30);
        doc.setFontSize(14).setTextColor(0, 0, 0).setFont(undefined, 'bold');
        doc.text('CLEAN UP SOLUTIONS ENTERPRISES, INC.', 50, 16);
        doc.setFontSize(10).setFont(undefined, 'normal');
        doc.text('Prk. Ubas, Brgy. Sto. Nino, Panabo City, Davao del Norte', 50, 22);
        doc.text('Tel: (084) 309-2454 / 0909-8970769', 50, 26);
        doc.text('FB Page: Sabon Depot-Mindanao', 50, 30);
        doc.setFontSize(12).setFont(undefined, 'bold');
        doc.text('SALES REPORT', 14, 47);
        
        const dateRange = getDateRange();
        doc.setFontSize(10).setFont(undefined, 'normal');
        doc.text(`DATE: ${dateRange}`, 14, 52);

        doc.autoTable({
            startY: 60,
            head: [['PRODUCT NAME', 'CODE', 'SIZE', 'CATEGORY', 'PRICE', 'UNITS SOLD', 'TOTAL REVENUE', 'DATE']],
            body: filteredReports.map(report => [
                report.productName,
                report.productCode,
                report.sizeUnit,
                report.category,
                report.price,
                report.unitsSold,
                report.totalRevenue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }),
                new Date(report.reportDate).toLocaleDateString()
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
                    <img src={logoDepot} alt="Logo" className="logo" />
                    <div>
                        <h1>CLEAN UP SOLUTIONS ENTERPRISES, INC.</h1>
                        <p>Prk. Ubos, Brgy. Sto. Niño, Panabo City, Davao del Norte</p>
                        <p>(084) 309-2454 / 0930-8970769</p>
                        <p>FB Page: Sabon Depot - Mindanao</p>
                    </div>
                </div>
                <div className='report-title'>
                    <h2>Sales Report</h2>
                    <p>Date: {getDateRange()}</p>
                </div>
            </header>

            <div className='report-controls'>
                <DatePicker
                value={selectedDates}
                onChange={setSelectedDates}
                placeholder='Select dates'
                multiple
                format='MMM DD, YYYY'
                className='date-picker-input'
                maxDate={new Date()}
                />
                <button onClick={handleGenerateReport} className='print-button'>Download PDF</button>
            </div>

            {
                loading ? (
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
                                <th>Price</th>
                                <th>Units Sold</th>
                                <th>Total Revenue</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredReports.length > 0 ? (
                                    filteredReports.map(report => (
                                        <tr key={report.productId}>
                                            <td>{report.productName}</td>
                                            <td>{report.productCode}</td>
                                            <td>{report.sizeUnit}</td>
                                            <td>{report.category}</td>
                                            <td>{report.price}</td>
                                            <td>{report.unitsSold}</td>
                                            <td>
                                                {
                                                    report.totalRevenue.toLocaleString('en-US', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })
                                                }
                                            </td>
                                            <td>{new Date(report.reportDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">No sales reports for the selected dates.</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                )
            }
        </div>
    )
}

export default SalesReportPage
