import type { Expense } from '../types/expense';
import { getTodayString } from '../utils/formatters';

const today = getTodayString();
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0];
const tenDaysAgo = new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0];
const fifteenDaysAgo = new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    title: 'Zomato Food Order',
    amount: 450,
    category: 'Food & Dining',
    date: today,
    payment_method: 'UPI',
    notes: 'Dinner with friends',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'D-Mart Supermarket Grocery',
    amount: 3280,
    category: 'Shopping',
    date: yesterday,
    payment_method: 'Credit Card',
    notes: 'Monthly household groceries & essentials',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Electricity Bill (Bescom / MSEDCL)',
    amount: 1850,
    category: 'Bills & Utilities',
    date: threeDaysAgo,
    payment_method: 'Net Banking',
    notes: 'August Electricity bill',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: '4',
    title: 'Petrol Fill at Indian Oil',
    amount: 1500,
    category: 'Transportation',
    date: fiveDaysAgo,
    payment_method: 'UPI',
    notes: 'Tank full for city commute',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: '5',
    title: 'PVR Cinema Movie Tickets',
    amount: 920,
    category: 'Entertainment',
    date: tenDaysAgo,
    payment_method: 'UPI',
    notes: 'Weekend movie show for 2',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: '6',
    title: 'Apollo Pharmacy Medicines',
    amount: 650,
    category: 'Healthcare',
    date: fifteenDaysAgo,
    payment_method: 'Debit Card',
    notes: 'Vitamin supplements and First aid kit',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: '7',
    title: 'Airtel Broadband Fiber Bill',
    amount: 1179,
    category: 'Bills & Utilities',
    date: fifteenDaysAgo,
    payment_method: 'UPI',
    notes: 'Monthly 200 Mbps Fiber plan',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];
