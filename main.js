/* ==========================================================================
   MINIMAL CYBERPUNK PORTFOLIO JAVASCRIPT ENGINE
   Exact Replica of Reference Video Animations & Ambience
   Operator: Abhilash Salim // VAPT Analyst & Security Researcher
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Strict Top Scroll Enforcement: Ensure page lands directly on Hero section
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname);
  }

  // ==========================================================================
  // 1. "RECON TO ROOT" 4-SECOND CYBERSECURITY PRELOADER CONTROLLER
  // 0.0s - 0.5s: Central Origin Node Appears
  // 0.5s - 1.5s: Recon Expansion (Lines connect outward to 6 topology nodes)
  // 1.5s - 2.3s: Vulnerability Alert (Coral red ring) & Blue Patch Remediation
  // 2.3s - 3.3s: Verification & Identity Reveal ("ABHILASH") - Held for 1.0s
  // 3.3s - 4.0s: Smooth Transition to Main Portfolio Page
  // ==========================================================================
  const CX = 190;
  const CY = 140;
  const RADIUS = 92;

  const NODES = [
    { id: 0, angle: 0 },
    { id: 1, angle: 60 },
    { id: 2, angle: 120 },
    { id: 3, angle: 180 },
    { id: 4, angle: 240 },
    { id: 5, angle: 300 } // Alerts & Patches
  ].map(node => {
    const rad = (node.angle * Math.PI) / 180;
    return {
      ...node,
      x: CX + RADIUS * Math.cos(rad),
      y: CY + RADIUS * Math.sin(rad)
    };
  });

  const MESH_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
    [0, 2], [3, 5]
  ];

  const preloader = document.getElementById('preloader');
  const centerNode = document.getElementById('center-node');
  const centerPulse = document.getElementById('center-pulse');
  const patchWave = document.getElementById('patch-wave');
  const radialLayer = document.getElementById('radial-lines-layer');
  const meshLayer = document.getElementById('mesh-lines-layer');
  const nodesLayer = document.getElementById('outer-nodes-layer');
  const identityReveal = document.getElementById('identity-reveal');

  if (preloader && centerNode && radialLayer && meshLayer && nodesLayer && identityReveal) {
    radialLayer.innerHTML = '';
    meshLayer.innerHTML = '';
    nodesLayer.innerHTML = '';

    // Create Mesh Lines
    MESH_CONNECTIONS.forEach(([i, j]) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', NODES[i].x);
      line.setAttribute('y1', NODES[i].y);
      line.setAttribute('x2', NODES[j].x);
      line.setAttribute('y2', NODES[j].y);
      line.setAttribute('class', 'net-line mesh');
      line.style.opacity = '0';
      meshLayer.appendChild(line);
    });

    // Create Radial Lines
    NODES.forEach((n, idx) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', CX);
      line.setAttribute('y1', CY);
      line.setAttribute('x2', CX);
      line.setAttribute('y2', CY);
      line.setAttribute('class', 'net-line');
      radialLayer.appendChild(line);
    });

    // Create Outer Nodes
    NODES.forEach((n, idx) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'node-group');
      g.setAttribute('id', `node-group-${idx}`);
      g.style.opacity = '0';
      g.style.transform = `translate(${n.x}px, ${n.y}px) scale(0)`;

      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('class', 'node-outer-ring');
      ring.setAttribute('cx', 0);
      ring.setAttribute('cy', 0);
      ring.setAttribute('r', 10);

      const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      core.setAttribute('class', 'node-core');
      core.setAttribute('cx', 0);
      core.setAttribute('cy', 0);
      core.setAttribute('r', 4.5);

      g.appendChild(ring);
      g.appendChild(core);
      nodesLayer.appendChild(g);
    });

    const radialLines = Array.from(radialLayer.querySelectorAll('.net-line'));
    const meshLines = Array.from(meshLayer.querySelectorAll('.net-line.mesh'));
    const nodeGroups = Array.from(nodesLayer.querySelectorAll('.node-group'));
    const vulnNode = document.getElementById('node-group-5');

    const animStartTime = performance.now();
    let animFrameId = null;
    let flightTriggered = false;

    function tick(now) {
      const elapsed = (now - animStartTime) / 1000;

      // 1. Central Origin (0.0s - 0.5s): Single glowing blue dot appears
      if (elapsed <= 0.5) {
        const p = elapsed / 0.5;
        centerNode.setAttribute('r', Math.min(p * 8, 7));
        const ringP = Math.max((p - 0.3) / 0.7, 0);
        centerPulse.setAttribute('r', 7 + ringP * 18);
        centerPulse.style.opacity = (1 - ringP) * 0.8;
      }

      // 2. Recon Expansion (0.5s - 1.5s): Thin crisp blue lines draw outward
      if (elapsed > 0.5 && elapsed <= 1.5) {
        const p = (elapsed - 0.5) / 1.0;

        radialLines.forEach((line, i) => {
          const target = NODES[i];
          const curX = CX + (target.x - CX) * p;
          const curY = CY + (target.y - CY) * p;
          line.setAttribute('x2', curX);
          line.setAttribute('y2', curY);
        });

        nodeGroups.forEach((g, i) => {
          const nodeArrival = 0.5 + (i % 3) * 0.15;
          if (p >= nodeArrival) {
            const nodeP = Math.min((p - nodeArrival) / 0.35, 1);
            g.style.opacity = '1';
            g.style.transform = `translate(${NODES[i].x}px, ${NODES[i].y}px) scale(${nodeP})`;
          }
        });

        const meshP = Math.max((p - 0.5) / 0.5, 0);
        meshLines.forEach(l => l.style.opacity = `${meshP * 0.85}`);
      }

      // Lock positions after 1.5s
      if (elapsed > 1.5) {
        radialLines.forEach((line, i) => {
          line.setAttribute('x2', NODES[i].x);
          line.setAttribute('y2', NODES[i].y);
        });
        nodeGroups.forEach((g, i) => {
          g.style.opacity = '1';
          g.style.transform = `translate(${NODES[i].x}px, ${NODES[i].y}px) scale(1)`;
        });
        meshLines.forEach(l => l.style.opacity = '0.85');
      }

      // 3. Vulnerability Alert & Patch (1.5s - 2.3s)
      if (elapsed >= 1.5 && elapsed < 1.9) {
        vulnNode.classList.add('vuln');
      } else if (elapsed >= 1.9 && elapsed < 2.3) {
        const ripP = (elapsed - 1.9) / 0.4;
        patchWave.setAttribute('r', ripP * (RADIUS + 25));
        patchWave.style.opacity = (1 - ripP) * 0.9;
        if (ripP >= 0.7) {
          vulnNode.classList.remove('vuln');
        }
      } else if (elapsed >= 2.3) {
        vulnNode.classList.remove('vuln');
        patchWave.style.opacity = '0';
      }

      // 4. Verification & Identity Reveal ("Abhilash Salim"): Appears at 2.3s, held for 2.0s until 4.3s
      if (elapsed >= 2.3) {
        identityReveal.classList.add('visible');
      }

      // 5. Header Flight & Transition (4.3s - 5.15s): Flies smoothly to navbar logo, dissolves preloader
      if (elapsed >= 4.3 && !flightTriggered) {
        flightTriggered = true;
        const revealName = document.getElementById('preloader-reveal-name');
        const targetLogo = document.getElementById('target-navbar-logo');
        const topoSvg = document.getElementById('topology-svg');
        const revealBadge = document.querySelector('.reveal-badge');

        if (topoSvg) {
          topoSvg.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          topoSvg.style.opacity = '0';
          topoSvg.style.transform = 'scale(0.92)';
        }
        if (revealBadge) {
          revealBadge.style.transition = 'opacity 0.35s ease';
          revealBadge.style.opacity = '0';
        }

        if (revealName && targetLogo) {
          const startRect = revealName.getBoundingClientRect();
          const targetRect = targetLogo.getBoundingClientRect();

          const deltaX = (targetRect.left + targetRect.width / 2) - (startRect.left + startRect.width / 2);
          const deltaY = (targetRect.top + targetRect.height / 2) - (startRect.top + startRect.height / 2);
          const scale = targetRect.height / startRect.height;

          revealName.style.position = 'fixed';
          revealName.style.left = `${startRect.left}px`;
          revealName.style.top = `${startRect.top}px`;
          revealName.style.width = `${startRect.width}px`;
          revealName.style.height = `${startRect.height}px`;
          revealName.style.margin = '0';
          revealName.style.zIndex = '1000005';
          revealName.style.transformOrigin = 'center center';
          targetLogo.style.opacity = '0';

          // Force reflow
          void revealName.offsetHeight;

          revealName.style.transition = 'transform 0.82s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.82s ease';
          revealName.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;

          setTimeout(() => {
            preloader.classList.add('fade-out');
          }, 120);

          setTimeout(() => {
            targetLogo.style.opacity = '1';
            targetLogo.style.transition = 'opacity 0.25s ease';
            revealName.style.opacity = '0';
            preloader.style.display = 'none';

            // Land strictly at the top of the main Hero Section
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          }, 850);
        } else {
          preloader.classList.add('fade-out');
          setTimeout(() => {
            preloader.style.display = 'none';
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          }, 750);
        }
      }

      if (elapsed < 5.3) {
        animFrameId = requestAnimationFrame(tick);
      }
    }

    animFrameId = requestAnimationFrame(tick);
  }

  // ==========================================================================
  // 2. AMBIENT RED FLOATING EMBERS CANVAS ENGINE (60 FPS)
  // ==========================================================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);

    class EmberParticle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + Math.random() * 20;
        this.radius = Math.random() * 2 + 0.8;
        this.speedY = Math.random() * 0.7 + 0.35;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.maxAlpha = this.alpha;
        this.decay = Math.random() * 0.003 + 0.001;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
      }

      update() {
        this.y -= this.speedY;
        this.pulse += this.pulseSpeed;
        this.x += this.speedX + Math.sin(this.pulse) * 0.3;

        this.alpha -= this.decay;
        if (this.y < -10 || this.alpha <= 0.05) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        // Glowing light blue radial drop
        const radGlow = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 3.5
        );
        radGlow.addColorStop(0, `rgba(56, 189, 248, ${this.alpha})`);
        radGlow.addColorStop(0.4, `rgba(14, 165, 233, ${this.alpha * 0.6})`);
        radGlow.addColorStop(1, 'rgba(2, 132, 199, 0)');

        ctx.fillStyle = radGlow;
        ctx.fill();

        // Particle core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${this.alpha * 0.9})`;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new EmberParticle());
    }

    function animateEmbers() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animateEmbers);
    }
    animateEmbers();
  }

  // ==========================================================================
  // 3. SMOOTH SCROLLING & ACTIVE NAV LINKS
  // ==========================================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // HERO SUBTITLE TYPEWRITER WITH BLINKING TERMINAL CURSOR
  // ==========================================================================
  const typewriterRole = document.getElementById('typewriter-role');
  if (typewriterRole) {
    const roles = [
      'PENETRATION TESTER // OFFENSIVE SECURITY',
      'VAPT ANALYST // SECURITY RESEARCHER',
      'WEB APPLICATION SECURITY AUDITOR',
      'VULNERABILITY RESEARCHER // ETHICAL HACKER'
    ];
    let roleIdx = 0;
    let charIdx = roles[0].length;
    let isDeleting = false;
    let typeSpeed = 65;

    function typeLoop() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        charIdx--;
        typewriterRole.textContent = currentRole.substring(0, charIdx);
        typeSpeed = 35;
      } else {
        charIdx++;
        typewriterRole.textContent = currentRole.substring(0, charIdx);
        typeSpeed = 65;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        typeSpeed = 2400; // Pause when full role is displayed
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeSpeed = 450; // Pause before typing next role
      }

      setTimeout(typeLoop, typeSpeed);
    }

    // Start typewriter sequence after preloader transition concludes
    setTimeout(typeLoop, 4500);
  }

  // ==========================================================================
  // LIGHTWEIGHT SCROLL-REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // ==========================================================================
  // 4. CONTACT FORM SUBMISSION DIRECTLY TO abhilashsalim09@gmail.com
  // Dispatches form submissions directly to the provided recipient email
  // ==========================================================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const statusAlert = document.getElementById('form-status-alert');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-send-message');
      const originalText = btn ? btn.textContent : 'Send Message';

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        if (statusAlert) {
          statusAlert.style.display = 'block';
          statusAlert.className = 'form-status-alert error';
          statusAlert.textContent = 'Please complete all fields before sending.';
        }
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Transmitting to abhilashsalim09@gmail.com...';
        btn.style.opacity = '0.75';
      }
      if (statusAlert) {
        statusAlert.style.display = 'block';
        statusAlert.className = 'form-status-alert info';
        statusAlert.textContent = 'Connecting to mail server...';
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/abhilashsalim09@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
            _subject: `New Security / VAPT Inquiry from ${name} (${email})`,
            _template: 'table'
          })
        });

        if (response.ok) {
          if (btn) {
            btn.textContent = '✓ Message Transmitted!';
            btn.style.background = '#0284c7';
            btn.style.color = '#ffffff';
          }
          if (statusAlert) {
            statusAlert.style.display = 'block';
            statusAlert.className = 'form-status-alert success';
            statusAlert.textContent = '✓ Your message was successfully sent to abhilashsalim09@gmail.com. Thank you!';
          }

          contactForm.reset();

          setTimeout(() => {
            if (btn) {
              btn.disabled = false;
              btn.textContent = originalText;
              btn.style.background = '';
              btn.style.color = '';
              btn.style.opacity = '1';
            }
            if (statusAlert) {
              statusAlert.style.display = 'none';
            }
          }, 6000);
        } else {
          throw new Error('Form service returned status ' + response.status);
        }
      } catch (err) {
        console.warn('Direct API submission encountered an error, falling back to mail client:', err);
        // Fallback: If network / CORS prevents API or first-time setup, open mailto link
        const mailtoUrl = `mailto:abhilashsalim09@gmail.com?subject=${encodeURIComponent('Security Inquiry from ' + name)}&body=${encodeURIComponent('Sender Name: ' + name + '\nSender Email: ' + email + '\n\nMessage:\n' + message)}`;
        
        window.location.href = mailtoUrl;

        if (btn) {
          btn.textContent = 'Dispatched to Mail Client';
          btn.style.background = '#0284c7';
          btn.style.color = '#ffffff';
        }
        if (statusAlert) {
          statusAlert.style.display = 'block';
          statusAlert.className = 'form-status-alert info';
          statusAlert.innerHTML = `Your message was transferred to your email app for <strong>abhilashsalim09@gmail.com</strong>. You can also write directly to <a href="mailto:abhilashsalim09@gmail.com" style="color: #0284c7; text-decoration: underline;">abhilashsalim09@gmail.com</a>.`;
        }

        setTimeout(() => {
          if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.opacity = '1';
          }
        }, 5000);
      }
    });
  }

  // ==========================================================================
  // 5. FLOATING NAVBAR (PERMANENTLY VISIBLE & ACTIVE WHILE SCROLLING)
  // Keeps the floating brand and navigation capsules elegantly visible as the user scrolls
  // ==========================================================================
  const navbar = document.querySelector('.navbar-wrapper');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
    }, { passive: true });
  }

});
