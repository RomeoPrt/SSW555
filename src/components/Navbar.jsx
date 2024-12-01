import React from 'react'
import '../App.css'

function Navbar({ onNavClick, onContactClick }) {
  return (
    <nav className="navbar">
      <h1 className="logo">SpeakSmart</h1>
      <div className="navigation">
        <a href="#medication-history" onClick={(e) => {
          e.preventDefault()
          onNavClick('history')
        }}>Medication History</a>
        <a href="#sinput" onClick={(e) => {
          e.preventDefault()
          onNavClick('sinput')
        }}>Symptom Input</a>
        <a href="#timer" onClick={(e) => {
          e.preventDefault()
          onNavClick('timer')
        }}>Timer</a>
        <a href="#medication-reminder" onClick={(e) => {
          e.preventDefault()
          onNavClick('medication')
        }}>Medication Reminder</a>
        <a href="#" id="contact-link" onClick={(e) => {
          e.preventDefault()
          onContactClick()
        }}>Contact</a>
      </div>
      <button className="btnLogin-popup" onClick={() => onNavClick('login')}>
        Login
      </button>
    </nav>
  )
}

export default Navbar