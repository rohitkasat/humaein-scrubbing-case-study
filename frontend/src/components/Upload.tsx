import React from 'react'
import { api } from '../lib/api'

export default function Upload({ token, onValidated, onDataChange }:{ token:string, onValidated:(r:any[])=>void, onDataChange?:()=>void }) {
  const [file, setFile] = React.useState<File | null>(null)
  const [techRulesFile, setTechRulesFile] = React.useState<File | null>(null)
  const [medRulesFile, setMedRulesFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<any[] | null>(null)
  const [loading, setLoading] = React.useState(false)

  const upload = async () => {
    if (!file) return
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const up = await api.post('/api/v1/claims/upload', form)
      setPreview(up.data.preview)
      
      // Show success message with upload details
      if (up.data.message) {
        alert(up.data.message)
      }
      
      // If records were created or updated, validate them
      const ids = (up.data.preview || []).map((p:any) => p.id)
      if (ids.length > 0) {
        const val = await api.post('/api/v1/validate/run', ids)
        onValidated(val.data.results)
      } else {
        // If no records processed, clear results but show success
        onValidated([])
      }
      
      // Trigger metrics refresh
      if (onDataChange) {
        onDataChange()
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please check the file format and try again.')
    } finally {
      setLoading(false)
    }
  }

  const uploadRules = async (type: 'technical' | 'medical', file: File) => {
    const form = new FormData()
    form.append('file', file)
    form.append('type', type)
    try {
      await api.post('/api/v1/rules/upload', form)
      alert(`${type} rules uploaded successfully`)
    } catch (error) {
      console.error(`${type} rules upload failed:`, error)
      alert(`${type} rules upload failed. Please try again.`)
    }
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      marginBottom: '32px'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1e293b',
        margin: '0 0 24px 0',
        textAlign: 'center'
      }}>📁 File Upload Center</h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {/* Technical Rules Upload - STEP 1 */}
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderRadius: '12px',
          padding: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            fontSize: '4rem',
            opacity: '0.2'
          }}>⚙️</div>

          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>Technical Rules</h3>
          <p style={{
            margin: '0 0 20px 0',
            fontSize: '0.9rem',
            opacity: '0.9'
          }}>Upload PDF with technical validation rules</p>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <input 
              type='file' 
              accept='.pdf' 
              onChange={e=>setTechRulesFile(e.target.files?.[0] || null)}
              style={{
                width: '100%',
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}
            />
          </div>
          
          <button 
            onClick={() => techRulesFile && uploadRules('technical', techRulesFile)} 
            disabled={!techRulesFile}
            style={{
              background: !techRulesFile ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)',
              color: !techRulesFile ? 'rgba(255, 255, 255, 0.7)' : '#d97706',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: !techRulesFile ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'all 0.2s'
            }}
          >
            📤 Upload Technical Rules
          </button>
        </div>

        {/* Medical Rules Upload - STEP 2 */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '12px',
          padding: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            fontSize: '4rem',
            opacity: '0.2'
          }}>🏥</div>

          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>Medical Rules</h3>
          <p style={{
            margin: '0 0 20px 0',
            fontSize: '0.9rem',
            opacity: '0.9'
          }}>Upload PDF with medical validation rules</p>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <input 
              type='file' 
              accept='.pdf' 
              onChange={e=>setMedRulesFile(e.target.files?.[0] || null)}
              style={{
                width: '100%',
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}
            />
          </div>
          
          <button 
            onClick={() => medRulesFile && uploadRules('medical', medRulesFile)} 
            disabled={!medRulesFile}
            style={{
              background: !medRulesFile ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)',
              color: !medRulesFile ? 'rgba(255, 255, 255, 0.7)' : '#059669',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: !medRulesFile ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'all 0.2s'
            }}
          >
            📤 Upload Medical Rules
          </button>
        </div>

        {/* Claims File Upload - STEP 3 */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: '12px',
          padding: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            fontSize: '4rem',
            opacity: '0.2'
          }}>📊</div>

          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>Claims Data</h3>
          <p style={{
            margin: '0 0 20px 0',
            fontSize: '0.9rem',
            opacity: '0.9'
          }}>Upload Excel file with claims for validation</p>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <input 
              type='file' 
              accept='.xlsx' 
              onChange={e=>setFile(e.target.files?.[0] || null)}
              style={{
                width: '100%',
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}
            />
          </div>
          
          <button 
            onClick={upload} 
            disabled={!file || loading}
            style={{
              background: !file || loading ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)',
              color: !file || loading ? 'rgba(255, 255, 255, 0.7)' : '#1d4ed8',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: !file || loading ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'all 0.2s'
            }}
          >
            {loading ? '⏳ Processing...' : '📤 Upload & Validate'}
          </button>
          
          {/* {preview && (
            <div style={{
              marginTop: '12px',
              fontSize: '0.8rem',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '8px 12px',
              borderRadius: '6px'
            }}>
              ✅ Preview: {preview.length} rows ready
            </div>
          )} */}
        </div>
      </div>
      
      <div style={{
        textAlign: 'center',
        marginTop: '24px',
        padding: '16px',
        background: 'rgba(249, 115, 22, 0.1)',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#ea580c'
      }}>
        ⚡ <strong>Recommended Flow:</strong> Upload rule files first to define validation logic, then upload claims file for validation
      </div>
    </div>
  )
}
