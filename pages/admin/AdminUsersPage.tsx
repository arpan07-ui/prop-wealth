import React, { useState, useEffect } from 'react';
import { Search, Loader2, Trash2, Shield, ShieldOff, UserCheck, UserX, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useModal } from '../../context/ModalContext';

interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    created_at: string;
    status: string;
    avatar_url: string | null;
}

const ITEMS_PER_PAGE = 10;

const AdminUsersPage: React.FC = () => {
    const { showModal } = useModal();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (id: string) => {
        showModal({
            type: 'confirm',
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                setActionLoading(id);
                try {
                    const { error } = await supabase.from('profiles').delete().eq('id', id);
                    if (error) throw error;
                    setUsers(users.filter(u => u.id !== id));
                    showModal({ type: 'success', title: 'Deleted', message: 'User deleted successfully.' });
                } catch (error) {
                    showModal({ type: 'error', title: 'Error', message: 'Failed to delete user.' });
                } finally {
                    setActionLoading(null);
                }
            }
        });
    };

    const handleRoleToggle = async (user: Profile) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        const actionLabel = newRole === 'admin' ? 'Promote to Admin' : 'Demote to User';
        showModal({
            type: 'confirm',
            title: actionLabel,
            message: `Are you sure you want to ${actionLabel.toLowerCase()} for ${user.full_name || user.email}?`,
            confirmText: actionLabel,
            cancelText: 'Cancel',
            onConfirm: async () => {
                setActionLoading(user.id);
                try {
                    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', user.id);
                    if (error) throw error;
                    setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
                    showModal({ type: 'success', title: 'Role Updated', message: 'User role updated successfully.' });
                } catch (error) {
                    showModal({ type: 'error', title: 'Error', message: 'Failed to update user role.' });
                } finally {
                    setActionLoading(null);
                }
            }
        });
    };

    const handleStatusToggle = async (user: Profile) => {
        const newStatus = user.status === 'active' ? 'banned' : 'active';
        const actionLabel = newStatus === 'banned' ? 'Ban User' : 'Unban User';
        showModal({
            type: 'confirm',
            title: actionLabel,
            message: `Are you sure you want to ${actionLabel.toLowerCase()} ${user.full_name || user.email}?`,
            confirmText: actionLabel,
            cancelText: 'Cancel',
            onConfirm: async () => {
                setActionLoading(user.id);
                try {
                    const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', user.id);
                    if (error) throw error;
                    setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
                    showModal({ type: 'success', title: 'Status Updated', message: 'User status updated.' });
                } catch (error) {
                    showModal({ type: 'error', title: 'Error', message: 'Failed to update user status.' });
                } finally {
                    setActionLoading(null);
                }
            }
        });
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const filtered = users.filter(user => {
        const matchSearch = (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchRole = roleFilter === 'all' || user.role === roleFilter;
        const matchStatus = statusFilter === 'all' || (user.status || 'active') === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const adminCount = users.filter(u => u.role === 'admin').length;
    const bannedCount = users.filter(u => u.status === 'banned').length;

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">User Management</h2>
                    <p className="text-white/40 text-xs mt-1">
                        {users.length} total users &bull; {adminCount} admins &bull; {bannedCount} banned
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-56 bg-[#111113] border border-white/8 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/25 focus:border-yellow-400/40 focus:outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                        className="bg-[#111113] border border-white/8 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-yellow-400/40"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="bg-[#111113] border border-white/8 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-yellow-400/40"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-white/40 gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-sm">Loading users...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">User</th>
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">Role</th>
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">Joined</th>
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">Status</th>
                                    <th className="px-5 py-3.5 text-right text-[10px] font-bold text-white/30 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {paginated.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/2 transition-colors group">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center font-bold text-yellow-400 text-xs overflow-hidden flex-shrink-0">
                                                    {user.avatar_url
                                                        ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                                        : (user.full_name || user.email || '?').charAt(0).toUpperCase()
                                                    }
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-white text-xs font-semibold truncate">{user.full_name || 'Unnamed User'}</div>
                                                    <div className="text-white/40 text-[11px] truncate">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={'inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ' + (user.role === 'admin'
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                : 'bg-white/5 text-white/40 border-white/8'
                                            )}>
                                                {user.role === 'admin' && <Shield size={9} />}
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-white/40">
                                            {user.created_at ? formatDate(user.created_at) : 'Unknown'}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={'inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ' + ((user.status || 'active') === 'active'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            )}>
                                                <span className={'w-1.5 h-1.5 rounded-full ' + ((user.status || 'active') === 'active' ? 'bg-green-400' : 'bg-red-400')}></span>
                                                {user.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {actionLoading === user.id ? (
                                                    <Loader2 size={14} className="animate-spin text-white/40" />
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleRoleToggle(user)}
                                                            className={'p-1.5 rounded-lg transition-colors ' + (user.role === 'admin'
                                                                ? 'text-purple-400 hover:bg-purple-400/10'
                                                                : 'text-white/40 hover:text-purple-400 hover:bg-purple-400/10'
                                                            )}
                                                            title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                                        >
                                                            {user.role === 'admin' ? <ShieldOff size={14} /> : <Shield size={14} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusToggle(user)}
                                                            className={'p-1.5 rounded-lg transition-colors ' + ((user.status || 'active') === 'active'
                                                                ? 'text-white/40 hover:text-orange-400 hover:bg-orange-400/10'
                                                                : 'text-orange-400 hover:bg-orange-400/10'
                                                            )}
                                                            title={(user.status || 'active') === 'active' ? 'Ban User' : 'Unban User'}
                                                        >
                                                            {(user.status || 'active') === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-white/30">
                                <div className="text-4xl mb-3">👤</div>
                                <div className="text-sm font-medium">No users found</div>
                                <div className="text-xs mt-1">Try adjusting your search or filters</div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <span className="text-xs text-white/30">
                        Showing {((page - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                    </span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={'w-8 h-8 text-xs font-bold rounded-lg transition-colors ' + (p === page ? 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/20' : 'text-white/40 hover:text-white hover:bg-white/5')}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;