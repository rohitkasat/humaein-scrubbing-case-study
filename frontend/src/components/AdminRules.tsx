import React from 'react'
import { api } from '../lib/api'

export default function AdminRules() {
  const [rules, setRules] = React.useState<any[]>([])
  
  React.useEffect(() => {
    api.get('/api/v1/rules').then(res => setRules(res.data.rules || []))
  }, [])
  
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
        marginBottom: isCollapsed ? '0' : '20px',
        cursor: 'pointer'
      }} onClick={() => setIsCollapsed(!isCollapsed)}>
        <div style={{fontSize: '1.2rem', marginRight: '8px'}}>📜</div>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#1e293b',
          margin: 0
        }}>Active Rules</h3>
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            background: '#f0fdf4',
            color: '#16a34a',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            {rules.length} rules
          </div>
          <div style={{
            fontSize: '1rem',
            color: '#64748b',
            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}>▼</div>
        </div>
      </div>
      
      {!isCollapsed && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
        {rules.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.9rem',
            padding: '32px 16px'
          }}>
            No rules loaded
          </div>
        ) : (
          rules.map((r:any) => {
            const categoryColors = {
              'technical': { bg: '#fef2f2', color: '#dc2626', icon: '⚙️' },
              'medical': { bg: '#f0fdf4', color: '#16a34a', icon: '🏥' }
            }
            const style = categoryColors[r.category as keyof typeof categoryColors] || 
                         { bg: '#f8fafc', color: '#64748b', icon: '📜' }
            
            return (
              <div key={r.code} style={{
                background: style.bg,
                border: `1px solid ${style.color}20`,
                borderRadius: '12px',
                padding: '16px',
                transition: 'all 0.2s'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{fontSize: '1rem', marginRight: '8px'}}>
                    {style.icon}
                  </span>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    {r.code}
                  </span>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    color: style.color,
                    textTransform: 'capitalize',
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '2px 8px',
                    borderRadius: '8px'
                  }}>
                    {r.category}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#4b5563',
                  lineHeight: '1.4'
                }}>
                  {r.name}
                </div>
              </div>
            )
          })
        )}
        </div>
      )}
    </div>
  )
}
