/**
 * ==========================================================================
 * PORTFOLIO CLIENT-SIDE INTERACTION SCRIPT (MULTI-PAGE COMPATIBLE)
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

  if (menuBtn && navbar) {
    menuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbar.classList.contains('active')) {
          toggleMobileMenu();
        }
      });
    });
  }

  /* ==========================================================================
     3. HERO SECTION TYPING ANIMATION (HOME PAGE ONLY)
     ========================================================================== */
  const typingTextEl = document.getElementById('typing-text');
  
  if (typingTextEl) {
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

    typeEffect();
  }

  /* ==========================================================================
     4. STICKY NAV SHADOW
     ========================================================================== */
  const header = document.getElementById('main-header');

  if (header) {
    const handleHeaderScroll = () => {
      // Header sticky shadow styling
      if (window.scrollY > 50) {
        header.style.boxShadow = 'var(--shadow-md)';
      } else {
        header.style.boxShadow = 'none';
      }
    };

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();
  }

  /* ==========================================================================
     5. PROJECT PORTFOLIO FILTERING (PROJECTS PAGE ONLY)
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
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
  }

  /* ==========================================================================
     6. FORM VALIDATION & SUBMISSION TOAST NOTIFICATIONS (CONTACT PAGE ONLY)
     ========================================================================== */
  const contactForm = document.getElementById('portfolio-contact-form');
  
  if (contactForm) {
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
  }

  /* ==========================================================================
     7. ANIMATING EXPERIENCE TIMELINE ON SCROLL (EXPERIENCE PAGE ONLY)
     ========================================================================== */
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (timelineItems.length > 0) {
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
  }

  /* ==========================================================================
     8. INTERACTIVE IDE TERMINAL RUN SIMULATOR & TAB SWITCHER (HOME PAGE ONLY)
     ========================================================================== */
  const runBtn = document.getElementById('run-btn');
  const terminalConsole = document.getElementById('terminal-console');
  const consoleLogEl = terminalConsole ? terminalConsole.querySelector('.console-log') : null;
  const terminalTabs = document.querySelectorAll('.terminal-tab');
  const terminalBodies = document.querySelectorAll('.terminal-body');

  // Tab switching logic
  if (terminalTabs.length > 0 && terminalBodies.length > 0) {
    terminalTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Remove active state from all tabs and add to active one
        terminalTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Hide all body blocks and show target body block
        terminalBodies.forEach(body => {
          body.style.display = 'none';
          body.classList.remove('active');
        });
        
        const activeBody = document.getElementById(`tab-content-${targetTab}`);
        if (activeBody) {
          activeBody.style.display = 'flex';
          activeBody.classList.add('active');
        }

        // Reset Run Console states to keep layouts clean when switching files
        if (terminalConsole && !terminalConsole.classList.contains('hidden')) {
          terminalConsole.classList.add('hidden');
          if (runBtn) runBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run';
          if (consoleLogEl) consoleLogEl.textContent = '';
        }
      });
    });
  }

  // Code runner logs simulation
  if (runBtn && terminalConsole && consoleLogEl) {
    let typingInterval;
    let isRunning = false;

    runBtn.addEventListener('click', () => {
      // Find what code is currently active
      const activeTab = document.querySelector('.terminal-tab.active');
      const activeTabName = activeTab ? activeTab.getAttribute('data-tab') : 'profile';

      if (isRunning) {
        // Toggle closed
        terminalConsole.classList.add('hidden');
        runBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run';
        clearInterval(typingInterval);
        consoleLogEl.textContent = '';
        isRunning = false;
        return;
      }

      // Initialize run state
      isRunning = true;
      terminalConsole.classList.remove('hidden');
      runBtn.innerHTML = '<i class="fa-solid fa-square"></i> Stop';
      consoleLogEl.textContent = '';

      let logLines = [];
      if (activeTabName === 'profile') {
        logLines = [
          "$ python profile.py",
          "[INFO] Booting AI engineering environment kernel...",
          "[INFO] Loading vector database metadata indexes (size: 1536)...",
          "[SUCCESS] Vector database connected successfully.",
          "[INFO] Initializing Developer object properties...",
          "[SUCCESS] Developer initialized: 'Adigarla Sai Vivek'",
          ">> Name:     Adigarla Sai Vivek",
          ">> Status:   Ready for professional roles / collaborations",
          ">> Skills:   Python, FastAPI, React, LLMs, Scikit-learn",
          ">> Objective: Eager to develop impactful technology solutions!"
        ];
      } else if (activeTabName === 'skills') {
        logLines = [
          "$ cat skills.json",
          "[INFO] Loading toolbox definitions in sandbox...",
          "[SUCCESS] Loaded 4 languages: Python, JS, Java, SQL.",
          "[SUCCESS] Loaded 3 web frameworks: FastAPI, React, Node.",
          "[SUCCESS] Loaded AI toolsets: GPT-4, Claude, LangChain, CrewAI.",
          "[INFO] Running skills validator suite... OK.",
          ">> Ready to deploy AI & Full-Stack solutions."
        ];
      } else {
        logLines = [
          "$ vercel deploy --prod",
          "[INFO] Retreiving local vercel.json configurations...",
          "[INFO] Building project static assets directories...",
          "[SUCCESS] 7 pages built successfully (index, about, skills, experience, projects, contact, resume).",
          "[INFO] Uploading static assets to Vercel CDN edges...",
          "[SUCCESS] Deploy completed! Live URL: https://portfolio.adigarla.vercel.app"
        ];
      }
      
      let lineIndex = 0;
      const printNextLine = () => {
        if (lineIndex < logLines.length) {
          consoleLogEl.textContent += logLines[lineIndex] + '\n';
          
          // Auto scroll to bottom of console
          terminalConsole.scrollTop = terminalConsole.scrollHeight;
          
          lineIndex++;
        } else {
          clearInterval(typingInterval);
          runBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Reset';
        }
      };

      printNextLine();
      typingInterval = setInterval(printNextLine, 350);
    });
  }

  /* ==========================================================================
     9. CLIPBOARD COPY UX HELPERS (CONTACT PAGE ONLY)
     ========================================================================== */
  const copyButtons = document.querySelectorAll('.copy-btn');

  if (copyButtons.length > 0) {
    copyButtons.forEach(btn => {
      const textToCopy = btn.getAttribute('data-copy');
      const tooltip = btn.querySelector('.tooltip');

      btn.addEventListener('click', () => {
        if (textToCopy) {
          navigator.clipboard.writeText(textToCopy)
            .then(() => {
              // Update tooltip
              tooltip.textContent = 'Copied!';
              btn.style.color = 'var(--accent-success)';
              btn.style.borderColor = 'var(--accent-success)';
              
              // Reset after 2 seconds
              setTimeout(() => {
                tooltip.textContent = 'Copy';
                btn.style.color = '';
                btn.style.borderColor = '';
              }, 2000);
            })
            .catch(err => {
              console.error('Failed to copy to clipboard: ', err);
            });
        }
      });
      
      // Reset text on mouseout in case click timer didn't finish
      btn.addEventListener('mouseleave', () => {
        setTimeout(() => {
          tooltip.textContent = 'Copy';
        }, 300);
      });
    });
  }

  /* ==========================================================================
     10. SPOTLIGHT MOUSE GLOWS ON CARD HOVERS (GLOBAL)
     ========================================================================== */
  const glassCards = document.querySelectorAll('.glass-card');
  
  if (glassCards.length > 0 && window.innerWidth > 768) {
    glassCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  /* ==========================================================================
     11. DYNAMIC STAGGERED FADE-IN SCROLL OBSERVER (GLOBAL)
     ========================================================================== */
  const cardsToAnimate = document.querySelectorAll('.project-card, .skill-category-card, .stat-card, .education-card, .certifications-block, .contact-info-panel, .contact-form-panel');

  if (cardsToAnimate.length > 0) {
    // Dynamically assign classes on all selected elements to keep HTML source clean
    cardsToAnimate.forEach((card, index) => {
      card.classList.add('animate-fade-in');
      const delayIndex = (index % 6) + 1; // Staggers from 1 to 6
      card.classList.add(`stagger-${delayIndex}`);
    });

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const entranceObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, observerOptions);

    cardsToAnimate.forEach(card => {
      entranceObserver.observe(card);
    });
  }

});
