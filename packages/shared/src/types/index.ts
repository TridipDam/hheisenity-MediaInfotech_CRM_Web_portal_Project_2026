// Common types shared between frontend and backend

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee' | 'manager';
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  checkIn: Date;
  checkOut?: Date;
  date: string; // YYYY-MM-DD format
  status: 'present' | 'absent' | 'late' | 'half-day';
}

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  price: number;
  category: string;
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  month: string; // YYYY-MM format
  baseSalary: number;
  overtime: number;
  deductions: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid';
  createdAt: Date;
  updatedAt: Date;
}