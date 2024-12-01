import { useState } from 'react'
import Navbar from './components/Navbar'
import LoginForm from './components/LoginForm'
// import RegisterForm from './components/RegisterForm/RegisterForm'
// import MedicationHistory from './components/MedicationHistory/MedicationHistory'
// import SymptomInput from './components/SymptomInput/SymptomInput'
// import Timer from './components/Timer'
// import MedicationReminder from './components/MedicationReminder/MedicationReminder'
// import NotificationPopup from './components/NotificationPopup/NotificationPopup'
// import ContactPopup from './components/ContactPopup/ContactPopup'
import './App.css'

function App() {
  const [activeForm, setActiveForm] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [showContact, setShowContact] = useState(false)

  const toggleForm = (formName) => {
    setActiveForm(formName)
  }

  return (
    <div className="app">
      <Navbar onNavClick={toggleForm} onContactClick={() => setShowContact(true)} />
      
      <div className={`wrapper ${activeForm ? 'active-popup' : ''}`}>
        <button className="icon-close" onClick={() => setActiveForm(null)}>×</button>
        
        {/* {activeForm === 'login' && <LoginForm onRegisterClick={() => setActiveForm('register')} />}
        {activeForm === 'register' && <RegisterForm onLoginClick={() => setActiveForm('login')} />}
        {activeForm === 'history' && <MedicationHistory />}
        {activeForm === 'sinput' && <SymptomInput />}
        {activeForm === 'timer' && <Timer />}
        {activeForm === 'medication' && <MedicationReminder />} */}
      </div>

      {showNotification && (
        <NotificationPopup onClose={() => setShowNotification(false)} />
      )}
      
      {showContact && (
        <ContactPopup onClose={() => setShowContact(false)} />
      )}
    </div>
  )
}

export default App