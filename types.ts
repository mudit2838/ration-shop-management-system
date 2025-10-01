
export enum UserRole {
  USER = 'USER',
  DEALER = 'DEALER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  name: string;
  rationCardNumber: string;
  aadhaarNumber: string;
  familySize: number;
  contact: string;
  address: string;
  shopId: number;
  password?: string; // Only for login simulation
}

export interface ShopDetails {
  id: number;
  dealerName: string;
  dealerId: string;
  shopLocation: string;
  contact: string;
  password?: string; // Only for login simulation
}

export interface Stock {
  id: number;
  shopId: number;
  wheatKg: number;
  riceKg: number;
  sugarKg: number;
  keroseneLiters: number;
  lastUpdated: string;
}

export interface DistributionRecord {
  id: number;
  userId: number;
  shopId: number;
  itemName: 'Wheat' | 'Rice' | 'Sugar' | 'Kerosene';
  quantityGiven: number;
  date: string;
  unit: 'kg' | 'liters';
}

export enum ComplaintStatus {
  PENDING = 'Pending',
  RESOLVED = 'Resolved',
}

export interface Complaint {
  id: number;
  userId: number;
  shopId: number;
  complaintText: string;
  status: ComplaintStatus;
  date: string;
}

export interface Admin {
  id: number;
  name: string;
  adminId: string;
  password?: string; // Only for login simulation
}

export interface AuthenticatedUser {
  id: number;
  name: string;
  role: UserRole;
  // Fix: Replaced undefined type 'Dealer' with 'ShopDetails'.
  details: User | ShopDetails | Admin;
}