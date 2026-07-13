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
     13. DYNAMIC PARTICLE CANVAS BACKGROUND
     ========================================================================== */
  const canvas = document.createElement('canvas');
  canvas.id = 'ambient-particles';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-2';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  };

  class Particle {
    constructor(x, y, dx, dy, size) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.size = size;
    }

    draw() {
      const isLightTheme = document.body.classList.contains('light-theme');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = isLightTheme ? 'rgba(9, 9, 11, 0.08)' : 'rgba(255, 255, 255, 0.08)';
      ctx.fill();
    }

    update() {
      // Bounce off walls
      if (this.x + this.size > canvas.width || this.x - this.size < 0) {
        this.dx = -this.dx;
      }
      if (this.y + this.size > canvas.height || this.y - this.size < 0) {
        this.dy = -this.dy;
      }

      // Mouse interactive attraction
      if (mouse.x !== null && mouse.y !== null) {
        let xDiff = mouse.x - this.x;
        let yDiff = mouse.y - this.y;
        let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        if (distance < mouse.radius) {
          this.x += xDiff * 0.01;
          this.y += yDiff * 0.01;
        }
      }

      this.x += this.dx;
      this.y += this.dy;
      this.draw();
    }
  }

  const initParticles = () => {
    particles = [];
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * (canvas.width - size * 2) + size;
      const y = Math.random() * (canvas.height - size * 2) + size;
      const dx = (Math.random() - 0.5) * 0.4;
      const dy = (Math.random() - 0.5) * 0.4;
      particles.push(new Particle(x, y, dx, dy, size));
    }
  };

  const connectParticles = () => {
    const isLightTheme = document.body.classList.contains('light-theme');
    const strokeColor = isLightTheme ? 'rgba(9, 9, 11, 0.02)' : 'rgba(255, 255, 255, 0.02)';
    const mouseStrokeColor = isLightTheme ? 'rgba(37, 99, 235, 0.04)' : 'rgba(99, 102, 241, 0.04)';
    
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                       ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
        if (distance < 12000) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }

      // Draw connections to mouse
      if (mouse.x !== null && mouse.y !== null) {
        let distanceToMouse = ((particles[a].x - mouse.x) * (particles[a].x - mouse.x)) +
                              ((particles[a].y - mouse.y) * (particles[a].y - mouse.y));
        if (distanceToMouse < mouse.radius * mouse.radius) {
          ctx.strokeStyle = mouseStrokeColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connectParticles();
    requestAnimationFrame(animate);
  };

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resizeCanvas();
  animate();

});
