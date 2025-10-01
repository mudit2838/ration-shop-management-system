
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { User, ComplaintStatus } from '../../types';
import Card from '../shared/Card';

type UserView = 'DASHBOARD' | 'HISTORY' | 'COMPLAINTS';

const UserPortal: React.FC = () => {
    const [view, setView] = useState<UserView>('DASHBOARD');
    const { currentUser } = useAuth();
    const { distributions, stocks, shops, complaints, setComplaints } = useData();

    const userDetails = currentUser?.details as User;
    const userDistributions = distributions.filter(d => d.userId === userDetails.id);
    const userShop = shops.find(s => s.id === userDetails.shopId);
    const userShopStock = stocks.find(s => s.shopId === userDetails.shopId);
    const userComplaints = complaints.filter(c => c.userId === userDetails.id);

    const entitlement = {
        wheat: userDetails.familySize * 5,
        rice: userDetails.familySize * 5,
        sugar: userDetails.familySize * 1,
        kerosene: userDetails.familySize * 0.5
    };

    const renderDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Monthly Ration Entitlement">
                <ul className="space-y-2 text-gray-700">
                    <li><strong>Wheat:</strong> {entitlement.wheat} kg</li>
                    <li><strong>Rice:</strong> {entitlement.rice} kg</li>
                    <li><strong>Sugar:</strong> {entitlement.sugar} kg</li>
                    <li><strong>Kerosene:</strong> {entitlement.kerosene.toFixed(1)} liters</li>
                </ul>
            </Card>
            <Card title="Assigned Shop Information">
                {userShop && (
                    <div className="space-y-2 text-gray-700">
                        <p><strong>Dealer:</strong> {userShop.dealerName}</p>
                        <p><strong>Location:</strong> {userShop.shopLocation}</p>
                        <p><strong>Contact:</strong> {userShop.contact}</p>
                    </div>
                )}
            </Card>
            <Card title="Live Stock at Shop">
                {userShopStock ? (
                    <ul className="space-y-2 text-green-700 font-medium">
                        <li>Wheat: {userShopStock.wheatKg} kg</li>
                        <li>Rice: {userShopStock.riceKg} kg</li>
                        <li>Sugar: {userShopStock.sugarKg} kg</li>
                        <li>Kerosene: {userShopStock.keroseneLiters} liters</li>
                    </ul>
                ) : <p className="text-red-500">Stock data not available.</p>}
                 <p className="text-xs text-gray-500 mt-2">Last Updated: {userShopStock ? new Date(userShopStock.lastUpdated).toLocaleString() : 'N/A'}</p>
            </Card>
        </div>
    );

    const renderHistory = () => (
        <Card title="Ration Distribution History">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3">Date</th>
                            <th className="p-3">Item</th>
                            <th className="p-3">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userDistributions.length > 0 ? userDistributions.map(d => (
                            <tr key={d.id} className="border-b">
                                <td className="p-3">{new Date(d.date).toLocaleDateString()}</td>
                                <td className="p-3">{d.itemName}</td>
                                <td className="p-3">{d.quantityGiven} {d.unit}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan={3} className="p-3 text-center text-gray-500">No records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    const RenderComplaints = () => {
        const [complaintText, setComplaintText] = useState('');
        const [successMessage, setSuccessMessage] = useState('');

        const handleComplaintSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!complaintText.trim()) return;

            const newComplaint = {
                id: Date.now(),
                userId: userDetails.id,
                shopId: userDetails.shopId,
                complaintText,
                status: ComplaintStatus.PENDING,
                date: new Date().toISOString()
            };
            setComplaints(prev => [newComplaint, ...prev]);
            setComplaintText('');
            setSuccessMessage('Your complaint has been submitted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        };

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="File a New Complaint">
                    <form onSubmit={handleComplaintSubmit}>
                        <textarea
                            value={complaintText}
                            onChange={e => setComplaintText(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            placeholder="Describe your issue here..."
                            required
                        ></textarea>
                        <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Submit Complaint
                        </button>
                        {successMessage && <p className="mt-4 text-center text-green-600">{successMessage}</p>}
                    </form>
                </Card>
                <Card title="Your Complaint History">
                    <ul className="space-y-4">
                        {userComplaints.length > 0 ? userComplaints.map(c => (
                            <li key={c.id} className="border p-4 rounded-md">
                                <p className="text-gray-700">{c.complaintText}</p>
                                <div className="flex justify-between items-center mt-2 text-sm">
                                    <span className={`font-semibold px-2 py-1 rounded-full text-xs ${c.status === ComplaintStatus.PENDING ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                                        {c.status}
                                    </span>
                                    <span className="text-gray-500">{new Date(c.date).toLocaleDateString()}</span>
                                </div>
                            </li>
                        )) : <p className="text-gray-500">No complaints filed yet.</p>}
                    </ul>
                </Card>
            </div>
        );
    };

    const renderContent = () => {
        switch (view) {
            case 'DASHBOARD': return renderDashboard();
            case 'HISTORY': return renderHistory();
            case 'COMPLAINTS': return <RenderComplaints />;
            default: return renderDashboard();
        }
    };
    
    return (
        <div>
            <div className="flex border-b mb-6">
                <button onClick={() => setView('DASHBOARD')} className={`px-4 py-2 ${view === 'DASHBOARD' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Dashboard</button>
                <button onClick={() => setView('HISTORY')} className={`px-4 py-2 ${view === 'HISTORY' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>History</button>
                <button onClick={() => setView('COMPLAINTS')} className={`px-4 py-2 ${view === 'COMPLAINTS' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Complaints</button>
            </div>
            {renderContent()}
        </div>
    );
};

export default UserPortal;
