/* ============================================
   TANZILA KHAN PORTFOLIO - Refined Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  body.classList.add('loading');

  // ---------- Page Loader ----------
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      body.classList.remove('loading');
      startHeroAnimations();
    }, 1800);
  });

  // Fallback: hide loader after 3s even if load event already fired
  setTimeout(() => {
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      body.classList.remove('loading');
      startHeroAnimations();
    }
  }, 3000);

  // ---------- Custom Cursor ----------
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let cursorX = 0, cursorY = 0;
  let ringX = 0, ringY = 0;

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorDot.style.left = cursorX + 'px';
      cursorDot.style.top = cursorY + 'px';
    });

    function animateRing() {
      ringX += (cursorX - ringX) * 0.12;
      ringY += (cursorY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effects on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, [data-magnetic], [data-tilt], .skill-pills span, .project-link, .filter-btn');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hover');
        cursorRing.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover');
        cursorRing.classList.remove('hover');
      });
    });
  }

  // ---------- Navigation ----------
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileNav.classList.toggle('open');
    body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileNav.classList.remove('open');
      body.style.overflow = '';
    });
  });

  // Active nav link tracking
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  // ---------- Smooth Scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- Hero Animations ----------
  function startHeroAnimations() {
    // Title reveal
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('revealed'), 200 + delay);
    });

    // Typewriter effect
    const typewriterEl = document.getElementById('typewriter');
    const phrases = ['FULLSTACK AI ENGINEER', 'CS RESEARCHER', 'DEEP LEARNING ENTHUSIAST', 'COMPETITIVE PROGRAMMER'];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function typewrite() {
      const currentPhrase = phrases[phraseIdx];

      if (!deleting) {
        typewriterEl.textContent = '[ ' + currentPhrase.slice(0, charIdx + 1) + ' ]';
        charIdx++;
        if (charIdx === currentPhrase.length) {
          setTimeout(() => { deleting = true; typewrite(); }, 2000);
          return;
        }
        setTimeout(typewrite, 70);
      } else {
        typewriterEl.textContent = '[ ' + currentPhrase.slice(0, charIdx) + ' ]';
        charIdx--;
        if (charIdx < 0) {
          deleting = false;
          charIdx = 0;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(typewrite, 400);
          return;
        }
        setTimeout(typewrite, 40);
      }
    }
    setTimeout(typewrite, 600);

    // Stat cards with counter
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('visible');
        const numEl = card.querySelector('[data-count]');
        if (numEl) animateCounter(numEl);
      }, 800 + i * 250);
    });
  }

  // ---------- Counter Animation ----------
  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------- Network Canvas ----------
  const canvas = document.getElementById('networkCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animId;
    let nodes = [];
    let mouse = { x: -1000, y: -1000 };

    const colors = [
      { r: 13, g: 148, b: 104 },   // emerald
      { r: 52, g: 211, b: 153 },   // green-light
      { r: 217, g: 119, b: 6 },    // amber
      { r: 124, g: 58, b: 237 },   // violet
      { r: 225, g: 29, b: 72 },    // rose
      { r: 2, g: 132, b: 199 },    // sky
    ];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: rect.width, h: rect.height };
    }

    function init() {
      const { w, h } = resize();
      const nodeCount = Math.min(70, Math.floor((w * h) / 3500));
      nodes = [];

      for (let i = 0; i < nodeCount; i++) {
        const c = colors[Math.floor(Math.random() * colors.length)];
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 3.5 + 1.5,
          color: c,
          opacity: Math.random() * 0.4 + 0.25,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    let time = 0;
    function draw() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      ctx.clearRect(0, 0, w, h);
      time += 0.005;

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.1;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(13, 148, 104, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw nodes
      nodes.forEach(node => {
        // Mouse interaction
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120 * 0.2;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }

        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.99;
        node.vy *= 0.99;

        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
        node.x = Math.max(0, Math.min(w, node.x));
        node.y = Math.max(0, Math.min(h, node.y));

        // Pulsing opacity
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.1;
        const c = node.color;
        const r = node.r + pulse;

        // Glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 3);
        gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${node.opacity + pulse})`);
        gradient.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${node.opacity + pulse + 0.2})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      init();
      draw();
    });

    init();
    draw();
  }

  // ---------- Project Filters ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.category || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => card.classList.add('hidden'), 300);
        }
      });
    });
  });

  // ---------- Scroll Animations ----------
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('animated'), delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-fade-up], [data-fade-right], [data-fade-left]').forEach(el => {
    fadeObserver.observe(el);
  });

  // Counter animation for research highlights
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('[data-count]');
        if (numEl && !numEl.dataset.counted) {
          numEl.dataset.counted = 'true';
          animateCounter(numEl);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.research-highlight').forEach(el => {
    counterObserver.observe(el);
  });

  // ---------- Tilt Effect ----------
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -3;
        const rotateY = (x - centerX) / centerX * 3;

        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.5s ease';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    });
  }

  // ---------- Magnetic Buttons ----------
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s ease';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  }

  // ---------- Back to Top ----------
  const backToTop = document.getElementById('backToTop');
  const progressRing = document.getElementById('progressRing');
  const circumference = 2 * Math.PI * 20; // r=20

  function updateScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;

    // Show/hide button
    backToTop.classList.toggle('visible', scrollTop > 400);

    // Update progress ring
    if (progressRing) {
      progressRing.style.strokeDashoffset = circumference - (progress * circumference);
    }
  }

  window.addEventListener('scroll', updateScroll);
  updateScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
