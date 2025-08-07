document.addEventListener('DOMContentLoaded', () => {
  // DOM element references
  const loader = document.getElementById('loader');
  const startButton = document.getElementById('startButton');
  const loadingCircle = document.getElementById('loadingCircle');
  const loadingSvg = document.getElementById('loadingSvg');
  const loadingCirclePath = document.getElementById('loadingCirclePath');
  const percentEl = document.getElementById('percent');
  const koraLogo = document.getElementById('koraLogo');
  
  
  // Initialize international phone input
  let phoneInput;
  const phoneElement = document.getElementById('phone');
  if (typeof intlTelInput !== 'undefined' && phoneElement) {
    phoneInput = intlTelInput(phoneElement, {
      preferredCountries: ['np', 'us', 'gb', 'de', 'fr', 'it', 'es', 'nl', 'au', 'in'],
      separateDialCode: true,
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      autoPlaceholder: 'auto',
      formatOnDisplay: true,
      allowDropdown: false,
      geoIpLookup: callback => {
        fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(data => callback(data.country_code))
          .catch(() => callback('np'));
      }
    });
  }
  
  // Initial setup
  loadingCircle.style.display = 'none';
  
  // Fallback if GSAP fails to load
  if (typeof gsap === 'undefined') {
    loader.style.display = 'none';
    document.getElementById('panel').style.opacity = '1';
    return;
  }
  
  // Handle start button click to begin animation
  startButton.addEventListener('click', () => {
    gsap.to(startButton, {opacity: 0, duration: 0.3, ease: 'power2.out'});
    gsap.set(loadingCircle, {display: 'flex', opacity: 0});
    gsap.to(loadingCircle, {opacity: 1, duration: 0.3, ease: 'power2.out'});
    startLoading();
  });
  
  // Creates circular progress animation from 0% to 100%
  function startLoading() {
    const tlLoader = gsap.timeline({onComplete: morphToLogo});
    
    // Animate progress circle and percentage counter simultaneously
    tlLoader.to(loadingCirclePath, {
      duration: 2.2,
      strokeDashoffset: 0,
      ease: 'power1.inOut'
    })
    .to({}, {duration: 0.1})
    .to(percentEl, {
      innerText: 100,
      duration: 2.2,
      snap: {innerText: 1},
      ease: 'power1.inOut'
    }, "<");
  }
  
  // Transforms loading circle into Kora logo
  function morphToLogo() {
    gsap.to(percentEl, {opacity: 0, duration: 0.3, ease: 'power2.out'});
    gsap.to(loadingCircle, {
      borderRadius: '0%',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      duration: 0.8,
      ease: 'power2.inOut'
    });
    gsap.to(loadingSvg, {
      rotation: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    });
    gsap.to(loadingCirclePath, {
      fill: '#fff',
      stroke: '#fff',
      strokeWidth: 0,
      strokeDasharray: 0,
      strokeDashoffset: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: showKoraLogo
    });
  }
  
  // Fades in the Kora logo
  function showKoraLogo() {
    gsap.to(koraLogo, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: launchSite
    });
  }
  
  // Handles final transition to show main content
  function launchSite(){
    gsap.to(loader, {autoAlpha:0, duration:0.6, ease:'power2.out'});
    
    const tl = gsap.timeline({defaults:{ease:'power3.out'}});
    tl.to('#panel', {opacity:1, duration:0.6});
    
    // Animate headline words with staggered blur effect
    const words = [...document.querySelectorAll('#headline span')];
    gsap.set(words, {y:100, opacity:0, filter:'blur(50px)'});
    tl.to(words, {
      y:0,
      opacity:1,
      filter:'blur(0px)',
      duration:2.0,
      ease:'power4.out',
      stagger:0.1
    }, "-=0.4");
    
    // Animate decorative photos and signup form
    tl.fromTo('#photoTL', 
      {y:-50, scale:0.6, opacity:0},
      {y:0, scale:1, opacity:1, duration:1},
      "-=0.9"
    )
    .fromTo('#photoBR', 
      {y:50, scale:0.6, opacity:0},
      {y:0, scale:1, opacity:1, duration:1},
      "-=0.9"
    )
    .fromTo('#signup', 
      {scale:0.8, opacity:0, y:40},
      {scale:1, opacity:1, y:0, duration:1},
      "-=0.6"
    );
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
      alert('Thank you for signing up! We\'ll be in touch soon.');
      signupForm.reset();
      if (phoneInput) phoneInput.setCountry('ch');
    });
  }
}); 