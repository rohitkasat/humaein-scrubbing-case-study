import React from 'react'
import Login from './components/Login'
import Upload from './components/Upload'
import Results from './components/Results'
import Metrics from './components/Metrics'
import AdminRules from './components/AdminRules'
import Waterfall from './components/Waterfall'

export default function App() {
  const [token, setToken] = React.useState<string | null>(null)
  const [results, setResults] = React.useState<any[] | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState(0)
  
  const handleDataRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }
  
  const handleLogin = (newToken: string) => {
    setToken(newToken)
    setResults(null) // Clear previous results
    setRefreshTrigger(prev => prev + 1) // Refresh metrics to show empty state
  }
  
  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '0'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '20px 0',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>Humaein</h1>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '1.1rem',
          color: '#64748b',
          fontWeight: '500'
        }}>Mini RCM Validation Engine</p>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {!token ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh'
          }}>
            <Login onToken={handleLogin}/>
          </div>
        ) : (
          <>
            <Upload token={token} onValidated={setResults} onDataChange={handleDataRefresh}/>
            {/* Waterfall - Full Width */}
              <div style={{ width: '100%' }}>
                <Waterfall refreshTrigger={refreshTrigger}/>
              </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              marginTop: '32px',
              width: '100%'
            }}>
              {/* Validation Results - Full Width */}
              <div style={{ width: '100%' }}>
                <Results results={results}/>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
