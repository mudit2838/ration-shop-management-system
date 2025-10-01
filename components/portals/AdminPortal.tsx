
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ComplaintStatus } from '../../types';
import Card from '../shared/Card';

type AdminView = 'DASHBOARD' | 'SHOPS' | 'USERS' | 'COMPLAINTS' | 'REPORTS';

const AdminPortal: React.FC = () => {
    const [view, setView] = useState<AdminView>('DASHBOARD');
    const { users, shops, stocks, complaints, setComplaints } = useData();
    
    const totalPendingComplaints = complaints.filter(c => c.status === ComplaintStatus.PENDING).length;

    const resolveComplaint = (id: number) => {
        setComplaints(prev => prev.map(c => c.id === id ? {...c, status: ComplaintStatus.RESOLVED} : c));
    };

    const renderDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Total Shops"><p className="text-3xl font-bold">{shops.length}</p></Card>
            <Card title="Total Users"><p className="text-3xl font-bold">{users.length}</p></Card>
            <Card title="Pending Complaints"><p className="text-3xl font-bold text-red-500">{totalPendingComplaints}</p></Card>
            <Card title="Total Stock (Wheat)"><p className="text-3xl font-bold">{stocks.reduce((acc, s) => acc + s.wheatKg, 0)} kg</p></Card>
        </div>
    );
    
    const renderTable = (title: string, headers: string[], data: (string|number)[][]) => (
        <Card title={title}>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">{headers.map(h => <th key={h} className="p-3">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="border-b">{row.map((cell, j) => <td key={j} className="p-3">{cell}</td>)}</tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    const renderShops = () => renderTable('Manage Shops', ['Dealer ID', 'Dealer Name', 'Location', 'Contact'],
        shops.map(s => [s.dealerId, s.dealerName, s.shopLocation, s.contact])
    );
    
    const renderUsers = () => renderTable('Manage Beneficiaries', ['Ration Card No.', 'Name', 'Family Size', 'Shop ID', 'Contact'],
        users.map(u => [u.rationCardNumber, u.name, u.familySize, u.shopId, u.contact])
    );
    
    const renderComplaints = () => (
        <Card title="Resolve Complaints">
            <ul className="space-y-4">
                {complaints.length > 0 ? complaints.map(c => {
                    const user = users.find(u => u.id === c.userId);
                    const shop = shops.find(s => s.id === c.shopId);
                    return (
                        <li key={c.id} className="border p-4 rounded-md bg-white">
                            <p className="text-gray-800 font-medium">{c.complaintText}</p>
                            <div className="flex flex-wrap justify-between items-center mt-2 text-sm text-gray-600">
                                <span><span className="font-semibold">User:</span> {user?.name} ({user?.rationCardNumber})</span>
                                <span><span className="font-semibold">Shop:</span> {shop?.dealerName} ({shop?.dealerId})</span>
                                <span><span className="font-semibold">Date:</span> {new Date(c.date).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <span className={`font-semibold px-2 py-1 rounded-full text-xs ${c.status === ComplaintStatus.PENDING ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{c.status}</span>
                                {c.status === ComplaintStatus.PENDING && (
                                    <button onClick={() => resolveComplaint(c.id)} className="bg-green-600 text-white px-3 py-1 text-xs font-bold rounded hover:bg-green-700">Mark as Resolved</button>
                                )}
                            </div>
                        </li>
                    )
                }) : <p className="text-gray-500">No complaints found.</p>}
            </ul>
        </Card>
    );

    const renderReports = () => (
        <Card title="Generate Reports">
            <p className="text-gray-600">Report generation feature is under development.</p>
             <button className="mt-4 bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed">Download Report</button>
        </Card>
    );

    const renderContent = () => {
        switch (view) {
            case 'DASHBOARD': return renderDashboard();
            case 'SHOPS': return renderShops();
            case 'USERS': return renderUsers();
            case 'COMPLAINTS': return renderComplaints();
            case 'REPORTS': return renderReports();
            default: return renderDashboard();
        }
    };
    
    return (
        <div>
            <div className="flex border-b mb-6 flex-wrap">
                <button onClick={() => setView('DASHBOARD')} className={`px-4 py-2 ${view === 'DASHBOARD' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Dashboard</button>
                <button onClick={() => setView('SHOPS')} className={`px-4 py-2 ${view === 'SHOPS' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Manage Shops</button>
                <button onClick={() => setView('USERS')} className={`px-4 py-2 ${view === 'USERS' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Manage Users</button>
                <button onClick={() => setView('COMPLAINTS')} className={`px-4 py-2 ${view === 'COMPLAINTS' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Complaints</button>
                <button onClick={() => setView('REPORTS')} className={`px-4 py-2 ${view === 'REPORTS' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Reports</button>
            </div>
            {renderContent()}
        </div>
    );
};

export default AdminPortal;
