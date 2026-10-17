/* ═══════════════════════════════════════════════════════
   DEAN KLOOGE — Website JavaScript
   ═══════════════════════════════════════════════════════ */

// ── Navigation ──
const nav = document.getElementById('main-nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');

// Scroll-based nav styling
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section, footer');
const observerOptions = {
  root: null,
  rootMargin: '-40% 0px -60% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));


// ── Countdown Timer ──
function startCountdown() {
  // Release date: 29 October 2026, 19:00 Romanian time (EEST = UTC+3)
  const releaseDate = new Date('2026-10-29T19:00:00+03:00');

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const countdownEl = document.getElementById('countdown');
  const launchedEl = document.getElementById('release-launched');

  function update() {
    const now = new Date();
    const diff = releaseDate - now;

    if (diff <= 0) {
      // Released!
      countdownEl.style.display = 'none';
      launchedEl.style.display = 'flex';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');

    requestAnimationFrame(() => setTimeout(update, 1000));
  }

  update();
}

startCountdown();


// ── Video Carousel (optional) ──
const track = document.getElementById('carousel-track');
if (track) {
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  const cards = track.querySelectorAll('.video-card');

  let currentSlide = 0;
  let slidesPerView = 3;

  function calcSlidesPerView() {
    const width = window.innerWidth;
    if (width <= 768) return 1;
    if (width <= 1024) return 2;
    return 3;
  }

  function getTotalPages() {
    return Math.max(1, cards.length - slidesPerView + 1);
  }

  function updateCarousel() {
    slidesPerView = calcSlidesPerView();
    const totalPages = getTotalPages();
    if (currentSlide >= totalPages) currentSlide = totalPages - 1;

    // On desktop, use transform; on mobile, let scroll handle it
    if (window.innerWidth > 768) {
      const cardWidth = cards[0].offsetWidth + 24; // gap is 1.5rem = 24px
      track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    }

    // Update dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = `dot${i === currentSlide ? ' active' : ''}`;
      dot.addEventListener('click', () => {
        currentSlide = i;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    }
  }

  prevBtn?.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide--;
      updateCarousel();
    }
  });

  nextBtn?.addEventListener('click', () => {
    if (currentSlide < getTotalPages() - 1) {
      currentSlide++;
      updateCarousel();
    }
  });

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}


// ── YouTube Carousel ──
const ytTrack = document.getElementById('yt-track');
if (ytTrack) {
  const ytCards = ytTrack.querySelectorAll('.yt-card');
  const ytPrev = document.getElementById('yt-prev');
  const ytNext = document.getElementById('yt-next');
  const ytDotsContainer = document.getElementById('yt-dots');
  let ytCurrent = 0;

  function updateYtCarousel() {
    // Slide the track
    ytTrack.style.transform = `translateX(-${ytCurrent * 100}%)`;
    ytTrack.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';

    // Update dots
    ytDotsContainer.innerHTML = '';
    ytCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `yt-dot${i === ytCurrent ? ' active' : ''}`;
      dot.addEventListener('click', () => {
        ytCurrent = i;
        updateYtCarousel();
      });
      ytDotsContainer.appendChild(dot);
    });

    // Disable buttons at edges
    ytPrev.style.opacity = ytCurrent === 0 ? '0.3' : '1';
    ytPrev.style.pointerEvents = ytCurrent === 0 ? 'none' : 'auto';
    ytNext.style.opacity = ytCurrent === ytCards.length - 1 ? '0.3' : '1';
    ytNext.style.pointerEvents = ytCurrent === ytCards.length - 1 ? 'none' : 'auto';
  }

  ytPrev.addEventListener('click', () => {
    if (ytCurrent > 0) { ytCurrent--; updateYtCarousel(); }
  });

  ytNext.addEventListener('click', () => {
    if (ytCurrent < ytCards.length - 1) { ytCurrent++; updateYtCarousel(); }
  });

  updateYtCarousel();
}

// ── Video Modal ──
const modal = document.getElementById('video-modal');
const modalVideo = document.getElementById('modal-video');
const modalClose = document.getElementById('modal-close');

cards.forEach(card => {
  card.addEventListener('click', () => {
    const src = card.dataset.src;
    if (src) {
      modalVideo.src = src;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      modalVideo.play();
    }
  });
});

function closeModal() {
  modal.classList.remove('active');
  modalVideo.pause();
  modalVideo.src = '';
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});


// ── Merch Video on Hover ──
const merchItems = document.querySelectorAll('.merch-item:not(.merch-coming-soon)');
merchItems.forEach(item => {
  const video = item.querySelector('.merch-video');
  if (!video) return;

  item.addEventListener('mouseenter', () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  });

  item.addEventListener('mouseleave', () => {
    video.pause();
  });
});


// ── Scroll Reveal Animations ──
function addRevealClasses() {
  // About section
  const aboutText = document.querySelector('.about-text');
  const aboutImage = document.querySelector('.about-image');
  if (aboutText) aboutText.classList.add('reveal-left');
  if (aboutImage) aboutImage.classList.add('reveal-right');

  // Release card
  const releaseCard = document.querySelector('.release-card');
  if (releaseCard) releaseCard.classList.add('reveal');

  // Show rows
  document.querySelectorAll('.show-row').forEach((row, i) => {
    row.classList.add('reveal');
    row.style.transitionDelay = `${i * 0.1}s`;
  });

  // Merch items
  document.querySelectorAll('.merch-item').forEach((item, i) => {
    item.classList.add('reveal');
    item.style.transitionDelay = `${i * 0.15}s`;
  });

  // Video cards
  document.querySelectorAll('.video-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // Spotify
  const spotifyEmbed = document.querySelector('.spotify-embed');
  if (spotifyEmbed) spotifyEmbed.classList.add('reveal');

  // Section titles & subtitles
  document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
    el.classList.add('reveal');
  });

  // Contact
  const contactInfo = document.querySelector('.contact-info');
  if (contactInfo) contactInfo.classList.add('reveal');
}

addRevealClasses();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  root: null,
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.1
});

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});


// ── Parallax on Hero ──
const heroBg = document.querySelector('.hero-bg img');

function parallaxHero() {
  if (window.innerWidth <= 768) return;
  const scrolled = window.pageYOffset;
  const heroHeight = document.querySelector('.hero').offsetHeight;
  if (scrolled < heroHeight) {
    const parallaxOffset = scrolled * 0.35;
    heroBg.style.transform = `scale(1.05) translateY(${parallaxOffset}px)`;
  }
}

window.addEventListener('scroll', parallaxHero, { passive: true });


// ── Smooth Scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});


// ── Video thumbnail: seek a few seconds in for a better preview ──
document.querySelectorAll('.video-thumbnail video').forEach(video => {
  video.addEventListener('loadedmetadata', () => {
    // Seek to 10% of the video for a more interesting thumbnail
    video.currentTime = Math.min(video.duration * 0.1, 5);
  });
});
