
import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import UserPortal from './portals/UserPortal';
import DealerPortal from './portals/DealerPortal';
import AdminPortal from './portals/AdminPortal';
import { HomeIcon, HistoryIcon, ComplaintIcon, StockIcon, DistributeIcon, ReportIcon, UsersIcon, LogoutIcon, ShopIcon } from './icons';


const NavLink: React.FC<{ icon: ReactNode; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
    <a href="#" onClick={onClick} className={`flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-md transition-colors duration-200 ${active ? 'bg-gray-700' : ''}`}>
        {icon}
        <span className="mx-4 font-medium">{label}</span>
    </a>
);


const Sidebar: React.FC = () => {
    const { currentUser, logout } = useAuth();

    const renderNavLinks = () => {
        // This is a placeholder for a more complex navigation state management.
        // In a real app, you would likely use react-router's NavLink.
        // For this app, the navigation is handled inside each portal component.
        switch(currentUser?.role) {
            case UserRole.USER:
                return (
                    <>
                        <NavLink icon={<HomeIcon className="h-6 w-6" />} label="Dashboard" active />
                        <NavLink icon={<HistoryIcon className="h-6 w-6" />} label="History" />
                        <NavLink icon={<ComplaintIcon className="h-6 w-6" />} label="Complaints" />
                    </>
                );
            case UserRole.DEALER:
                 return (
                    <>
                        <NavLink icon={<HomeIcon className="h-6 w-6" />} label="Dashboard" active />
                        <NavLink icon={<StockIcon className="h-6 w-6" />} label="Manage Stock" />
                        <NavLink icon={<DistributeIcon className="h-6 w-6" />} label="Distribute" />
                        <NavLink icon={<ComplaintIcon className="h-6 w-6" />} label="Complaints" />
                    </>
                );
            case UserRole.ADMIN:
                return (
                     <>
                        <NavLink icon={<HomeIcon className="h-6 w-6" />} label="Dashboard" active />
                        <NavLink icon={<ShopIcon className="h-6 w-6" />} label="Manage Shops" />
                        <NavLink icon={<UsersIcon className="h-6 w-6" />} label="Manage Users" />
                        <NavLink icon={<ComplaintIcon className="h-6 w-6" />} label="Complaints" />
                        <NavLink icon={<ReportIcon className="h-6 w-6" />} label="Reports" />
                    </>
                );
            default:
                return null;
        }
    }
    
    return (
        <div className="flex flex-col w-64 bg-gray-800 min-h-screen">
            <div className="flex items-center justify-center h-20 border-b border-gray-700">
                <h1 className="text-2xl font-bold text-white">Ration System</h1>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                {renderNavLinks()}
            </nav>
            <div className="px-2 py-4 border-t border-gray-700">
                 <NavLink icon={<LogoutIcon className="h-6 w-6" />} label="Logout" onClick={logout} />
            </div>
        </div>
    );
};


const DashboardLayout: React.FC = () => {
    const { currentUser } = useAuth();

    const renderPortal = () => {
        switch (currentUser?.role) {
            case UserRole.USER:
                return <UserPortal />;
            case UserRole.DEALER:
                return <DealerPortal />;
            case UserRole.ADMIN:
                return <AdminPortal />;
            default:
                return <div>Invalid Role</div>;
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8 bg-gray-100">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome, {currentUser?.name}!</h1>
                    <p className="text-gray-600">Here's your {currentUser?.role?.toLowerCase()} dashboard overview.</p>
                </header>
                {renderPortal()}
            </main>
        </div>
    );
};

export default DashboardLayout;
