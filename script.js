// Wait for DOM to be fully loaded before running scripts

document.addEventListener('DOMContentLoaded', () => {
  // ===== DOM ELEMENT REFERENCES =====
  // Get references to all important DOM elements
  const loader = document.getElementById('loader'); // Main loader container
  const startButton = document.getElementById('startButton'); // "Experience Bliss" button
  const loadingCircle = document.getElementById('loadingCircle'); // Loading circle container
  const loadingSvg = document.getElementById('loadingSvg'); // SVG element for progress
  const loadingCirclePath = document.getElementById('loadingCirclePath'); // Circle path for animation
  const percentEl = document.getElementById('percent'); // Percentage text element
  const koraLogo = document.getElementById('koraLogo'); // Kora logo element
  
  // Debug: Check if elements are found
  console.log('Elements found:', {
    loader: !!loader,
    startButton: !!startButton,
    loadingCircle: !!loadingCircle,
    loadingSvg: !!loadingSvg,
    loadingCirclePath: !!loadingCirclePath,
    percentEl: !!percentEl,
    koraLogo: !!koraLogo
  });
  
  // ===== INITIAL SETUP =====
  // Hide the loading circle initially - only show the start button
  loadingCircle.style.display = 'none';
  
  // ===== GSAP LOADING CHECK =====
  // Check if GSAP animation library loaded properly
  if (typeof gsap === 'undefined') {
    // Fallback: if GSAP fails to load, hide loader and show content immediately
    loader.style.display = 'none';
    document.getElementById('panel').style.opacity = '1';
    return; // Exit early
  }
  
  // ===== EVENT LISTENERS =====
  // Handle start button click - begins the entire animation sequence
  startButton.addEventListener('click', () => {
    // Step 1: Fade out the start button
    gsap.to(startButton, {opacity: 0, duration: 0.3, ease: 'power2.out'});
    
    // Step 2: Show the loading circle (initially transparent)
    gsap.set(loadingCircle, {display: 'flex', opacity: 0});
    gsap.to(loadingCircle, {opacity: 1, duration: 0.3, ease: 'power2.out'});
    
    // Step 3: Begin the loading animation sequence
    startLoading();
  });
  
  // ===== LOADING ANIMATION FUNCTION =====
  // Creates the circular progress animation from 0% to 100%
  function startLoading() {
    // Create a GSAP timeline for the loading animation
    const tlLoader = gsap.timeline({
      onComplete: morphToLogo // Call morphToLogo when loading completes
    });
    
    // Animate the circular progress indicator
    tlLoader.to(loadingCirclePath, {
      duration: 2.2, // Animation duration
      strokeDashoffset: 0, // Complete the circle
      ease: 'power1.inOut' // Smooth easing
    });
    
    // Add a small pause for dramatic effect
    tlLoader.to({}, {duration: 0.1});
    
    // Animate the percentage text from 0 to 100
    tlLoader.to(percentEl, {
      innerText: 100, // Count up to 100
      duration: 2.2, // Same duration as circle animation
      snap: {innerText: 1}, // Snap to whole numbers
      ease: 'power1.inOut' // Smooth easing
    }, "<"); // Start at the same time as circle animation
  }
  
  // ===== MORPHING ANIMATION FUNCTION =====
  // Transforms the loading circle into the Kora logo
  function morphToLogo() {
    console.log('Morphing to logo...'); // Debug log
    // Step 1: Fade out the percentage text
    gsap.to(percentEl, {opacity: 0, duration: 0.3, ease: 'power2.out'});
    
    // Step 2: Morph the circle container to a square
    gsap.to(loadingCircle, {
      borderRadius: '0%', // Transform from circle to square
      backgroundColor: 'transparent', // Remove background
      boxShadow: 'none', // Remove shadow
      duration: 0.8, // Smooth transition
      ease: 'power2.inOut'
    });
    
    // Step 3: Rotate the SVG back to normal position
    gsap.to(loadingSvg, {
      rotation: 0, // Remove the -90deg rotation
      duration: 0.8,
      ease: 'power2.inOut'
    });
    
    // Step 4: Transform the circle path to solid white
    gsap.to(loadingCirclePath, {
      fill: '#fff', // Fill with white
      stroke: '#fff', // Stroke also white
      strokeWidth: 0, // Remove stroke
      strokeDasharray: 0, // Remove dash pattern
      strokeDashoffset: 0, // Reset offset
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: showKoraLogo // Show Kora logo when morphing completes
    });
  }
  
  // ===== KORA LOGO REVEAL FUNCTION =====
  // Fades in the Kora logo after morphing animation completes
  function showKoraLogo() {
    console.log('Showing Kora logo...'); // Debug log
    // Fade in the Kora logo
    gsap.to(koraLogo, {
      opacity: 1, // Make logo visible
      duration: 0.5, // Smooth fade in
      ease: 'power2.out',
      onComplete: () => {
        console.log('Kora logo animation complete'); // Debug log
        launchSite(); // Launch the main site when logo appears
      }
    });
  }
  
  // ===== MAIN SITE LAUNCH FUNCTION =====
  // Handles the final transition to show the main content
  function launchSite(){
    // Step 1: Fade out the entire loader
    gsap.to(loader, {autoAlpha:0, duration:0.6, ease:'power2.out'});
    
    // Step 2: Create timeline for main content animations
    const tl = gsap.timeline({defaults:{ease:'power3.out'}});
    
    // Step 3: Fade in the main panel
    tl.to('#panel', {opacity:1, duration:0.6});
    
    // Step 4: Animate headline words with motion blur effect
    const words = [...document.querySelectorAll('#headline span')];
    gsap.set(words, {y:100, opacity:0, filter:'blur(20px)'}); // Set initial state
    tl.to(words, {
      y:0, // Move to normal position
      opacity:1, // Fade in
      filter:'blur(0px)', // Remove blur
      duration:1.2,
      ease:'power4.out',
      stagger:0.1 // Stagger animation for each word
    }, "-=0.4"); // Start slightly before previous animation ends
    
    // Step 5: Animate decorative photos
    tl.fromTo('#photoTL', 
      {y:-50, scale:0.6, opacity:0}, // Start position
      {y:0, scale:1, opacity:1, duration:1}, // End position
      "-=0.9" // Timing offset
    );
    tl.fromTo('#photoBR', 
      {y:50, scale:0.6, opacity:0}, // Start position
      {y:0, scale:1, opacity:1, duration:1}, // End position
      "-=0.9" // Timing offset
    );
    
    // Step 6: Animate signup form with pop effect
    tl.fromTo('#signup', 
      {scale:0.8, opacity:0, y:40}, // Start position
      {scale:1, opacity:1, y:0, duration:1}, // End position
      "-=0.6" // Timing offset
    );
  }
}); 