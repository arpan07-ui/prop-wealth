import { supabase } from './supabaseClient';

export interface PurchaseRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  firm_name: string;
  challenge_type: string;
  account_size: string;
  purchase_date: string;
  order_number: string;
  discount_code?: string;
  proof_url?: string;
  credit_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

const STORAGE_KEY = 'propx_purchase_requests';

// Initial sample data so admin and user always have realistic mock data out of the box
const DEFAULT_REQUESTS: PurchaseRequest[] = [
  {
    id: 'pr-101',
    user_id: 'user-sample-1',
    user_name: 'Wali 99',
    user_email: 'renoxg1@gmail.com',
    firm_name: 'FTMO',
    challenge_type: '2-Step Evaluation',
    account_size: '$100,000',
    purchase_date: '2026-09-08',
    order_number: 'FTMO-8829412',
    discount_code: 'WEALTHX',
    proof_url: '',
    credit_amount: 1000,
    status: 'pending',
    admin_notes: '',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'pr-102',
    user_id: 'user-sample-2',
    user_name: 'Alex Rivera',
    user_email: 'alex.trader@gmail.com',
    firm_name: 'FundedNext',
    challenge_type: 'Stellar 2-Step',
    account_size: '$50,000',
    purchase_date: '2026-09-05',
    order_number: 'FN-99104',
    discount_code: 'WEALTH15',
    proof_url: '',
    credit_amount: 500,
    status: 'approved',
    admin_notes: 'Verified via FundedNext partner dashboard. 500 Wealth Credits assigned.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

export const calculateEstimatedCredits = (accountSize: string): number => {
  const clean = accountSize.replace(/[^0-9]/g, '');
  const num = parseInt(clean, 10);
  if (num >= 300000) return 3000;
  if (num >= 200000) return 2000;
  if (num >= 100000) return 1000;
  if (num >= 50000)  return 500;
  if (num >= 25000)  return 250;
  if (num >= 10000)  return 100;
  return 50;
};

export const getLocalRequests = (): PurchaseRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REQUESTS));
      return DEFAULT_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_REQUESTS;
  }
};

export const saveLocalRequests = (items: PurchaseRequest[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('purchase_requests_updated'));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

export const fetchPurchaseRequests = async (userId?: string): Promise<PurchaseRequest[]> => {
  try {
    // Try querying Supabase
    let query = supabase.from('purchase_requests').select('*').order('created_at', { ascending: false });
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      // Merge with local if needed
      return data as PurchaseRequest[];
    }
  } catch (err) {
    console.warn('Supabase purchase_requests fetch fallback to local:', err);
  }

  // Fallback to local storage
  const local = getLocalRequests();
  if (userId) {
    // Match either exact user_id or sample/current email
    return local.filter(r => r.user_id === userId || r.user_email === userId);
  }
  return local;
};

export const submitPurchaseRequest = async (
  reqData: Omit<PurchaseRequest, 'id' | 'created_at' | 'status'>
): Promise<PurchaseRequest> => {
  const newReq: PurchaseRequest = {
    ...reqData,
    id: 'pr-' + Date.now(),
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  // 1. Save to local storage first (instant responsiveness)
  const local = getLocalRequests();
  const updated = [newReq, ...local];
  saveLocalRequests(updated);

  // 2. Background push to Supabase
  try {
    await supabase.from('purchase_requests').insert([newReq]);
  } catch (e) {
    console.warn('Supabase background insert notice:', e);
  }

  return newReq;
};

export const approvePurchaseRequest = async (
  id: string,
  creditAmount: number,
  adminNotes?: string
): Promise<void> => {
  const local = getLocalRequests();
  const target = local.find(r => r.id === id);
  const updated = local.map(r => {
    if (r.id === id) {
      return {
        ...r,
        status: 'approved' as const,
        credit_amount: creditAmount,
        admin_notes: adminNotes || 'Approved by Admin. Wealth Credits credited to account.',
        updated_at: new Date().toISOString(),
      };
    }
    return r;
  });
  saveLocalRequests(updated);

  // Background update Supabase
  try {
    await supabase
      .from('purchase_requests')
      .update({
        status: 'approved',
        credit_amount: creditAmount,
        admin_notes: adminNotes || 'Approved by Admin',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    // If target has a user_id, increment points in profile if available
    if (target?.user_id) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', target.user_id)
        .maybeSingle();

      const currentPts = userProfile?.points || 0;
      await supabase
        .from('profiles')
        .update({ points: currentPts + creditAmount })
        .eq('id', target.user_id);
    }
  } catch (e) {
    console.warn('Supabase approve update notice:', e);
  }
};

export const rejectPurchaseRequest = async (
  id: string,
  reason: string
): Promise<void> => {
  const local = getLocalRequests();
  const updated = local.map(r => {
    if (r.id === id) {
      return {
        ...r,
        status: 'rejected' as const,
        admin_notes: reason,
        updated_at: new Date().toISOString(),
      };
    }
    return r;
  });
  saveLocalRequests(updated);

  try {
    await supabase
      .from('purchase_requests')
      .update({
        status: 'rejected',
        admin_notes: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
  } catch (e) {
    console.warn('Supabase reject update notice:', e);
  }
};
