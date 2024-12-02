const wrapper = document.querySelector('.wrapper');
const forms = {
    login: wrapper.querySelector('.form-box.login'),
    register: wrapper.querySelector('.form-box.register'),
    timer: wrapper.querySelector('.form-box.timer'),
    medication: wrapper.querySelector('.form-box.medication'),
    history: wrapper.querySelector('.form-box.history'),
    sinput: wrapper.querySelector('.form-box.sinput')
};

const links = {
    login: document.querySelector('.btnLogin-popup'),
    register: document.querySelector('.register-link'),
    timer: document.querySelector('.navigation a[href="#timer"]'),
    medication: document.querySelector('.navigation a[href="#medication-reminder"]'),
    history: document.querySelector('.navigation a[href="#medication-history"]'),
    sinput: document.querySelector('.navigation a[href="#sinput"]')
};

// Function to toggle forms
function toggleForm(activeForm) {
    wrapper.classList.add('active-popup');
    Object.keys(forms).forEach((form) => {
        if (form === activeForm) {
            wrapper.classList.add(`active-${form}`);
            forms[form].style.display = 'block';
        } else {
            wrapper.classList.remove(`active-${form}`);
            forms[form].style.display = 'none';
        }
    });
}

// Event listeners for links
links.login.addEventListener('click', () => toggleForm('login'));
links.register.addEventListener('click', () => toggleForm('register'));
links.timer.addEventListener('click', (e) => { e.preventDefault(); toggleForm('timer'); });
links.medication.addEventListener('click', (e) => { e.preventDefault(); toggleForm('medication'); });
links.history.addEventListener('click', (e) => { e.preventDefault(); toggleForm('history'); });
links.sinput.addEventListener('click', (e) => { e.preventDefault(); toggleForm('sinput'); });

// Close button for all popups
document.querySelector('.icon-close').addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
    Object.keys(forms).forEach((form) => wrapper.classList.remove(`active-${form}`));
});

// Notification popup toggle
document.querySelector('.notification-btn').addEventListener('click', () => {
    document.querySelector('.notification-popup').style.display = 'block';
});
document.querySelector('.close-popup').addEventListener('click', () => {
    document.querySelector('.notification-popup').style.display = 'none';
});

// Contact popup toggle
document.addEventListener("DOMContentLoaded", () => {
    const contactPopup = document.querySelector(".contact-popup");
    document.querySelector("#contact-link").addEventListener("click", (e) => {
        e.preventDefault();
        contactPopup.style.display = "block";
    });
    document.querySelector(".close-contact-popup").addEventListener("click", () => {
        contactPopup.style.display = "none";
    });
});

// Countdown timer 
let countdown;

function startTimer() {
    clearInterval(countdown);

    let hours = 0;
    const inputHours = parseInt(document.querySelector('#inputNumberOfHours').value);
    if (!isNaN(inputHours)) {
        hours = inputHours;
    }

    let minutes = 0;
    const inputMinutes = parseInt(document.querySelector('#inputNumberOfMinutes').value);
    if (!isNaN(inputMinutes)) {
        minutes = inputMinutes;
    }
    
    let seconds = 0;
    const inputSeconds = parseInt(document.querySelector('#inputNumberOfSeconds').value);
    if (!isNaN(inputSeconds)) {
        seconds = inputSeconds;
    }

    let timeRemaining = hours * 3600 + minutes * 60 + seconds;
   
    // Start the countdown
    countdown = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(countdown);
            alert("Time's Up!"); 
            return;
        }
        
        const hoursRemaining = Math.floor(timeRemaining / 3600);
        const minutesRemaining = Math.floor((timeRemaining % 3600) / 60);
        const secondsRemaining = timeRemaining % 60;

        document.querySelector('.Hours').textContent = hoursRemaining.toString().padStart(2,'0');
        document.querySelector('.Minutes').textContent = minutesRemaining.toString().padStart(2,'0');
        document.querySelector('.Seconds').textContent = secondsRemaining.toString().padStart(2,'0');

        timeRemaining--;

    }, 1000); // Update every 1000 ms (1 second)

}