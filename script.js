/**
 * ==========================================================================
 * PORTFOLIO CLIENT-SIDE INTERACTION SCRIPT
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. THEME SWITCHER (DARK / LIGHT MODE)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleIcon = themeToggleBtn.querySelector('i');
  
  // Check for saved theme preference, otherwise default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggleIcon.className = 'fa-solid fa-sun';
  } else {
    document.body.classList.remove('light-theme');
    themeToggleIcon.className = 'fa-solid fa-moon';
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    
    if (document.body.classList.contains('light-theme')) {
      themeToggleIcon.className = 'fa-solid fa-sun';
      localStorage.setItem('portfolio-theme', 'light');
    } else {
      themeToggleIcon.className = 'fa-solid fa-moon';
      localStorage.setItem('portfolio-theme', 'dark');
    }
  });

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWERS
     ========================================================================== */
  const menuBtn = document.getElementById('menu-btn');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = () => {
    menuBtn.classList.toggle('active');
    navbar.classList.toggle('active');
    
    // Toggle aria attribute for accessibility
    const isExpanded = menuBtn.classList.contains('active');
    menuBtn.setAttribute('aria-expanded', isExpanded);
  };

  menuBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbar.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  /* ==========================================================================
     3. HERO SECTION TYPING ANIMATION
     ========================================================================== */
  const typingTextEl = document.getElementById('typing-text');
  const roles = ['intelligent systems', 'full-stack applications', 'data-driven solutions'];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  const typeEffect = () => {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Deleting text
      typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Faster deleting speed
    } else {
      // Typing text
      typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // Normal typing speed
    }

    // Determine state switches
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at the end of the full word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Switch to next word after full delete
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Small pause before starting next word
    }

    setTimeout(typeEffect, typingSpeed);
  };

  // Initiate typing animation loop
  if (typingTextEl) {
    typeEffect();
  }

  /* ==========================================================================
     4. STICKY NAV & SCROLL SPY (ACTIVE LINK HIGHLIGHTING)
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  const header = document.getElementById('main-header');

  const scrollSpy = () => {
    const scrollPosition = window.scrollY + 100; // Account for offset

    // Header sticky shadow styling
    if (window.scrollY > 50) {
      header.style.boxShadow = 'var(--shadow-md)';
    } else {
      header.style.boxShadow = 'none';
    }

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);
  // Trigger once on load
  scrollSpy();

  /* ==========================================================================
     5. PROJECT PORTFOLIO FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state of filter buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        // Simple scaling fade-in-out transition for items
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          // Delay display change until transition completes
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     6. FORM VALIDATION & SUBMISSION TOAST NOTIFICATIONS
     ========================================================================== */
  const contactForm = document.getElementById('portfolio-contact-form');
  const toast = document.getElementById('toast-notification');
  const toastCloseBtn = toast.querySelector('.toast-close-btn');

  // Input fields
  const fields = {
    name: {
      el: document.getElementById('contact-name'),
      errorEl: document.getElementById('name-error'),
      validate: (val) => val.trim().length > 0
    },
    email: {
      el: document.getElementById('contact-email'),
      errorEl: document.getElementById('email-error'),
      validate: (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val.trim());
      }
    },
    subject: {
      el: document.getElementById('contact-subject'),
      errorEl: document.getElementById('subject-error'),
      validate: (val) => val.trim().length > 0
    },
    message: {
      el: document.getElementById('contact-message'),
      errorEl: document.getElementById('message-error'),
      validate: (val) => val.trim().length >= 10
    }
  };

  // Helper validation logic
  const checkField = (fieldKey) => {
    const field = fields[fieldKey];
    const isValid = field.validate(field.el.value);
    
    if (isValid) {
      field.el.parentElement.classList.remove('invalid');
    } else {
      field.el.parentElement.classList.add('invalid');
    }
    return isValid;
  };

  // Real-time input validation feedback
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    field.el.addEventListener('input', () => {
      // Validate on type if the field was already marked invalid
      if (field.el.parentElement.classList.contains('invalid')) {
        checkField(key);
      }
    });
    
    field.el.addEventListener('blur', () => {
      checkField(key);
    });
  });

  // Handle Toast Notifications
  let toastTimer;
  const showToast = () => {
    toast.classList.remove('hidden');
    
    // Clear auto-hide timer if clicking open multiple times
    clearTimeout(toastTimer);
    
    // Auto-hide toast after 5 seconds
    toastTimer = setTimeout(() => {
      hideToast();
    }, 5000);
  };

  const hideToast = () => {
    toast.classList.add('hidden');
  };

  toastCloseBtn.addEventListener('click', hideToast);

  // Form Submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check all fields
    let formIsValid = true;
    Object.keys(fields).forEach(key => {
      const isFieldValid = checkField(key);
      if (!isFieldValid) {
        formIsValid = false;
      }
    });

    if (formIsValid) {
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const originalBtnHtml = submitBtn.innerHTML;
      
      // Simulate loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

      setTimeout(() => {
        // Success Mockup
        showToast();
        contactForm.reset();
        
        // Reset submit button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        
        // Clear all validation styles
        Object.keys(fields).forEach(key => {
          fields[key].el.parentElement.classList.remove('invalid');
        });
      }, 1500);
    }
  });

  /* ==========================================================================
     7. ANIMATING EXPERIENCE TIMELINE ON SCROLL
     ========================================================================== */
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const animateTimelineOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;

    timelineItems.forEach(item => {
      const itemTop = item.getBoundingClientRect().top;
      
      if (itemTop < triggerBottom) {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }
    });
  };

  // Set initial styles for animating elements (fade in on scroll)
  timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(40px)';
    item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  });

  window.addEventListener('scroll', animateTimelineOnScroll);
  // Trigger once on load to show initial ones on viewport
  animateTimelineOnScroll();

});
