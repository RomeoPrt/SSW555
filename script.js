// Select necessary elements
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const timerLink = document.querySelector('.navigation a[href="#timer"]');
const medicationLink = document.querySelector('.navigation a[href="#medication-reminder"]');

// Show login popup
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup'); // Show wrapper
    wrapper.classList.add('active'); // Show login form
    wrapper.classList.remove('active-timer'); // Hide timer form
    wrapper.classList.remove('active-medication'); // Hide medication form
    wrapper.querySelector('.form-box.register').style.display = 'none'; // Hide register form
    wrapper.querySelector('.form-box.login').style.display = 'block'; // Show login form
});

// Show register form
registerLink.addEventListener('click', () => {
    wrapper.classList.add('active-popup'); // Show wrapper
    wrapper.classList.add('active'); // Show register form
    wrapper.classList.remove('active-timer'); // Hide timer form
    wrapper.classList.remove('active-medication'); // Hide medication form
    wrapper.querySelector('.form-box.login').style.display = 'none'; // Hide login form
    wrapper.querySelector('.form-box.register').style.display = 'block'; // Show register form
});

// Show timer popup
timerLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    wrapper.classList.add('active-popup'); // Show wrapper
    wrapper.classList.add('active-timer'); // Show timer form
    wrapper.classList.remove('active'); // Hide login/register forms
    wrapper.classList.remove('active-medication'); // Hide medication form
    wrapper.querySelector('.form-box.login').style.display = 'none'; // Hide login form
    wrapper.querySelector('.form-box.register').style.display = 'none'; // Hide register form
});

// Show medication reminder popup
medicationLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    wrapper.classList.add('active-popup'); // Show wrapper
    wrapper.classList.add('active-medication'); // Show medication reminder form
    wrapper.classList.remove('active'); // Hide login/register forms
    wrapper.classList.remove('active-timer'); // Hide timer form
    wrapper.querySelector('.form-box.login').style.display = 'none'; // Hide login form
    wrapper.querySelector('.form-box.register').style.display = 'none'; // Hide register form
    wrapper.querySelector('.form-box.timer').style.display = 'none'; // Hide timer form
});

// Close button event for all popups
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup'); // Hide wrapper
    wrapper.classList.remove('active'); // Hide login/register form
    wrapper.classList.remove('active-timer'); // Hide timer form
    wrapper.classList.remove('active-medication'); // Hide medication reminder form
});
