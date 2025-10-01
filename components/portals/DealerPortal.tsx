
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ShopDetails, Stock, User, ComplaintStatus, DistributionRecord } from '../../types';
import Card from '../shared/Card';

type DealerView = 'DASHBOARD' | 'STOCK' | 'DISTRIBUTE' | 'COMPLAINTS';

const DealerPortal: React.FC = () => {
    const [view, setView] = useState<DealerView>('DASHBOARD');
    const { currentUser } = useAuth();
    const { stocks, setStocks, users, complaints, distributions, setDistributions } = useData();

    const dealerDetails = currentUser?.details as ShopDetails;
    const shopStock = stocks.find(s => s.shopId === dealerDetails.id) as Stock;
    const shopUsers = users.filter(u => u.shopId === dealerDetails.id);
    const shopComplaints = complaints.filter(c => c.shopId === dealerDetails.id);
    
    const [currentStock, setCurrentStock] = useState<Stock>(shopStock);

    const handleStockUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setStocks(prevStocks => prevStocks.map(s => s.id === currentStock.id ? {...currentStock, lastUpdated: new Date().toISOString()} : s));
        alert('Stock updated successfully!');
    };
    
    const renderDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Wheat Stock"><p className="text-3xl font-bold text-blue-600">{shopStock.wheatKg} <span className="text-lg">kg</span></p></Card>
            <Card title="Rice Stock"><p className="text-3xl font-bold text-blue-600">{shopStock.riceKg} <span className="text-lg">kg</span></p></Card>
            <Card title="Sugar Stock"><p className="text-3xl font-bold text-blue-600">{shopStock.sugarKg} <span className="text-lg">kg</span></p></Card>
            <Card title="Kerosene Stock"><p className="text-3xl font-bold text-blue-600">{shopStock.keroseneLiters} <span className="text-lg">liters</span></p></Card>
            <Card title="Beneficiaries"><p className="text-3xl font-bold">{shopUsers.length}</p></Card>
            <Card title="Pending Complaints"><p className="text-3xl font-bold text-red-500">{shopComplaints.filter(c=>c.status === ComplaintStatus.PENDING).length}</p></Card>
        </div>
    );
    
    const renderUpdateStock = () => (
        <Card title="Update Stock Levels">
            <form onSubmit={handleStockUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(currentStock).filter(k => !['id', 'shopId', 'lastUpdated'].includes(k)).map(key => (
                     <div key={key}>
                        <label className="capitalize block text-sm font-medium text-gray-700">{key.replace('Kg', ' (kg)').replace('Liters', ' (liters)')}</label>
                        <input
                            type="number"
                            value={currentStock[key as keyof Stock] as number}
                            onChange={e => setCurrentStock({...currentStock, [key]: Number(e.target.value)})}
                            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                ))}
                <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">Update Stock</button>
                </div>
            </form>
        </Card>
    );
    
    const DistributeRation = () => {
        const [rationCardNumber, setRationCardNumber] = useState('');
        const [foundUser, setFoundUser] = useState<User | null>(null);
        const [error, setError] = useState('');
        const [items, setItems] = useState({ wheat: 0, rice: 0, sugar: 0, kerosene: 0 });

        const handleSearchUser = () => {
            const user = shopUsers.find(u => u.rationCardNumber === rationCardNumber);
            if(user) {
                setFoundUser(user);
                setError('');
            } else {
                setFoundUser(null);
                setError('User not found or not assigned to this shop.');
            }
        };

        const handleDistribute = () => {
            if (!foundUser) return;
            const newRecords: DistributionRecord[] = [];
            let canDistribute = true;
            
            if (items.wheat > shopStock.wheatKg || items.rice > shopStock.riceKg || items.sugar > shopStock.sugarKg || items.kerosene > shopStock.keroseneLiters) {
                alert('Cannot distribute more than available stock.');
                canDistribute = false;
            }

            if (canDistribute) {
                if (items.wheat > 0) newRecords.push({ id: Date.now() + 1, userId: foundUser.id, shopId: dealerDetails.id, itemName: 'Wheat', quantityGiven: items.wheat, unit: 'kg', date: new Date().toISOString() });
                if (items.rice > 0) newRecords.push({ id: Date.now() + 2, userId: foundUser.id, shopId: dealerDetails.id, itemName: 'Rice', quantityGiven: items.rice, unit: 'kg', date: new Date().toISOString() });
                if (items.sugar > 0) newRecords.push({ id: Date.now() + 3, userId: foundUser.id, shopId: dealerDetails.id, itemName: 'Sugar', quantityGiven: items.sugar, unit: 'kg', date: new Date().toISOString() });
                if (items.kerosene > 0) newRecords.push({ id: Date.now() + 4, userId: foundUser.id, shopId: dealerDetails.id, itemName: 'Kerosene', quantityGiven: items.kerosene, unit: 'liters', date: new Date().toISOString() });
                
                setDistributions(prev => [...prev, ...newRecords]);
                setStocks(prev => prev.map(s => s.id === shopStock.id ? {
                    ...s,
                    wheatKg: s.wheatKg - items.wheat,
                    riceKg: s.riceKg - items.rice,
                    sugarKg: s.sugarKg - items.sugar,
                    keroseneLiters: s.keroseneLiters - items.kerosene,
                    lastUpdated: new Date().toISOString()
                } : s));
                
                alert('Ration distributed successfully!');
                setRationCardNumber('');
                setFoundUser(null);
                setItems({ wheat: 0, rice: 0, sugar: 0, kerosene: 0 });
            }
        };

        return (
            <Card title="Distribute Ration">
                <div className="flex gap-2 mb-4">
                    <input type="text" value={rationCardNumber} onChange={e => setRationCardNumber(e.target.value)} placeholder="Enter Ration Card Number" className="flex-grow p-2 border rounded-md"/>
                    <button onClick={handleSearchUser} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">Search</button>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {foundUser && (
                    <div>
                        <h3 className="font-bold text-lg mb-2">{foundUser.name} (Family Size: {foundUser.familySize})</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label>Wheat (kg)</label><input type="number" value={items.wheat} onChange={e => setItems({...items, wheat: +e.target.value})} className="w-full p-2 border rounded"/></div>
                            <div><label>Rice (kg)</label><input type="number" value={items.rice} onChange={e => setItems({...items, rice: +e.target.value})} className="w-full p-2 border rounded"/></div>
                            <div><label>Sugar (kg)</label><input type="number" value={items.sugar} onChange={e => setItems({...items, sugar: +e.target.value})} className="w-full p-2 border rounded"/></div>
                            <div><label>Kerosene (liters)</label><input type="number" value={items.kerosene} onChange={e => setItems({...items, kerosene: +e.target.value})} className="w-full p-2 border rounded"/></div>
                        </div>
                        <button onClick={handleDistribute} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Distribute</button>
                    </div>
                )}
            </Card>
        );
    };

    const renderComplaints = () => (
         <Card title="User Complaints">
            <ul className="space-y-4">
                {shopComplaints.length > 0 ? shopComplaints.map(c => {
                    const user = users.find(u => u.id === c.userId);
                    return (
                        <li key={c.id} className="border p-4 rounded-md">
                            <p className="text-gray-700">{c.complaintText}</p>
                            <div className="flex justify-between items-center mt-2 text-sm">
                                <div>
                                    <span className={`font-semibold px-2 py-1 rounded-full text-xs ${c.status === ComplaintStatus.PENDING ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{c.status}</span>
                                    <span className="ml-2 text-gray-600">by {user?.name}</span>
                                </div>
                                <span className="text-gray-500">{new Date(c.date).toLocaleDateString()}</span>
                            </div>
                        </li>
                    )
                }) : <p className="text-gray-500">No complaints found.</p>}
            </ul>
        </Card>
    );

    const renderContent = () => {
        switch (view) {
            case 'DASHBOARD': return renderDashboard();
            case 'STOCK': return renderUpdateStock();
            case 'DISTRIBUTE': return <DistributeRation />;
            case 'COMPLAINTS': return renderComplaints();
            default: return renderDashboard();
        }
    };
    
    return (
        <div>
            <div className="flex border-b mb-6">
                <button onClick={() => setView('DASHBOARD')} className={`px-4 py-2 ${view === 'DASHBOARD' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Dashboard</button>
                <button onClick={() => setView('STOCK')} className={`px-4 py-2 ${view === 'STOCK' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Manage Stock</button>
                <button onClick={() => setView('DISTRIBUTE')} className={`px-4 py-2 ${view === 'DISTRIBUTE' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Distribute Ration</button>
                <button onClick={() => setView('COMPLAINTS')} className={`px-4 py-2 ${view === 'COMPLAINTS' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Complaints</button>
            </div>
            {renderContent()}
        </div>
    );
};

export default DealerPortal;
