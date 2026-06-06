'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { FileText, Search, Download, Filter, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useMockData } from '@/lib/mock-context';
import { CLASSIFICATION_LABELS } from '@/lib/constants';
import type { Classification } from '@/lib/constants';
import Link from 'next/link';

const PAGE_SIZE = 10;

export default function BlotterPage() {
  const { getConfirmedIncidents } = useMockData();
  const confirmed = getConfirmedIncidents();

  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [vendorFilter, setVendorFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return confirmed.filter(inc => {
      if (search) {
        const q = search.toLowerCase();
        const matches = (inc.description?.toLowerCase().includes(q)) ||
          (inc.systemAffected?.toLowerCase().includes(q)) ||
          (inc.vendorName?.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (classFilter !== 'all' && inc.classification !== classFilter) return false;
      if (vendorFilter && !inc.isVendorBreach) return false;
      return true;
    });
  }, [confirmed, search, classFilter, vendorFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleExport = () => {
    // Generate CSV as a simple export option
    const headers = ['Date', 'System', 'Classification', 'Source', 'Vendor', 'Customer Data', 'Description'];
    const rows = filtered.map(inc => [
      inc.date,
      inc.systemAffected || '',
      inc.classification ? CLASSIFICATION_LABELS[inc.classification as Classification] : '',
      inc.source,
      inc.vendorName || '',
      inc.customerDataExposed ? 'Yes' : 'No',
      `"${inc.description.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blotter-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <h1 className="page-title">Incident Blotter</h1>
          <p className="page-subtitle">
            {confirmed.length} confirmed incident{confirmed.length !== 1 ? 's' : ''} on record
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleExport}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* ─── Filters ─────────────────────────────── */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            className="input-field"
            placeholder="Search incidents..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <select
          className="input-field"
          value={classFilter}
          onChange={e => { setClassFilter(e.target.value); setCurrentPage(1); }}
          style={{ width: 'auto', minWidth: 180 }}
        >
          <option value="all">All Classifications</option>
          <option value="no_action">No Action Required</option>
          <option value="minor">Minor Incident</option>
          <option value="reportable">Reportable</option>
        </select>
        <button
          className={`btn ${vendorFilter ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => { setVendorFilter(!vendorFilter); setCurrentPage(1); }}
        >
          <Filter size={14} />
          Vendor Breaches
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card card-glass empty-state">
          <div className="empty-state-icon">
            <Shield size={28} />
          </div>
          <h3>
            {confirmed.length === 0 ? 'Your blotter is clean' : 'No matching incidents'}
          </h3>
          <p>
            {confirmed.length === 0
              ? 'When you log incidents, they\'ll appear here. Forward a security email or log one manually.'
              : 'Try adjusting your search or filters.'}
          </p>
          {confirmed.length === 0 && (
            <Link href="/log" className="btn btn-primary">Log an Incident</Link>
          )}
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>System</th>
                  <th>Classification</th>
                  <th>Source</th>
                  <th>Vendor</th>
                  <th>Customer Data</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(inc => (
                  <tr key={inc.id}>
                    <td style={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                      {format(new Date(inc.date), 'MMM d, yyyy')}
                    </td>
                    <td>{inc.systemAffected || '—'}</td>
                    <td>
                      {inc.classification && (
                        <span className={`badge ${
                          inc.classification === 'reportable' ? 'badge-danger' :
                          inc.classification === 'minor' ? 'badge-warning' : 'badge-success'
                        }`}>
                          {CLASSIFICATION_LABELS[inc.classification as Classification]}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                        {inc.source}
                      </span>
                    </td>
                    <td>{inc.vendorName || '—'}</td>
                    <td>
                      {inc.customerDataExposed ? (
                        <span className="badge badge-danger">Yes</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>No</span>
                      )}
                    </td>
                    <td style={{
                      maxWidth: 300,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {inc.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
