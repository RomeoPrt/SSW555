import { useState, useEffect } from 'react'
import '../App.css'

function Timer() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [isRunning, setIsRunning] = useState(false)
  const [inputTime, setInputTime] = useState({ hours: '', minutes: '', seconds: '' })

  useEffect(() => {
    let interval
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const totalSeconds = prevTime.hours * 3600 + prevTime.minutes * 60 + prevTime.seconds - 1
          
          if (totalSeconds <= 0) {
            clearInterval(interval)
            setIsRunning(false)
            alert("Time's Up!")
            return { hours: 0, minutes: 0, seconds: 0 }
          }

          return {
            hours: Math.floor(totalSeconds / 3600),
            minutes: Math.floor((totalSeconds % 3600) / 60),
            seconds: totalSeconds % 60
          }
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning])

  const startTimer = () => {
    const hours = parseInt(inputTime.hours) || 0
    const minutes = parseInt(inputTime.minutes) || 0
    const seconds = parseInt(inputTime.seconds) || 0

    if (hours + minutes + seconds > 0) {
      setTime({ hours, minutes, seconds })
      setIsRunning(true)
    }
  }

  return (
    <div className="form-box timer">
      <h2>Timer</h2>
      <div id="countdown_timer">
        <div>
          <span className="Hours">
            {String(time.hours).padStart(2, '0')}
          </span>
          <div className="Title">Hours</div>
        </div>
        <div>
          <span className="Minutes">
            {String(time.minutes).padStart(2, '0')}
          </span>
          <div className="Title">Minutes</div>
        </div>
        <div>
          <span className="Seconds">
            {String(time.seconds).padStart(2, '0')}
          </span>
          <div className="Title">Seconds</div>
        </div>
      </div>
      <div className="input-box">
        <input
          type="number"
          value={inputTime.hours}
          onChange={(e) => setInputTime(prev => ({ ...prev, hours: e.target.value }))}
          placeholder="Hours"
          min="0"
        />
      </div>
      <div className="input-box">
        <input
          type="number"
          value={inputTime.minutes}
          onChange={(e) => setInputTime(prev => ({ ...prev, minutes: e.target.value }))}
          placeholder="Minutes"
          min="0"
          max="59"
        />
      </div>
      <div className="input-box">
        <input
          type="number"
          value={inputTime.seconds}
          onChange={(e) => setInputTime(prev => ({ ...prev, seconds: e.target.value }))}
          placeholder="Seconds"
          min="0"
          max="59"
        />
      </div>
      <button onClick={startTimer} disabled={isRunning}>
        Start Timer
      </button>
    </div>
  )
}

export default Timer