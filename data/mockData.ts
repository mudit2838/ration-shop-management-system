
import { User, ShopDetails, Stock, DistributionRecord, Complaint, Admin, ComplaintStatus } from '../types';

export const mockUsers: User[] = [
  { id: 1, name: 'Arjun Sharma', rationCardNumber: 'RCN12345', aadhaarNumber: 'AAD67890', familySize: 4, contact: '9876543210', address: '123, MG Road, Delhi', shopId: 101, password: 'user123' },
  { id: 2, name: 'Priya Verma', rationCardNumber: 'RCN67890', aadhaarNumber: 'AAD12345', familySize: 3, contact: '9876543211', address: '456, Park Street, Mumbai', shopId: 101, password: 'user456' },
  { id: 3, name: 'Rohan Singh', rationCardNumber: 'RCN54321', aadhaarNumber: 'AAD09876', familySize: 5, contact: '9876543212', address: '789, Brigade Road, Bangalore', shopId: 101, password: 'user789' },
];

export const mockShops: ShopDetails[] = [
  { id: 101, dealerName: 'Rajesh Kumar', dealerId: 'DEALER001', shopLocation: 'Sector 15, Delhi', contact: '8765432109', password: 'dealer123' },
];

export const mockStocks: Stock[] = [
  { id: 201, shopId: 101, wheatKg: 500, riceKg: 750, sugarKg: 200, keroseneLiters: 150, lastUpdated: new Date().toISOString() },
];

export const mockDistributionRecords: DistributionRecord[] = [
  { id: 301, userId: 1, shopId: 101, itemName: 'Wheat', quantityGiven: 10, unit: 'kg', date: '2023-10-05T10:00:00Z' },
  { id: 302, userId: 1, shopId: 101, itemName: 'Rice', quantityGiven: 15, unit: 'kg', date: '2023-10-05T10:00:00Z' },
  { id: 303, userId: 2, shopId: 101, itemName: 'Wheat', quantityGiven: 8, unit: 'kg', date: '2023-10-06T11:30:00Z' },
  { id: 304, userId: 1, shopId: 101, itemName: 'Wheat', quantityGiven: 10, unit: 'kg', date: '2023-09-04T09:00:00Z'},
];

export const mockComplaints: Complaint[] = [
  { id: 401, userId: 2, shopId: 101, complaintText: 'Shop was closed during working hours.', status: ComplaintStatus.PENDING, date: '2023-10-15T14:00:00Z' },
  { id: 402, userId: 3, shopId: 101, complaintText: 'Received less quantity of sugar than entitled.', status: ComplaintStatus.RESOLVED, date: '2023-09-20T12:00:00Z' },
];

export const mockAdmins: Admin[] = [
  { id: 501, name: 'Sunita Devi', adminId: 'ADMIN001', password: 'admin123' },
];
