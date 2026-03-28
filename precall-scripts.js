/* LANEY MEDIA PRE-CALL PAGE — Scripts */

/* Run immediately — this script is dynamically loaded after DOM is already complete */
(function() {

/* FIX: Move orphaned phase-content cards into .brain-phases scroll container */
/* Uses retry loop because dynamically-loaded script may execute before all embeds are parsed */
(function fixBrainPhases(attempt) {
  attempt = attempt || 0;
  const brainPhases = document.querySelector('.brain-phases');
  if (!brainPhases) return;

  // Gather all .phase-content elements that are NOT inside .brain-phases
  const allPhases = document.querySelectorAll('.phase-content');

  // If we don't see all 3 phases yet and haven't exceeded retries, wait and try again
  if (allPhases.length < 3 && attempt < 20) {
    setTimeout(function() { fixBrainPhases(attempt + 1); }, 100);
    return;
  }

  allPhases.forEach(pc => {
    if (!brainPhases.contains(pc)) {
      brainPhases.appendChild(pc);
    }
  });

  // Mark first phase as active
  const firstPhase = brainPhases.querySelector('.phase-content');
  if (firstPhase) firstPhase.classList.add('active');

  // Remove any now-empty w-embed wrappers inside brain-phases-wrapper
  const wrapper = document.querySelector('.brain-phases-wrapper');
  if (wrapper) {
    wrapper.querySelectorAll('.w-embed').forEach(embed => {
      if (embed.children.length === 0 || embed.innerHTML.trim() === '') {
        embed.remove();
      }
    });
  }

  // Horizontal drag scroll for brain phases
  let isDown = false, startX, scrollLeft;
  brainPhases.addEventListener('mousedown', (e) => {
    isDown = true;
    brainPhases.style.cursor = 'grabbing';
    startX = e.pageX - brainPhases.offsetLeft;
    scrollLeft = brainPhases.scrollLeft;
  });
  brainPhases.addEventListener('mouseleave', () => { isDown = false; brainPhases.style.cursor = 'grab'; });
  brainPhases.addEventListener('mouseup', () => { isDown = false; brainPhases.style.cursor = 'grab'; });
  brainPhases.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - brainPhases.offsetLeft;
    brainPhases.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

  // Update active phase + indicator on scroll
  function updateActivePhase() {
    const cards = brainPhases.querySelectorAll('.phase-content');
    const containerCenter = brainPhases.scrollLeft + brainPhases.clientWidth / 2;
    let closestIdx = 0, closestDist = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < closestDist) { closestDist = dist; closestIdx = i; }
    });
    cards.forEach((c, i) => c.classList.toggle('active', i === closestIdx));

    // Update phase indicator pips
    const pips = document.querySelectorAll('.phase-pip');
    pips.forEach((pip, i) => {
      pip.style.background = i === closestIdx ? 'var(--cognac)' : 'var(--heritage)';
    });
  }
  brainPhases.addEventListener('scroll', updateActivePhase);

  // Phase indicator click navigation
  document.querySelectorAll('.phase-pip').forEach((pip, i) => {
    pip.style.cursor = 'pointer';
    pip.addEventListener('click', () => {
      const cards = brainPhases.querySelectorAll('.phase-content');
      if (cards[i]) cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });

  // Scroll arrow click
  const scrollArrow = document.querySelector('.scroll-arrow, .arrow-circle');
  if (scrollArrow) {
    scrollArrow.style.cursor = 'pointer';
    scrollArrow.addEventListener('click', () => {
      brainPhases.scrollBy({ left: brainPhases.clientWidth * 0.85, behavior: 'smooth' });
    });
  }
})();

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

/* Trigger strip item click to scroll to detail */
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

})(); /* end IIFE */
