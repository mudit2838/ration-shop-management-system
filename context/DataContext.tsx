
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, ShopDetails, Stock, DistributionRecord, Complaint, Admin } from '../types';
import { mockUsers, mockShops, mockStocks, mockDistributionRecords, mockComplaints, mockAdmins } from '../data/mockData';

interface DataContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  shops: ShopDetails[];
  setShops: React.Dispatch<React.SetStateAction<ShopDetails[]>>;
  stocks: Stock[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  distributions: DistributionRecord[];
  setDistributions: React.Dispatch<React.SetStateAction<DistributionRecord[]>>;
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  admins: Admin[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [shops, setShops] = useState<ShopDetails[]>(mockShops);
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [distributions, setDistributions] = useState<DistributionRecord[]>(mockDistributionRecords);
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);

  return (
    <DataContext.Provider value={{
      users, setUsers,
      shops, setShops,
      stocks, setStocks,
      distributions, setDistributions,
      complaints, setComplaints,
      admins
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
