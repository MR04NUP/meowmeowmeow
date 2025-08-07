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

// Form validation and button state management
const signupForm = document.getElementById('signup');
const submitButton = signupForm ? signupForm.querySelector('button[type="submit"]') : null;
const nameInput = signupForm ? signupForm.querySelector('input[type="text"]') : null;
const emailInput = signupForm ? signupForm.querySelector('input[type="email"]') : null;

// Validation state
let validationState = {
  name: false,
  email: false,
  phone: false
};

// Function to validate all inputs
function validateForm() {
  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const isPhoneValid = phoneInput ? phoneInput.isValidNumber() : false;
  
  validationState.name = name.length > 0;
  validationState.email = email.length > 0 && email.includes('@');
  validationState.phone = isPhoneValid;
  
  const isFormValid = validationState.name && validationState.email && validationState.phone;
  
  // Update button state
  if (submitButton) {
    if (isFormValid) {
      submitButton.classList.remove('disabled');
      submitButton.classList.add('enabled');
      submitButton.disabled = false;
    } else {
      submitButton.classList.add('disabled');
      submitButton.classList.remove('enabled');
      submitButton.disabled = true;
    }
  }
  
  return isFormValid;
}

// Add event listeners for real-time validation
if (nameInput) {
  nameInput.addEventListener('input', validateForm);
  nameInput.addEventListener('blur', validateForm);
}

if (emailInput) {
  emailInput.addEventListener('input', validateForm);
  emailInput.addEventListener('blur', validateForm);
}

if (phoneElement) {
  phoneElement.addEventListener('input', validateForm);
  phoneElement.addEventListener('blur', validateForm);
}

// Button hover tooltip functionality
if (submitButton) {
  submitButton.addEventListener('mouseenter', function() {
    if (submitButton.disabled) {
      showValidationTooltip();
    }
  });
  
  submitButton.addEventListener('mouseleave', function() {
    hideValidationTooltip();
  });
}

// Tooltip functions
function showValidationTooltip() {
  const errors = [];
  if (!validationState.name) errors.push('Name is required');
  if (!validationState.email) errors.push('Valid email is required');
  if (!validationState.phone) errors.push('Valid phone number is required');
  
  if (errors.length > 0) {
    const tooltip = document.createElement('div');
    tooltip.className = 'validation-tooltip';
    tooltip.innerHTML = errors.join('<br>');
    submitButton.appendChild(tooltip);
  }
}

function hideValidationTooltip() {
  const tooltip = submitButton.querySelector('.validation-tooltip');
  if (tooltip) {
    tooltip.classList.add('fade-out');
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.remove();
      }
    }, 200); // Match the CSS animation duration
  }
}

// Handle form submission
if (signupForm) {
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const name = nameInput.value;
    const email = emailInput.value;
    const newsletter = signupForm.querySelector('input[type="checkbox"]').checked;
    const phoneNumber = phoneInput.getNumber();
    
    // Success - submit data
    console.log('Form data:', { name, email, phone: phoneNumber, newsletter });
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    signupForm.reset();
    if (phoneInput) phoneInput.setCountry('np');
    validateForm(); // Re-validate to update button state
  });
}

// Success message function
function showSuccessMessage() {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = "Thank you for signing up! We'll be in touch soon.";
  
  signupForm.appendChild(successDiv);

}

// Initialize validation on page load
document.addEventListener('DOMContentLoaded', function() {
  validateForm();
});
