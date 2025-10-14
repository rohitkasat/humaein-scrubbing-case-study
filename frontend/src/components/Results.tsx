import React from 'react'

export default function Results({ results }:{ results:any[] | null }) {
  if (!results) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '48px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{fontSize: '3rem', marginBottom: '16px'}}>📋</div>
        <h3 style={{color: '#64748b', margin: '0 0 8px 0'}}>No Data Yet</h3>
        <p style={{color: '#94a3b8', margin: 0}}>Upload a claims file to see validation results</p>
      </div>
    )
  }
  
  if (results.length === 0) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '48px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{fontSize: '3rem', marginBottom: '16px'}}>✅</div>
        <h3 style={{color: '#10b981', margin: '0 0 8px 0'}}>All Clean!</h3>
        <p style={{color: '#64748b', margin: 0}}>No validation results to display</p>
      </div>
    )
  }
  
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: isCollapsed ? '0' : '24px',
        cursor: 'pointer'
      }} onClick={() => setIsCollapsed(!isCollapsed)}>
        <div style={{fontSize: '1.5rem', marginRight: '12px'}}>📊</div>
        <h2 style={{
          fontSize: '1.4rem',
          fontWeight: '600',
          color: '#1e293b',
          margin: 0
        }}>Validation Results</h2>
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            background: results.some(r => r.errors?.length > 0) ? '#fef2f2' : '#f0fdf4',
            color: results.some(r => r.errors?.length > 0) ? '#dc2626' : '#16a34a',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            {results.filter(r => r.errors?.length > 0).length} errors found
          </div>
          <div style={{
            fontSize: '1.2rem',
            color: '#64748b',
            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}>▼</div>
        </div>
      </div>
      
      {!isCollapsed && (
        <div style={{
          overflowX: 'auto',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
        <table style={{
          borderCollapse: 'collapse',
          width: '100%',
          fontSize: '0.9rem'
        }}>
          <thead>
            <tr style={{background: '#f8fafc'}}>
              <th style={{
                padding: '16px 12px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '2px solid #e2e8f0'
              }}>Unique ID</th>
              <th style={{
                padding: '16px 12px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '2px solid #e2e8f0'
              }}>Status</th>
              <th style={{
                padding: '16px 12px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '2px solid #e2e8f0'
              }}>Issues</th>
              <th style={{
                padding: '16px 12px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '2px solid #e2e8f0'
              }}>Details</th>
              <th style={{
                padding: '16px 12px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '2px solid #e2e8f0'
              }}>Error Explanation</th>
              <th style={{
                padding: '16px 12px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '2px solid #e2e8f0'
              }}>Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx} style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{padding: '16px 12px', fontWeight: '500', color: '#1e293b'}}>
                  {r.unique_id}
                </td>
                <td style={{padding: '16px 12px'}}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    background: (r.errors || []).length > 0 ? '#fef2f2' : '#f0fdf4',
                    color: (r.errors || []).length > 0 ? '#dc2626' : '#16a34a'
                  }}>
                    {(r.errors || []).length > 0 ? '❌ Failed' : '✅ Passed'}
                  </span>
                </td>
                <td style={{padding: '16px 12px'}}>
                  <div>
                    {(r.errors || []).map((e:any,i:number)=> (
                      <div key={i} style={{
                        background: '#fef2f2',
                        color: '#dc2626',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        marginBottom: '4px',
                        border: '1px solid #fecaca'
                      }}>
                        🚨 [{e.rule}] {e.msg}
                      </div>
                    ))}
                    {(r.warnings || []).map((e:any,i:number)=> (
                      <div key={i} style={{
                        background: '#fffbeb',
                        color: '#d97706',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        marginBottom: '4px',
                        border: '1px solid #fed7aa'
                      }}>
                        ⚠️ [{e.rule}] {e.msg}
                      </div>
                    ))}
                    {!(r.errors || []).length && !(r.warnings || []).length && (
                      <span style={{color: '#10b981', fontSize: '0.8rem'}}>No issues detected</span>
                    )}
                  </div>
                </td>
                <td style={{padding: '16px 12px', fontSize: '0.8rem', color: '#64748b'}}>
                  {r.explain || 'All validations passed'}
                </td>
                <td style={{padding: '16px 12px', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'pre-line'}}>
                  {r.error_explanation || '-'}
                </td>
                <td style={{padding: '16px 12px', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'pre-line'}}>
                  {r.recommended_action || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  )
}
