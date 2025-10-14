import React from 'react'
import { api } from '../lib/api'

export default function Metrics({ refreshTrigger }: { refreshTrigger?: number }) {
  const [metrics, setMetrics] = React.useState<any[]>([])
  const [waterfall, setWaterfall] = React.useState<any[]>([])
  
  const loadMetrics = () => {
    api.get('/api/v1/metrics').then(res => {
      setMetrics(res.data.metrics || [])
      setWaterfall(res.data.waterfall || [])
    }).catch(console.error)
  }
  
  React.useEffect(() => {
    loadMetrics()
  }, [refreshTrigger])
  
  const totalClaims = metrics.find(m => m.key === 'claims_total')?.value || 0
  const errorRate = metrics.find(m => m.key === 'error_rate_pct')?.value || 0
  
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      height: isCollapsed ? undefined : '450px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'height 0.3s cubic-bezier(.4,2,.6,1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: isCollapsed ? '0' : '20px',
        cursor: 'pointer',
        minHeight: '32px'
      }} onClick={() => setIsCollapsed(!isCollapsed)}>
        <div style={{fontSize: '1.2rem', marginRight: '8px'}}>📈</div>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#1e293b',
          margin: 0
        }}>Metrics Overview</h3>
        <div style={{
          marginLeft: 'auto',
          fontSize: '1rem',
          color: '#64748b',
          transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          background: isCollapsed ? '#ffebee' : 'transparent',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>▼</div>
      </div>
      {!isCollapsed && (
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* ...existing code... */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{fontSize: '2rem', fontWeight: '700', marginBottom: '4px'}}>
                {totalClaims}
              </div>
              <div style={{fontSize: '0.9rem', opacity: '0.9'}}>Total Claims</div>
            </div>
            
            <div style={{
              background: errorRate > 10 ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
                         errorRate > 5 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 
                         'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{fontSize: '2rem', fontWeight: '700', marginBottom: '4px'}}>
                {errorRate.toFixed(1)}%
              </div>
              <div style={{fontSize: '0.9rem', opacity: '0.9'}}>Error Rate</div>
            </div>
          </div>
          
          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 16px 0'
            }}>Category Breakdown</h4>
            
            <div style={{overflowX: 'auto'}}>
              <table style={{
                borderCollapse: 'collapse',
                width: '100%',
                fontSize: '0.9rem'
              }}>
                <thead>
                  <tr>
                    <th style={{
                      padding: '12px 8px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e2e8f0'
                    }}>Category</th>
                    <th style={{
                      padding: '12px 8px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e2e8f0'
                    }}>Count</th>
                    <th style={{
                      padding: '12px 8px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e2e8f0'
                    }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {waterfall.map((w:any,i:number)=> {
                    const categoryColors = {
                      'technical': '#ef4444',
                      'medical': '#f59e0b',
                      'both': '#8b5cf6',
                      'none': '#10b981'
                    }
                    const color = categoryColors[w.category as keyof typeof categoryColors] || '#64748b'
                    
                    return (
                      <tr key={i} style={{borderBottom: '1px solid #f1f5f9'}}>
                        <td style={{padding: '12px 8px'}}>
                          <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: color,
                              marginRight: '8px'
                            }}></div>
                            <span style={{textTransform: 'capitalize', fontWeight: '500'}}>
                              {w.category}
                            </span>
                          </div>
                        </td>
                        <td style={{padding: '12px 8px', textAlign: 'right', fontWeight: '500'}}>
                          {w.count}
                        </td>
                        <td style={{padding: '12px 8px', textAlign: 'right', fontWeight: '500'}}>
                          {w.paid_amount_aed} AED
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
