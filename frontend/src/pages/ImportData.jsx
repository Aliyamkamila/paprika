import { useState } from 'react'
import { importExcel } from '../services/api'

const ImportData = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // State untuk PDF
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfResult, setPdfResult] = useState(null)
  const [pdfError, setPdfError] = useState('')

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const data = await importExcel(file)
      setResult(data)
    } catch (err) {
      setError('Gagal import file.')
      console.error(err)
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPdfLoading(true)
    setPdfResult(null)
    setPdfError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('http://localhost:5062/api/routing/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPdfResult(data)
    } catch (err) {
      setPdfError('Gagal upload PDF.')
      console.error(err)
    } finally {
      setPdfLoading(false)
      e.target.value = ''
    }
  }

  return (
    <div style={{ padding: '24px', background: '#f7f8fa', minHeight: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '18px', fontWeight: '500', color: '#111' }}>Import Data</div>
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Upload Excel untuk update data Work Order</div>
      </div>

      {/* Upload Excel */}
      <div style={{
        background: '#fff', border: '0.5px solid #e8e8e8',
        borderRadius: '12px', padding: '24px', marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <i className="ti ti-table" style={{ fontSize: '18px', color: '#1a7a4a' }} aria-hidden="true" />
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>Work Order Hour Report</div>
        </div>

        <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
          Upload file Excel (.xlsx) dari SharePoint — BHGE_Work_Order_Hour_Report.xlsx
        </div>

        <label style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', borderRadius: '8px',
          background: loading ? '#f0f0f0' : '#1a7a4a',
          color: '#fff', fontSize: '13px', cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          <i className="ti ti-upload" style={{ fontSize: '15px' }} aria-hidden="true" />
          {loading ? 'Memproses...' : 'Pilih File Excel'}
          <input
            type="file" accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={loading}
            style={{ display: 'none' }}
          />
        </label>

        {loading && (
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1a7a4a' }}>
            <span className="spinner-border spinner-border-sm" />
            Membaca dan menyimpan data ke database...
          </div>
        )}

        {result && (
          <div style={{ marginTop: '16px', background: '#e8f5ee', borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a7a4a', marginBottom: '8px' }}>
              ✅ Import Berhasil!
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
              {[
                { label: 'Total Rows', value: result.totalRows?.toLocaleString('en-US') },
                { label: 'Valid Rows', value: result.validRows?.toLocaleString('en-US') },
                { label: 'Invalid Rows', value: result.invalidRows?.toLocaleString('en-US') },
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: '500', color: '#111' }}>{item.value}</div>
                </div>
              ))}
            </div>
            {result.errors?.length > 0 && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#7a5a00' }}>
                ⚠️ {result.errors.length} baris gagal diproses
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ marginTop: '16px', background: '#fdecea', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#c0392b' }}>
            ❌ {error}
          </div>
        )}
      </div>

      {/* Upload PDF - Active (tanpa opacity dan coming soon) */}
      <div style={{
        background: '#fff', border: '0.5px solid #e8e8e8',
        borderRadius: '12px', padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <i className="ti ti-file-type-pdf" style={{ fontSize: '18px', color: '#1a7a4a' }} aria-hidden="true" />
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>Routing Sheet PDF</div>
        </div>
        <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
          Upload PDF routing sheet untuk mengisi work instructions per operation
        </div>

        <label style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', borderRadius: '8px',
          background: pdfLoading ? '#f0f0f0' : '#1a7a4a',
          color: '#fff', fontSize: '13px', cursor: pdfLoading ? 'not-allowed' : 'pointer',
        }}>
          <i className="ti ti-upload" style={{ fontSize: '15px' }} aria-hidden="true" />
          {pdfLoading ? 'Memproses...' : 'Pilih File PDF'}
          <input
            type="file" accept=".pdf"
            onChange={handlePdfUpload}
            disabled={pdfLoading}
            style={{ display: 'none' }}
          />
        </label>

        {pdfLoading && (
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1a7a4a' }}>
            <span className="spinner-border spinner-border-sm" />
            Membaca PDF dan menyimpan work instructions...
          </div>
        )}

        {pdfResult && (
          <div style={{ marginTop: '16px', background: '#e8f5ee', borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a7a4a', marginBottom: '6px' }}>✅ PDF Berhasil!</div>
            <div style={{ fontSize: '12px', color: '#1a7a4a' }}>{pdfResult.message}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Job No: <strong>{pdfResult.jobNo}</strong> · {pdfResult.operations} operations
            </div>
          </div>
        )}

        {pdfError && (
          <div style={{ marginTop: '12px', background: '#fdecea', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#c0392b' }}>
            ❌ {pdfError}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImportData