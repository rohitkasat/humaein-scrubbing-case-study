import React from 'react'
import { api } from '../lib/api'

export default function Waterfall({ refreshTrigger }: { refreshTrigger?: number }) {
  const [waterfallData, setWaterfallData] = React.useState<any[]>([])

  const loadWaterfall = () => {
    api.get('/api/v1/metrics').then(res => {
      setWaterfallData(res.data.waterfall || [])
    }).catch(console.error)
  }

  React.useEffect(() => {
    loadWaterfall()
  }, [refreshTrigger])

  const maxCount = Math.max(...waterfallData.map(w => w.count), 1)
  const maxAmount = Math.max(...waterfallData.map(w => w.paid_amount_aed), 1)

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
        cursor: 'pointer'
      }} onClick={() => setIsCollapsed(!isCollapsed)}>
        <div style={{fontSize: '1.2rem', marginRight: '8px'}}>📊</div>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#1e293b',
          margin: 0
        }}>Waterfall Charts</h3>
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
          {/* Chart 1: Claim counts by error category */}
          <div style={{marginBottom: '32px'}}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{marginRight: '8px'}}>📊</span>
              Claims Count by Error Category
            </h4>
            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0'
            }}>
              {waterfallData.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.9rem',
                  padding: '20px'
                }}>
                  No data available
                </div>
              ) : (
                waterfallData.map((item, idx) => {
                  const background =
                    item.category === 'none'
                      ? '#bbf7d0'
                      : item.category === 'technical'
                      ? '#fef08a'
                      : item.category === 'medical'
                      ? '#bae6fd'
                      : '#fecaca'
                  return (
                    <div key={idx} style={{marginBottom: '16px'}}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: '#374151',
                          textTransform: 'capitalize'
                        }}>
                          {item.category === 'none' ? '✅ No Issues' : 
                           item.category === 'technical' ? '⚙️ Technical' :
                           item.category === 'medical' ? '🏥 Medical' : '⚠️ Both'}
                        </span>
                        <span style={{
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: '#1e293b'
                        }}>
                          {item.count.toLocaleString()}
                        </span>
                      </div>
                      <div style={{
                        background: '#e2e8f0',
                        borderRadius: '8px',
                        height: '12px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          background: background,
                          height: '100%',
                          width: `${(item.count / maxCount) * 100}%`,
                          minWidth: '8px',
                          borderRadius: '8px',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
          {/* Chart 2: Paid amounts by error category */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{marginRight: '8px'}}>🪙</span>
              Paid Amount by Error Category
            </h4>
            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0'
            }}>
              {waterfallData.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.9rem',
                  padding: '20px'
                }}>
                  No data available
                </div>
              ) : (
                waterfallData.map((item, idx) => {
                  const background =
                    item.category === 'none'
                      ? '#bbf7d0'
                      : item.category === 'technical'
                      ? '#fef08a'
                      : item.category === 'medical'
                      ? '#bae6fd'
                      : '#fecaca'
                  return (
                    <div key={idx} style={{marginBottom: '16px'}}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: '#374151',
                          textTransform: 'capitalize'
                        }}>
                          {item.category === 'none' ? '✅ No Issues' : 
                           item.category === 'technical' ? '⚙️ Technical' :
                           item.category === 'medical' ? '🏥 Medical' : '⚠️ Both'}
                        </span>
                        <span style={{
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: '#1e293b'
                        }}>
                          {item.paid_amount_aed.toLocaleString()} AED
                        </span>
                      </div>
                      <div style={{
                        background: '#e2e8f0',
                        borderRadius: '8px',
                        height: '12px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          background: background,
                          height: '100%',
                          width: `${(item.paid_amount_aed / maxAmount) * 100}%`,
                          minWidth: '8px',
                          borderRadius: '8px',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
