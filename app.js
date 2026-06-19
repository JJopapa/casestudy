document.addEventListener('DOMContentLoaded', () => {
  
  // 0. 점진적 향상(Progressive Enhancement): 자바스크립트 활성화 클래스 즉시 추가
  document.body.classList.add('js-enabled');

  /* ==========================================================================
     1. MASK REVEAL ANIMATIONS (Intersection Observer)
     ========================================================================== */
  const revealOptions = {
    root: null,
    // 뷰포트 도달 100px 전부터 미리 렌더링되게 마진 부여하여 가림 증상 제거
    rootMargin: '100px 0px 100px 0px',
    threshold: 0.01 
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  const maskElements = document.querySelectorAll('.mask-reveal, .decision-card, .comparison-board, .leadership-col, .leadership-summary');
  maskElements.forEach(el => {
    // 히어로 섹션 타이틀 및 요약 스크린 내부 요소는 대기 없이 즉각 활성화
    if (el.classList.contains('hero-title') || el.closest('.summary-screen')) {
      setTimeout(() => {
        el.classList.add('active');
      }, 50);
      revealObserver.observe(el);
    } else {
      revealObserver.observe(el);
    }
  });

  /* ==========================================================================
     2. SEQUENTIAL METRIC REVEALS (SECTION 4)
     ========================================================================== */
  const impactCards = document.querySelectorAll('.impact-card');
  const impactOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px', // 약간 앞당겨서 로드
    threshold: 0.1
  };

  const impactObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, impactOptions);

  impactCards.forEach(card => {
    impactObserver.observe(card);
  });

  /* ==========================================================================
     3. HARD CUT SECTION THEME INVERSION
     ========================================================================== */
  const sectionImpact = document.getElementById('impact');
  const themeObserverOptions = {
    root: null,
    threshold: 0.1
  };

  const themeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
  }, themeObserverOptions);

  if (sectionImpact) {
    themeObserver.observe(sectionImpact);
  }

  /* ==========================================================================
     4. PARALLAX EFFECTS (HERO & ACTION SECTION)
     ========================================================================== */
  const microText = document.getElementById('hero-micro-text');
  const actionBgImg = document.getElementById('action-bg-img');
  const sectionAction = document.getElementById('action');
  const contextBgImg = document.getElementById('context-bg-img');
  const sectionContext = document.getElementById('context');
  
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateParallax = () => {
    // 1) Hero Section Parallax
    if (microText && lastScrollY < window.innerHeight * 2) {
      const parallaxOffset = lastScrollY * 0.12; 
      microText.style.setProperty('--parallax-y', `${parallaxOffset}px`);
    }

    // 1.5) Context Section Parallax (Challenge)
    if (contextBgImg && sectionContext) {
      const rect = sectionContext.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const relativeScroll = window.innerHeight - rect.top;
        const parallaxOffset = relativeScroll * -0.06; // 반대 방향으로 흐르도록 처리하여 차별화된 깊이감 부여
        contextBgImg.style.setProperty('--context-parallax-y', `${parallaxOffset}px`);
      }
    }

    // 2) Action Section Parallax (Leadership)
    if (actionBgImg && sectionAction) {
      const rect = sectionAction.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const relativeScroll = window.innerHeight - rect.top;
        const parallaxOffset = relativeScroll * 0.06; // 자연스러운 깊이감 계수
        actionBgImg.style.setProperty('--action-parallax-y', `${parallaxOffset}px`);
      }
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  /* ==========================================================================
     5. NAVIGATION CLICK FAIL-SAFE (강제 노출 안전장치)
     ========================================================================== */
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // 부드럽게 타겟 섹션으로 이동
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // 이동 직후 해당 섹션 내의 가려진 모든 애니메이션 요소를 강제 활성화(fail-safe)
        setTimeout(() => {
          targetSection.querySelectorAll('.mask-reveal, .decision-card, .comparison-board, .leadership-col, .leadership-summary').forEach(el => {
            el.classList.add('active');
          });
          targetSection.querySelectorAll('.impact-card').forEach(el => {
            el.classList.add('revealed');
          });
        }, 300); // 스크롤 이동 도중 또는 이동 직후 순차 노출
      }
    });
  });

  /* ==========================================================================
     6. CTA BUTTON INTERACTIVE FEEDBACK (자바스크립트 리스너 제거 - CSS :active로 대체)
     ========================================================================== */
});
