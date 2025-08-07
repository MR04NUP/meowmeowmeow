let phoneInput;
const phoneElement = document.getElementById('phone');
if (typeof intlTelInput !== 'undefined' && phoneElement) {
  phoneInput = intlTelInput(phoneElement, {
    preferredCountries: ['np', 'us', 'gb', 'de', 'fr', 'it', 'es', 'nl', 'au', 'in'],
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    autoPlaceholder: 'auto',
    formatOnDisplay: true,
    allowDropdown: true,
    seperateDialCode: true,
    geoIpLookup: callback => {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => callback(data.country_code))
        .catch(() => callback('np'));
    }
  });
}

// Handle form submission with validation
const signupForm = document.getElementById('signup');
if (signupForm) {
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = signupForm.querySelector('input[type="text"]').value;
    const email = signupForm.querySelector('input[type="email"]').value;
    const newsletter = signupForm.querySelector('input[type="checkbox"]').checked;
    
    // Validate inputs
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    let phoneNumber = '';
    if (phoneInput && phoneInput.isValidNumber()) {
      phoneNumber = phoneInput.getNumber();
    } else {
      alert('Please enter a valid phone number');
      return;
    }
    
    // Success - submit data
    alert("Thank you for signing up! We'll be in touch soon.");
    signupForm.reset();
    if (phoneInput) phoneInput.setCountry('ch');
  });
}
