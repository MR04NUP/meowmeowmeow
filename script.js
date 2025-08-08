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

// Success message function (replace card contents)
function showSuccessMessage() {
  if (!signupForm) return;
  signupForm.innerHTML = `
    <div class="success-message" role="status" aria-live="polite">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:8px;">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      You're on the list. We'll be in touch soon.
    </div>
  `;
}

// Initialize validation on page load
document.addEventListener('DOMContentLoaded', function() {
  validateForm();
});

// === Animations with GSAP ===
function splitHeadlineIntoSpans() {
  const headline = document.getElementById('headline');
  if (!headline) return [];
  const spans = Array.from(headline.querySelectorAll('span'));
  if (spans.length === 0) return [];
  const chars = [];
  spans.forEach(span => {
    const text = span.textContent || '';
    span.textContent = '';
    for (const ch of text) {
      const charSpan = document.createElement('span');
      charSpan.className = 'char';
      if (ch === ' ') {
        charSpan.innerHTML = '&nbsp;';
      } else {
        charSpan.textContent = ch;
      }
      span.appendChild(charSpan);
      chars.push(charSpan);
    }
  });
  return chars;
}

function initAnimations() {
  if (typeof gsap === 'undefined') return;

  const panel = document.getElementById('panel');
  const logo = null; // brand bug removed
  const introLogo = document.querySelector('.intro-logo');
  const introWordmark = document.querySelector('.intro-wordmark');
  const featureImgs = document.querySelectorAll('.feature-img');
  const form = document.getElementById('signup');
  console.log('Form element:', form);

  // Set initial states for elements that need to be animated
  // brand bug removed
  if (introLogo) gsap.set(introLogo, { opacity: 0, scale: 0.6, rotate: 0 });
  if (introWordmark) gsap.set(introWordmark, { opacity: 0 });
  if (featureImgs.length) gsap.set(featureImgs, { opacity: 0, y: 30 });
  // Do not set initial form state via JS; CSS handles it to prevent flash

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Main panel sweep-in from bottom (bottom anchored) using clip-path reveal
  if (panel) {
    tl.from(panel, {
      clipPath: 'inset(100% 0% 0% 0%)',
      opacity: 0,
      filter: 'blur(12px)',
      duration: 1.0,
      ease: 'power4.out'
    });
  }

  // Headline randomized character reveal with blur
  const chars = splitHeadlineIntoSpans();
  if (chars.length) {
    tl.from(chars, {
      yPercent: 120,
      opacity: 0,
      filter: 'blur(6px)',
      rotateZ: () => gsap.utils.random(-8, 8),
      duration: 0.6,
      ease: 'back.out(1.8)'
    }, '-=0.3');
  }

  // Gym description text animation
  const gymDescription = document.querySelector('.gym-description');
  if (gymDescription) {
    tl.from(gymDescription, {
      y: 30,
      opacity: 0,
      filter: 'blur(6px)',
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4');
  }

  // Intro: fast spin and enlarge for icon at center-top, then fade wordmark
  if (introLogo) {
    tl.to(introLogo, {
      opacity: 1,
      scale: 1.25,
      rotate: 360, // even fewer spins
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.2')
    .to(introLogo, {
      scale: 1,
      rotate: 450,
      duration: 0.4,
      ease: 'back.out(1.4)'
    })
    .to(introWordmark, {
      opacity: 1,
      duration: 0.7,
      ease: 'power2.out'
    }, '-=0.2');
    // keep on screen: remove fade-out of logo and wordmark
  }

  // Feature images staggered float-in
  if (featureImgs && featureImgs.length) {
    tl.to(featureImgs, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    }, '-=0.4');
  }

  // Form elements stagger-in - animate after panel animation
  if (form) {
    console.log('Form found, animating...');
    tl.fromTo(form,
      { opacity: 0, y: 24, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power2.out',
        onStart: () => console.log('Form animation started'),
        onComplete: () => console.log('Form animation completed')
      },
      '+=0.6' // start after other key elements settle
    );
  } else {
    console.log('Form not found!');
  }

  // Brand bug: subtle fade-up after intro
  // brand bug removed

}

// Wait for DOM and images to load before starting animations
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAnimations, 200); // Small delay to ensure images are registered
  });
} else {
  setTimeout(initAnimations, 200);
}

// Fallback: ensure elements are visible after 3 seconds if animations don't work
setTimeout(() => {
  const logo = document.querySelector('.logo-container img');
  const featureImgs = document.querySelectorAll('.feature-img');
  const form = document.getElementById('signup');
  
  if (logo) gsap.set(logo, { opacity: 1, y: 0 });
  if (featureImgs.length) gsap.set(featureImgs, { opacity: 1, y: 0 });
  if (form) gsap.set(form, { opacity: 1, y: 0 });
}, 3000);
