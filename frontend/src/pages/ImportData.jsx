import { useState } from 'react'
import { importExcel, uploadRoutingPdf } from '../services/api'

const styles = {
  section: {
    background: '#fff', border: '0.5px solid #e8e8e8',
    borderRadius: '12px', padding: '24px', marginBottom: '16px',
  },
  sectionTitle: {
    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px',
  },
  sectionIcon: { fontSize: '18px', color: '#1a7a4a' },
  sectionLabel: { fontSize: '14px', fontWeight: '500', color: '#111' },
  sectionDesc: { fontSize: '12px', color: '#9ca3af', marginBottom: '12px' },
  uploadBtn: (loading) => ({
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '8px 16px', borderRadius: '8px',
    background: loading ? '#f0f0f0' : '#1a7a4a',
    color: '#fff', fontSize: '13px', cursor: loading ? 'not-allowed' : 'pointer',
  }),
  successBox: {
    marginTop: '16px', background: '#e8f5ee', borderRadius: '8px', padding: '14px 16px',
  },
  errorBox: {
    marginTop: '16px', background: '#fdecea', borderRadius: '8px', padding: '12px 16px',
    fontSize: '13px', color: '#c0392b',
  },
  spinner: { marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1a7a4a' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginTop: '12px' },
  infoCard: { background: '#f9fafb', borderRadius: '8px', padding: '10px 12px' },
  infoLabel: { fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' },
  infoValue: { fontSize: '13px', fontWeight: '500', color: '#111' },
  opRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
    transition: 'all 0.15s',
  },
  badge: (type) => ({
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '2px 10px', borderRadius: '12px',
    background: type === 'instruction' ? 'rgba(2,188,148,0.08)' : 'rgba(244,162,97,0.08)',
    color: type === 'instruction' ? '#018374' : '#7a5a00',
    fontSize: '11px', fontWeight: '500',
  }),
}

const ImportData = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // State untuk PDF
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfResult, setPdfResult] = useState(null)
  const [pdfError, setPdfError] = useState('')
  const [expandedOps, setExpandedOps] = useState({})

  // State untuk JSON
  const [jsonLoading, setJsonLoading] = useState(false)
  const [jsonResult, setJsonResult]   = useState(null)
  const [jsonError, setJsonError]     = useState('')

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
    setExpandedOps({})
    try {
      const data = await uploadRoutingPdf(file)
      setPdfResult(data)
    } catch (err) {
      setPdfError('Gagal upload PDF.')
      console.error(err)
    } finally {
      setPdfLoading(false)
      e.target.value = ''
    }
  }

  const handleJsonUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setJsonLoading(true)
    setJsonResult(null)
    setJsonError('')
    try {
      const text = await file.text()
      const json = JSON.parse(text)
      
      // Validasi basic JSON structure
      if (!json.jobNo) {
        throw new Error('JSON harus memiliki field "jobNo"')
      }
      if (!json.operations || !Array.isArray(json.operations)) {
        throw new Error('JSON harus memiliki field "operations" sebagai array')
      }
      
      const res = await fetch('http://localhost:5062/api/routing/import-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal import JSON')
      setJsonResult(data)
    } catch (err) {
      setJsonError('Gagal import JSON: ' + err.message)
      console.error(err)
    } finally {
      setJsonLoading(false)
      e.target.value = ''
    }
  const toggleOp = (opNo) => {
    setExpandedOps(prev => ({ ...prev, [opNo]: !prev[opNo] }))
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

      {/* Upload PDF */}
      <div style={{
        background: '#fff', border: '0.5px solid #e8e8e8',
        borderRadius: '12px', padding: '24px', marginBottom: '16px',
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
          <div style={{ marginTop: '16px' }}>
            {/* Success Banner */}
            <div style={{ background: '#e8f5ee', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a7a4a', marginBottom: '6px' }}>✅ PDF Berhasil!</div>
              <div style={{ fontSize: '12px', color: '#1a7a4a' }}>{pdfResult.message}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Job No: <strong>{pdfResult.jobNo}</strong> · {pdfResult.totalOperations} operations
              </div>
            </div>

            {/* Header Info */}
            <div style={styles.infoGrid}>
              {[
                { label: 'Job No', value: pdfResult.jobNo },
                { label: 'Description', value: pdfResult.itemDescription || '-' },
                { label: 'Quantity', value: pdfResult.quantity || '-' },
                { label: 'Serial No', value: pdfResult.serialNo || '-' },
                { label: 'Sales Order', value: pdfResult.salesOrder || '-' },
                { label: 'Assembly', value: pdfResult.barcodeAssembly || '-' },
                { label: 'Total Operations', value: pdfResult.totalOperations },
                { label: 'Total Work Instructions', value: pdfResult.operations?.reduce((sum, op) => sum + (op.workInstructions?.length || 0), 0) },
              ].map((item, i) => (
                <div key={i} style={styles.infoCard}>
                  <div style={styles.infoLabel}>{item.label}</div>
                  <div style={styles.infoValue}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Operations List */}
            <div style={{ marginTop: '16px', borderTop: '0.5px solid #e8e8e8', paddingTop: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '12px' }}>
                Operations Detail
                <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '400', marginLeft: '8px' }}>
                  (klik untuk expand / collapse)
                </span>
              </div>

              {pdfResult.operations?.map((op, idx) => {
                const isExpanded = expandedOps[op.operationNo]
                const instCount = op.workInstructions?.length || 0
                const matCount = op.materials?.length || 0

                return (
                  <div key={idx} style={{ marginBottom: '8px' }}>
                    {/* Operation Row (clickable) */}
                    <div
                      onClick={() => toggleOp(op.operationNo)}
                      style={{
                        ...styles.opRow,
                        background: isExpanded ? 'rgba(2,188,148,0.04)' : '#f9fafb',
                        border: `0.5px solid ${isExpanded ? 'rgba(2,188,148,0.2)' : '#e8e8e8'}`,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(2,188,148,0.06)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = isExpanded ? 'rgba(2,188,148,0.04)' : '#f9fafb' }}
                    >
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '6px',
                        background: '#1a7a4a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '11px', fontWeight: '600', flexShrink: 0,
                      }}>
                        {op.operationNo}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '500', color: '#111' }}>
                          {op.operationDescription || '-'}
                        </div>
                        {(op.department || op.machine) && (
                          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                            {op.department && <span>Dept: {op.department}</span>}
                            {op.department && op.machine && <span> · </span>}
                            {op.machine && <span>Machine: {op.machine}</span>}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        {instCount > 0 && (
                          <span style={styles.badge('instruction')}>
                            <i className="ti ti-clipboard-text" style={{ fontSize: '12px' }} aria-hidden="true" />
                            {instCount}
                          </span>
                        )}
                        {matCount > 0 && (
                          <span style={styles.badge('material')}>
                            <i className="ti ti-package" style={{ fontSize: '12px' }} aria-hidden="true" />
                            {matCount}
                          </span>
                        )}
                        <span style={{ color: '#9ca3af', fontSize: '12px', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                          <i className="ti ti-chevron-down" aria-hidden="true" />
                        </span>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div style={{
                        background: '#fff', border: '0.5px solid rgba(2,188,148,0.15)',
                        borderTop: 'none', borderRadius: '0 0 8px 8px',
                        padding: '14px 16px 16px 54px', marginTop: '-2px',
                      }}>
                        {/* Work Instructions */}
                        {instCount > 0 && (
                          <div style={{ marginBottom: matCount > 0 ? '14px' : 0 }}>
                            <div style={{ fontSize: '11px', fontWeight: '500', color: '#018374', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <i className="ti ti-clipboard-text" aria-hidden="true" />
                              Work Instructions ({instCount})
                            </div>
                            <div style={{ background: 'rgba(2,188,148,0.03)', borderRadius: '6px', padding: '8px 12px' }}>
                              {op.workInstructions.map((inst, j) => (
                                <div key={j} style={{
                                  fontSize: '12px', color: '#374151', lineHeight: '1.6',
                                  padding: '4px 0',
                                  borderBottom: j < instCount - 1 ? '0.5px solid rgba(2,188,148,0.08)' : 'none',
                                }}>
                                  {inst}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Materials */}
                        {matCount > 0 && (
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: '500', color: '#7a5a00', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <i className="ti ti-package" aria-hidden="true" />
                              Materials ({matCount})
                            </div>
                            <div style={{ background: 'rgba(244,162,97,0.03)', borderRadius: '6px', padding: '8px 12px' }}>
                              {op.materials.map((mat, j) => (
                                <div key={j} style={{
                                  fontSize: '12px', color: '#374151', lineHeight: '1.6',
                                  padding: '4px 0',
                                  borderBottom: j < matCount - 1 ? '0.5px solid rgba(244,162,97,0.08)' : 'none',
                                }}>
                                  {mat}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {instCount === 0 && matCount === 0 && (
                          <div style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', padding: '8px' }}>
                            Tidak ada work instructions atau materials untuk operation ini.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {pdfError && (
          <div style={{ marginTop: '12px', background: '#fdecea', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#c0392b' }}>
            ❌ {pdfError}
          </div>
        )}
      </div>

      {/* Upload JSON Routing */}
      <div style={{
        background: '#fff', border: '0.5px solid #e8e8e8',
        borderRadius: '12px', padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <i className="ti ti-file-type-js" style={{ fontSize: '18px', color: '#1a7a4a' }} aria-hidden="true" />
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>Routing JSON</div>
          <span style={{ fontSize: '11px', padding: '2px 8px', background: '#e8f5ee', borderRadius: '20px', color: '#1a7a4a' }}>
            From your parser
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
          Upload hasil parser kamu (.json) — format: job_no, operations, steps
        </div>

        <label style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', borderRadius: '8px',
          background: jsonLoading ? '#f0f0f0' : '#1a7a4a',
          color: '#fff', fontSize: '13px', cursor: jsonLoading ? 'not-allowed' : 'pointer',
        }}>
          <i className="ti ti-upload" style={{ fontSize: '15px' }} aria-hidden="true" />
          {jsonLoading ? 'Memproses...' : 'Pilih File JSON'}
          <input
            type="file" accept=".json"
            onChange={handleJsonUpload}
            disabled={jsonLoading}
            style={{ display: 'none' }}
          />
        </label>

        {jsonLoading && (
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1a7a4a' }}>
            <span className="spinner-border spinner-border-sm" />
            Menyimpan routing ke database...
          </div>
        )}

        {jsonResult && (
          <div style={{ marginTop: '16px', background: '#e8f5ee', borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a7a4a', marginBottom: '6px' }}>✅ Import JSON Berhasil!</div>
            <div style={{ fontSize: '12px', color: '#1a7a4a' }}>{jsonResult.message}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Job No: <strong>{jsonResult.jobNo}</strong> · {jsonResult.operations} operations
            </div>
          </div>
        )}

        {jsonError && (
          <div style={{ marginTop: '12px', background: '#fdecea', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#c0392b' }}>
            ❌ {jsonError}
          </div>
        )}

        {/* Contoh Format JSON */}
        <div style={{ marginTop: '16px', background: '#f7f8fa', borderRadius: '8px', padding: '12px', fontSize: '11px', color: '#6b7280' }}>
          <div style={{ fontWeight: '500', marginBottom: '4px' }}>📄 Contoh format JSON:</div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`{
  "jobNo": "WO-12345",
  "operations": [
    {
      "operationNo": "10",
      "steps": [
        { "stepNo": "10", "text": "Clean surface", "inspectRole": "Operator" }
      ]
    }
  ]
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default ImportData