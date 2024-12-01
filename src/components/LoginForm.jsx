import { useState } from 'react'
import '../App.css'

function LoginForm({ onRegisterClick }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add login logic here
    console.log('Login attempt:', { email, password, rememberMe })
  }

  return (
    <div className="form-box login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <span className="icon"></span>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Email</label>
        </div>
        <div className="input-box">
          <span className="icon"></span>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Password</label>
        </div>
        <div className="remember-forgot">
          <label>
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            /> Remember me
          </label>
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit">Login</button>
        <div className="login-register">
          <p>
            Don't have an account? 
            <a href="#" onClick={(e) => {
              e.preventDefault()
              onRegisterClick()
            }}>Register</a>
          </p>
        </div>
      </form>
    </div>
  )
}

export default LoginForm