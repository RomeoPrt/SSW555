// Select necessary elements
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const timerLink = document.querySelector('.navigation a[href="#timer"]');
const medicationLink = document.querySelector('.navigation a[href="#medication-reminder"]');
const historyLink = document.querySelector('.navigation a[href="#medication-history"]');
const sinputLink = document.querySelector('.navigation a[href="#sinput"]');

// Show login popup
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup'); // Show wrapper
    wrapper.classList.add('active'); // Show login form
    wrapper.classList.remove('active-timer'); // Hide timer form
    wrapper.classList.remove('active-medication'); // Hide medication form
    wrapper.classList.remove('active-history'); // Hide medication history form
    wrapper.classList.remove('active-sinput'); // Hide symptom input form
    wrapper.querySelector('.form-box.register').style.display = 'none'; // Hide register form
    wrapper.querySelector('.form-box.login').style.display = 'block'; // Show login form
});

// Show register form
registerLink.addEventListener('click', () => {
    wrapper.classList.add('active-popup'); // Show wrapper
    wrapper.classList.add('active'); // Show register form
    wrapper.classList.remove('active-timer'); // Hide timer form
    wrapper.classList.remove('active-medication'); // Hide medication form
    wrapper.classList.remove('active-history'); // Hide medication history form
    wrapper.classList.remove('active-sinput'); // Hide symptom input form
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
    wrapper.classList.remove('active-history'); // Hide medication history form
    wrapper.classList.remove('active-sinput'); // Hide symptom input form
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
    wrapper.classList.remove('active-history'); // Hide medication history form
    wrapper.classList.remove('active-sinput'); // Hide symptom input form
    wrapper.querySelector('.form-box.login').style.display = 'none'; // Hide login form
    wrapper.querySelector('.form-box.register').style.display = 'none'; // Hide register form
    wrapper.querySelector('.form-box.timer').style.display = 'none'; // Hide timer form
});

// Show medication history popup
historyLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    wrapper.classList.add('active-popup'); // Show wrapper
    wrapper.classList.add('active-history'); // Show medication history form
    wrapper.classList.remove('active'); // Hide login/register forms
    wrapper.classList.remove('active-timer'); // Hide timer form
    wrapper.classList.remove('active-medication'); // Hide medication form
    wrapper.classList.remove('active-sinput'); // Hide symptom input form
    wrapper.querySelector('.form-box.login').style.display = 'none'; // Hide login form
    wrapper.querySelector('.form-box.register').style.display = 'none'; // Hide register form
    wrapper.querySelector('.form-box.timer').style.display = 'none'; // Hide timer form
});

// Show manual medication and symptom input popup
sinputLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    wrapper.classList.add('active-popup'); // Show wrapper
    wrapper.classList.add('active-sinput'); // Show symptom input form
    wrapper.classList.remove('active'); // Hide login/register forms
    wrapper.classList.remove('active-timer'); // Hide timer form
    wrapper.classList.remove('active-medication'); // Hide medication form
    wrapper.classList.remove('active-history'); // Hide Hide medication history form
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
    wrapper.classList.remove('active-history'); // Hide medication history form
    wrapper.classList.remove('active-sinput'); // Hide symptom input form

});

// Select the notification button and pop-up elements
const notificationBtn = document.querySelector('.notification-btn');
const notificationPopup = document.querySelector('.notification-popup');
const closePopupBtn = document.querySelector('.close-popup');

// Show the notification pop-up when the button is clicked
notificationBtn.addEventListener('click', () => {
    notificationPopup.style.display = 'block'; // Show pop-up
});

// Hide the notification pop-up when the close button is clicked
closePopupBtn.addEventListener('click', () => {
    notificationPopup.style.display = 'none'; // Hide pop-up
});

document.addEventListener("DOMContentLoaded", function () {
    const contactLink = document.querySelector("#contact-link");
    const contactPopup = document.querySelector(".contact-popup");
    const closeContactPopupButton = document.querySelector(".close-contact-popup");

    contactLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevents page from jumping to top
        contactPopup.style.display = "block"; // Show the pop-up
    });

    closeContactPopupButton.addEventListener("click", function () {
        contactPopup.style.display = "none"; // Hide the pop-up
    });
});

