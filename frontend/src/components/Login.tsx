import React from 'react'
import { api } from '../lib/api'

export default function Login({ onToken }:{ onToken:(t:string)=>void }) {
  const [email, setEmail] = React.useState('admin@humaein.local')
  const [password, setPassword] = React.useState('Admin@123')
  const [err, setErr] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  
  const submit = async (e:React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/api/v1/auth/login', { email, password })
      onToken(res.data.access_token)
    } catch (e:any) {
      setErr('Login failed')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      maxWidth: '400px',
      width: '100%'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 8px 0'
        }}>Welcome</h2>
        <p style={{
          color: '#64748b',
          margin: 0,
          fontSize: '1rem'
        }}>Sign in to access your RCM dashboard</p>
      </div>
      
      <form onSubmit={submit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>Email</label>
          <input 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            placeholder='Enter your email'
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.2s',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#667eea'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
        
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>Password</label>
          <input 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            type='password' 
            placeholder='Enter your password'
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.2s',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#667eea'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
        
        <button 
          type='submit' 
          disabled={loading}
          style={{
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            marginTop: '8px'
          }}
          onMouseEnter={e => !loading && ((e.target as HTMLButtonElement).style.transform = 'translateY(-2px)')}
          onMouseLeave={e => ((e.target as HTMLButtonElement).style.transform = 'translateY(0)')}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        
        {err && (
          <div style={{
            color: '#dc2626',
            fontSize: '0.9rem',
            textAlign: 'center',
            padding: '12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px'
          }}>
            {err}
          </div>
        )}
      </form>
    </div>
  )
}
