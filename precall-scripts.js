/* LANEY MEDIA PRE-CALL PAGE — Scripts */

/* Horizontal scroll drag for proof sections */
document.querySelectorAll('.proof-warm-scroll, .proof-img-scroll').forEach(container => {
  let isDown = false, startX, scrollLeft;
  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.style.cursor = 'grabbing';
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });
  container.addEventListener('mouseleave', () => { isDown = false; container.style.cursor = 'grab'; });
  container.addEventListener('mouseup', () => { isDown = false; container.style.cursor = 'grab'; });
  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    container.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
});

/* FAQ Accordion */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const toggle = q.querySelector('.faq-toggle');
    const isOpen = answer.style.display !== 'none';

    // Close all
    document.querySelectorAll('.faq-item').forEach(fi => {
      fi.querySelector('.faq-a').style.display = 'none';
      fi.querySelector('.faq-toggle').textContent = '+';
    });

    // Open clicked (if was closed)
    if (!isOpen) {
      answer.style.display = 'block';
      toggle.textContent = '−';
    }
  });
});

/* Brain diagram trigger pill hover effects */
document.querySelectorAll('.trigger-pill').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    pill.style.transform = (pill.style.transform || '') + ' scale(1.08)';
    pill.style.zIndex = '10';
    pill.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.transform = pill.style.transform.replace(' scale(1.08)', '');
    pill.style.zIndex = '3';
    pill.style.boxShadow = 'none';
  });
});

/* Trigger strip item hover */
document.querySelectorAll('.trigger-strip-item').forEach(item => {
  item.style.cursor = 'pointer';
  item.style.transition = 'background 0.3s ease';
  item.addEventListener('mouseenter', () => {
    item.style.background = 'rgba(94, 60, 40, 0.12)';
  });
  item.addEventListener('mouseleave', () => {
    item.style.background = 'transparent';
  });
});

/* Smooth scroll for nav links and CTA buttons */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* Intersection Observer for fade-in animations */
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.converts-header, .expect-step, .pillar-block, .faq-item, .quote-cell').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});

/* Nav background on scroll */
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(10, 8, 6, 0.98)';
    } else {
      nav.style.background = 'rgba(10, 8, 6, 0.92)';
    }
  });
}
