// src/pages/Lead.jsx
import React, { useEffect, useState } from 'react';
import MainLayout from '../components/Layout';
import Pagination from '../components/Pagination';
import styles from '../styles/Lead.module.css';
import API from '../utils/axios';
import Papa from 'papaparse';

const Lead = () => {
  const [leads, setLeads] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalType, setModalType] = useState(null); // 'upload' | 'manual'
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'receivedDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const leadsPerPage = 8;

  useEffect(() => {
    fetchLeads();
  }, [searchTerm, sortConfig, currentPage]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/leads', {
        params: {
          search: searchTerm,
          page: currentPage,
          limit: leadsPerPage,
          sortBy: sortConfig.key,
          order: sortConfig.direction,
        },
      });
      setLeads(res.data.leads || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyCSV = (file, callback) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const required = ["name", "email", "phone", "language", "location"];
        const invalidRows = results.data.filter(row =>
          required.some(field => !row[field]?.trim())
        );
        callback(invalidRows.length === 0, invalidRows.length);
      }
    });
  };

  const handleFileUpload = () => {
    if (!file) return;

    verifyCSV(file, async (isValid, count) => {
      if (!isValid) {
        alert(`${count} invalid rows found. Please fix the file and try again.`);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        setUploading(true);
        const res = await API.post('/api/leads/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
          },
        });

        alert(res.data.message || 'File uploaded successfully');
        resetUploadModal();
        fetchLeads();
      } catch (err) {
        console.error('Upload error:', err);
        alert('Upload failed. Please try again.');
        setUploading(false);
      }
    });
  };

  const resetUploadModal = () => {
    setUploading(false);
    setUploadProgress(0);
    setFile(null);
    setModalType(null);
  };

  const handleSort = (key) => {
    const direction = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const renderUploadModal = () => (
    <div className={styles.modalOverlay} onClick={resetUploadModal}>
      <form
        className={styles.modalForm}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          handleFileUpload();
        }}
      >
        <h3>Upload Lead CSV</h3>

        <div
          className={styles.dropzone}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setFile(e.dataTransfer.files[0]);
          }}
        >
          {file ? <p>{file.name}</p> : <p>Drag & drop or click to browse</p>}
          <input
            type="file"
            accept=".csv"
            hidden
            id="fileInput"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="fileInput" className={styles.browseButton}>Browse File</label>
        </div>

        {uploading && (
          <div className={styles.circularWrapper}>
            <svg className={styles.circularProgress} viewBox="0 0 36 36">
              <path className={styles.bg} d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path
                className={styles.progress}
                strokeDasharray={`${uploadProgress}, 100`}
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className={styles.percentage}>{uploadProgress}%</text>
            </svg>
          </div>
        )}

        <div className={styles.formActions}>
          <button type="submit" disabled={uploading || !file}>Upload</button>
          <button type="button" onClick={resetUploadModal} disabled={uploading}>Cancel</button>
        </div>
      </form>
    </div>
  );

  return (
    <MainLayout
      onSearch={(val) => {
        setSearchTerm(val);
        setCurrentPage(1);
      }}
      rightElement={
        <div className={styles.actionButtons}>
          <button className={styles.addManual} onClick={() => setModalType('manual')}>Add Manually</button>
          <button className={styles.addLeadButton} onClick={() => setModalType('upload')}>Upload CSV</button>
        </div>
      }
    >
      {modalType === 'upload' && renderUploadModal()}

      {loading ? (
        <p className={styles.loadingText}>Loading leads...</p>
      ) : (
        <>
          <table className={styles.leadTable}>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Name</th>
                <th onClick={() => handleSort('email')}>Email</th>
                <th onClick={() => handleSort('phone')}>Phone</th>
                <th onClick={() => handleSort('receivedDate')}>Received Date</th>
                <th onClick={() => handleSort('assignedEmployee')}>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No leads found.</td>
                </tr>
              ) : (
                leads.map((lead, index) => (
                  <tr key={lead._id || index}>
                    <td>{lead.name}</td>
                    <td>{lead.email || '-'}</td>
                    <td>{lead.phone || '-'}</td>
                    <td>{lead.receivedDate ? new Date(lead.receivedDate).toLocaleDateString() : '-'}</td>
                    <td>
                      {lead.assignedEmployee
                        ? `${lead.assignedEmployee.firstName} ${lead.assignedEmployee.lastName}`
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </MainLayout>
  );
};

export default Lead;
