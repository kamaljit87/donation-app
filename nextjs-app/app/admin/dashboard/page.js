'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/AuthContext';
import '../../AdminDashboard.css';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [donations, setDonations] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
  });

  useEffect(() => {
    fetchStatistics();
    fetchDonations();
  }, [filters]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/admin/statistics');
      const data = await response.json();
      if (data.success) {
        setStatistics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        page: filters.page,
      });
      const response = await fetch(`/api/admin/donations?${queryParams}`);
      const data = await response.json();
      if (data.success) {
        setDonations(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      success: 'status-success',
      pending: 'status-pending',
      failed: 'status-failed',
      refunded: 'status-refunded',
    };
    return statusColors[status] || '';
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.name}</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {statistics && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Donations</div>
              <div className="stat-value">{formatCurrency(statistics.total_donations)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Donors</div>
              <div className="stat-value">{statistics.total_donors}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Successful</div>
              <div className="stat-value">{statistics.successful_donations}</div>
            </div>
          </div>
        )}

        <div className="donations-section">
          <div className="section-header">
            <h2>All Donations</h2>
            <div className="filters">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">Loading donations...</div>
          ) : donations.data && donations.data.length > 0 ? (
            <>
              <div className="table-container">
                <table className="donations-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Donor Name</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Purpose</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Payment ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.data.map((donation) => (
                      <tr key={donation.id}>
                        <td>#{donation.id}</td>
                        <td>{donation.donor.name}</td>
                        <td>{donation.donor.email}</td>
                        <td className="amount-cell">{formatCurrency(donation.amount)}</td>
                        <td>{donation.purpose || 'General'}</td>
                        <td>
                          <span className={`status-badge ${getStatusBadge(donation.status)}`}>
                            {donation.status}
                          </span>
                        </td>
                        <td>{formatDate(donation.created_at)}</td>
                        <td>
                          {donation.razorpay_payment_id || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {donations.last_page > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handleFilterChange('page', filters.page - 1)}
                    disabled={filters.page === 1}
                    className="pagination-button"
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {donations.current_page} of {donations.last_page}
                  </span>
                  <button
                    onClick={() => handleFilterChange('page', filters.page + 1)}
                    disabled={filters.page === donations.last_page}
                    className="pagination-button"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-donations">
              <div className="no-donations-icon">📋</div>
              <p>No donations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
