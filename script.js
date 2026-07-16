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

  /* ==========================================================================
     12. DYNAMIC AMBIENT BACKDROP ELEMENTS (DYNAMIC INJECTION)
     ========================================================================== */
  // Inject Background Blur Glow Spheres
  const sphere1 = document.createElement('div');
  sphere1.className = 'glow-sphere sphere-1';
  const sphere2 = document.createElement('div');
  sphere2.className = 'glow-sphere sphere-2';
  document.body.appendChild(sphere1);
  document.body.appendChild(sphere2);

  // Inject Custom Cursor Followers (Desktop Only)
  if (window.innerWidth > 768) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    ring.className = 'custom-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });
    
    const animateCursor = () => {
      // Smooth interpolation drag trailing effect
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
    
    // Scale up outer ring when hovering clickable elements
    const hoverables = document.querySelectorAll('a, button, .glass-card, .copy-btn, input, textarea');
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
      item.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
    });
  }

  /* ==========================================================================
     14. INTERACTIVE SYSTEM CONTROL CENTER (AI TERMINAL & DIAGNOSTICS)
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.terminal-nav-tab');
  const panels = document.querySelectorAll('.terminal-panel');
  
  if (tabButtons.length > 0 && panels.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle tabs active class
        tabButtons.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        
        // Toggle panels active class
        const targetTab = btn.getAttribute('data-tab');
        panels.forEach(panel => {
          panel.classList.remove('active');
          if (panel.id === `panel-${targetTab}`) {
            panel.classList.add('active');
          }
        });
      });
    });
  }

  // CLI Command Logic
  const cliInput = document.getElementById('cli-input-field');
  const cliLog = document.getElementById('cli-output-log');
  const cliBtns = document.querySelectorAll('.cli-btn');

  if (cliInput && cliLog) {
    const appendLine = (content, className = '') => {
      const line = document.createElement('div');
      line.className = `cli-line ${className}`;
      line.innerHTML = content;
      cliLog.appendChild(line);
      cliLog.scrollTop = cliLog.scrollHeight; // Auto-scroll to bottom
    };

    const runCommand = (cmdText) => {
      const cleanCmd = cmdText.trim().toLowerCase();
      if (!cleanCmd) return;

      // Echo command
      appendLine(`<span class="cli-prompt">guest@saivivek_os:~$</span> ${cmdText}`);

      // Command matches
      if (cleanCmd === 'help') {
        appendLine('Available Commands:', 'keyword');
        appendLine('  <span class="method">run model_check</span> - Run validation epoch diagnostics');
        appendLine('  <span class="method">skills --all</span>      - Fetch structured developer tech stack');
        appendLine('  <span class="method">fetch bio</span>          - Download career objectives metadata');
        appendLine('  <span class="method">clear</span>              - Clear the terminal screen log');
        appendLine('  <span class="method">help</span>               - List all operations');
      } else if (cleanCmd === 'clear') {
        cliLog.innerHTML = '';
      } else if (cleanCmd === 'fetch bio') {
        appendLine('Retrieving biography profile...', 'comment');
        setTimeout(() => {
          appendLine('<span class="keyword">Profile Objective:</span> Specializing in AI/ML solutions, NLP, data analytics, and responsive full-stack applications.');
          appendLine('Eager to solve real-world problems with elegant, scalable code.');
        }, 300);
      } else if (cleanCmd === 'skills --all') {
        appendLine('Fetching developer skills stack database...', 'comment');
        setTimeout(() => {
          appendLine('<span class="keyword">{</span>');
          appendLine('  <span class="class-name">"languages":</span> ["Python", "JavaScript", "Java", "SQL", "C"],');
          appendLine('  <span class="class-name">"frameworks":</span> ["FastAPI", "React", "Node.js", "Express", "MongoDB"],');
          appendLine('  <span class="class-name">"ai_ml":</span> ["NLP", "RAG", "LLMs", "ChromaDB", "Vector Search"]');
          appendLine('<span class="keyword">}</span>');
        }, 450);
      } else if (cleanCmd === 'run model_check') {
        appendLine('Initializing model testing sequences...', 'comment');
        
        let steps = [
          { t: 200, m: 'Loading weights: <span class="string">saivivek-llama-7b-int8.bin</span>...' },
          { t: 500, m: 'Verifying embeddings layer: dim=<span class="keyword">1536</span>... <span class="text-emerald">OK</span>' },
          { t: 900, m: 'Epoch 1/3: Loss=<span class="self">0.245</span> | Accuracy=<span class="text-emerald">91.2%</span>' },
          { t: 1300, m: 'Epoch 2/3: Loss=<span class="self">0.158</span> | Accuracy=<span class="text-emerald">94.8%</span>' },
          { t: 1700, m: 'Epoch 3/3: Loss=<span class="self">0.089</span> | Accuracy=<span class="text-emerald">98.4%</span>' },
          { t: 2000, m: 'Evaluation status: <span class="text-emerald">OPTIMIZED</span>. Validation complete.' }
        ];

        steps.forEach(step => {
          setTimeout(() => {
            appendLine(step.m);
          }, step.t);
        });
      } else {
        appendLine(`saivivek_os: command not found: <span class="self">${cmdText}</span>. Type <span class="keyword">help</span> for options.`);
      }

      cliInput.value = '';
    };

    // Listen to Enter Keypress
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        runCommand(cliInput.value);
      }
    });

    // Listen to Shortcut buttons clicks
    cliBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        runCommand(cmd);
      });
    });
  }

});
