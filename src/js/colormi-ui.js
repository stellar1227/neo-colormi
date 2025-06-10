document.addEventListener("DOMContentLoaded", () => {
  // 상품페이지 갤러리
  const thumbNailGallery = document.getElementById("thumbNailGallery");
  if (thumbNailGallery) {
    productImages(thumbNailGallery);
  }

  // 상품페이지 스티키 정보
  const productDetailBox = document.querySelector(".product-wrap");
  if (productDetailBox) {
    productStickyInfo(productDetailBox);
  }

  //loading lottie
  loadingLottie();

  //searchMenu Open, Close - header
  const searchMenu = document.querySelector('#searchWrap');
  const searchBtn = document.querySelector('#btnSearch');
  const searchCloseBtn = document.querySelector('#btnSearchClose');

  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchMenu.classList.add('--active');
  }
  );
  searchCloseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchMenu.classList.remove('--active');
  });

  //family site - header
  const familySite = document.querySelector('#quickMenu');
  const familySiteBtn = document.querySelector('#btnQuickMenuSelect');
  familySiteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    familySite.classList.toggle('--active');
    e.target.closest('.quick-menu-wrap').classList.toggle('--active');
  }
  );

  //gnb menu - header
  initGnb();
  initSnb();

  // 간편주문 토글
  setupOptionToggle();
  // faq 목록
  initFaqToggle('.table-list.--faq-list');
  // 고객센터 탭
  initTabs('.tab-item .btn-wrap.--tab', 'button', '.tab-cont', '--active');

  // main swiper - main-banner / product-review / blog-list
  const mainWrap = document.querySelector('.main-wrap');
  if (mainWrap) {
    const swipers = [
      { selector: '.main-banner', init: initMainBannerSwiper },
      { selector: '.product-review', init: initProductReviewSwiper },
      { selector: '.blog-list', init: initBlogListSwiper, onResize: true },
    ];

    swipers.forEach(({ selector, init, onResize }) => {
      const el = mainWrap.querySelector(selector);
      if (!el) return;
      init(el);

      if (onResize) {
        window.addEventListener('resize', () => init(el));
      }
    });
  }

});

// main swiper - main-banner
function initMainBannerSwiper() {
  new Swiper('.main-wrap .main-banner', {
    loop: true,
    navigation: {
      prevEl: '.visual-prev',
      nextEl: '.visual-next'
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
      renderFraction: function (currentClass, totalClass) {
        var allSlides = Array.prototype.slice.call(this.slides);
        var realSlides = allSlides.filter(function (slide) {
          return !slide.classList.contains('swiper-slide-duplicate');
        });
        var realTotal = realSlides.length;
        var current = this.realIndex + 1;
        return '<span class="' + currentClass + '">' + current + '</span>' +
          '<span class="' + totalClass + '">' + realTotal + '</span>';
      }
    }
  });
}

// main swiper - product-review
function initProductReviewSwiper() {
  var container = document.querySelector('.main-wrap .product-review');
  var wrapper = container.querySelector('.swiper-wrapper');
  var slides = wrapper.querySelectorAll('.swiper-slide');
  var origCount = slides.length;

  if (origCount > 0 && !wrapper.dataset.duplicated) {
    wrapper.innerHTML += wrapper.innerHTML;
    wrapper.dataset.duplicated = 'true';
  }
  var swiper = new Swiper(container, {
    loop: true,
    freeMode: true,
    freeModeMomentum: false,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false
    },
    speed: 2000,
    loopedSlides: wrapper.querySelectorAll('.swiper-slide').length,
    slidesPerView: 'auto'
  });
  var defaultSpeed = swiper.params.speed;

  var items = document.querySelectorAll('.main-wrap .product-review .item a');
  for (var i = 0; i < items.length; i++) {
    (function (item) {
      item.addEventListener('mouseenter', function () {
        swiper.autoplay.stop();
        swiper.params.speed = defaultSpeed;
        swiper.update();
      });
      item.addEventListener('mouseleave', function () {
        swiper.params.speed = defaultSpeed;
        swiper.update();
        swiper.autoplay.start();
      });
    })(items[i]);
  }
}

// main swiper - blog-list
var blogListSwiper = null;

function padBlankSlides() {
  const wrapper = document.querySelector('.main-wrap .blog-list .swiper-wrapper');
  if (!wrapper) return;

  const realSlides = wrapper.querySelectorAll('.swiper-slide:not(.blank-slide)');
  const perGroup = 6;
  const remainder = realSlides.length % perGroup;

  if (remainder !== 0) {
    const blanksNeeded = perGroup - remainder;
    for (let i = 0; i < blanksNeeded; i++) {
      const blankSlide = document.createElement('div');
      blankSlide.className = 'swiper-slide blank-slide';
      wrapper.appendChild(blankSlide);
    }
  }
}

function initBlogListSwiper() {
  var selector = '.main-wrap .blog-list';
  if (window.innerWidth > 565 && !blogListSwiper) {
    padBlankSlides();
    blogListSwiper = new Swiper(selector, {
      loop: false,
      navigation: {
        prevEl: '.print-prev',
        nextEl: '.print-next'
      },
      slidesPerView: 6,
      slidesPerGroup: 6,
      spaceBetween: 20,
      loopFillGroupWithBlank: true,
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });
  } else if (window.innerWidth <= 565 && blogListSwiper) {
    blogListSwiper.destroy(true, true);
    blogListSwiper = null;
  }
}

// 상품페이지 간편주문 토글
function setupOptionToggle() {
  const toggleBoxes = document.querySelectorAll('[data-option="--option-toggle"] input[type="checkbox"]');
  const defaultOptions = document.querySelectorAll('[data-option-target="--option-default"]');
  const simpleOptions = document.querySelectorAll('[data-option-target="--option-simple"]');
  const radioOptions = document.querySelectorAll('[data-option-target="--option-radio"]');

  const updateAll = (checked) => {
    defaultOptions.forEach(el => {
      el.style.display = checked ? 'none' : '';
    });
    simpleOptions.forEach(el => {
      el.style.display = checked ? '' : 'none';
    });
    radioOptions.forEach(el => {
      el.classList.toggle('img-option', !checked);
    });
  };

  toggleBoxes.forEach(checkbox => {
    updateAll(checkbox.checked);
    checkbox.addEventListener('change', () => {
      updateAll(checkbox.checked);
    });
  });
}

// 상품페이지 갤러리
function productImages(target) {
  const thumbNailGallery = target;
  const imgItemWrap = thumbNailGallery.querySelector(".img-item-wrap");
  const imgItems = imgItemWrap.querySelectorAll(".img-item");
  const btnPrev = thumbNailGallery.querySelector(".btn-prev");
  const btnNext = thumbNailGallery.querySelector(".btn-next");
  const imgDetail = thumbNailGallery.querySelector(".product-img-detail img");
  let currentIndex = 0;
  const imgItemLength = imgItems.length;
  const MARGIN_TOP = 12;
  const itemListNum = 4;
  const imgItemHeight = imgItems[0].offsetHeight + MARGIN_TOP;

  imgItems[0].classList.add("--selected");

  btnPrev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      imgItemWrap.style.transform =
        `translateY(-${currentIndex * imgItemHeight + MARGIN_TOP}px)`;
    } else {
      alert('첫번째 이미지입니다.');
    }
  });

  btnNext.addEventListener("click", () => {
    if (currentIndex < imgItemLength - itemListNum) {
      currentIndex++;
      imgItemWrap.style.transform =
        `translateY(-${currentIndex * imgItemHeight + MARGIN_TOP}px)`;
    } else {
      alert('마지막 이미지입니다.');
    }
  });

  // imgItems에 마우스엔터 시 product-img-detail에 해당 이미지 보여주기
  imgItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      imgItems.forEach(i => i.classList.remove("--selected"));
      item.classList.add("--selected");
      imgDetail.src = item.querySelector("img").src;
    });
  });
}

// 상품페이지 스티키 정보
function productStickyInfo(target) {
  if (!(target instanceof HTMLElement)) return;

  const productDetailBox = target;
  const productInfo = document.querySelector(".product-inner");
  if (!productInfo) return;

  const productInfoHeight = productInfo.offsetHeight;
  const productInfoTop = productInfo.getBoundingClientRect().top + window.scrollY;
  const parentContentBox = productDetailBox.closest(".content-box");
  const nextContentBox = parentContentBox ? parentContentBox.nextElementSibling : null;

  // 탭 해시링크 product-tab-pseudo-style 생성
  const selectors = [
    "#product-contact",
    "#product-delivery",
    "#product-detail",
    "#product-review"
  ];
  let styleEl = document.getElementById("product-tab-pseudo-style");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "product-tab-pseudo-style";
    document.head.appendChild(styleEl);
  }
  const EXTRA = 40; // 상단 마진 값
  const buildRule = height => {
    const totalHeight = height + EXTRA;
    return selectors.map(sel => `${sel}::before { height: ${totalHeight}px; margin-top: -${totalHeight}px; }`).join("\n");
  };

  const updateMinHeight = () => {
    if (productDetailBox.classList.contains("scroll")) return;
    if (parentContentBox) {
      parentContentBox.style.minHeight = `${productDetailBox.offsetHeight}px`;
    }
  };
  updateMinHeight();

  const ro = new ResizeObserver(updateMinHeight);
  ro.observe(productDetailBox);
  window.addEventListener("resize", updateMinHeight);

  let isTicking = false;
  window.addEventListener("scroll", () => {
    if (isTicking) return;
    isTicking = true;
    window.requestAnimationFrame(() => {
      const scrollTop = window.scrollY;

      if (scrollTop > productInfoTop + productInfoHeight) {
        productDetailBox.classList.add("scroll");
        if (nextContentBox && nextContentBox.classList.contains("content-box")) {
          nextContentBox.style.paddingTop = `${productDetailBox.offsetHeight}px`;
        }
        const h = productDetailBox.offsetHeight;
        styleEl.textContent = buildRule(h);
      } else {
        productDetailBox.classList.remove("scroll");
        if (nextContentBox && nextContentBox.classList.contains("content-box")) {
          nextContentBox.style.paddingTop = "";
        }
        updateMinHeight();
        styleEl.textContent = "";
      }

      isTicking = false;
    });
  });
}

// loading lottie
function loadingLottie() {
  const ACTIVE_CLASS = '--active';

  const animConfig = {
    loading: '/resources/fe/img/assets/loading.json',
  };

  const animDataCache = new Map();
  function fetchAnimData(type) {
    if (!animConfig[type]) return Promise.reject(new Error(`Unknown anim type: ${type}`));
    if (animDataCache.has(type)) return animDataCache.get(type);
    const p = fetch(animConfig[type]).then(res => res.json());
    animDataCache.set(type, p);
    return p;
  }

  const animMap = new WeakMap();

  function getAnimType(item) {
    return item.dataset.animType;
  }

  function startAnimation(item) {
    const type = getAnimType(item);
    if (!type) return;
    const container = item.querySelector('.anim-item');
    if (!container || animMap.has(container)) return;

    fetchAnimData(type).then(data => {
      if (!item.classList.contains(ACTIVE_CLASS)) return;

      const anim = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: data
      });
      anim.play();
      animMap.set(container, anim);
    }).catch(console.error);
  }

  function stopAnimation(item) {
    const container = item.querySelector('.anim-item');
    const anim = container && animMap.get(container);
    if (anim) {
      anim.destroy();
      container.innerHTML = '';
      animMap.delete(container);
    }
  }

  document.querySelectorAll(`.anim-item-wrap.${ACTIVE_CLASS}`)
    .forEach(startAnimation);

  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        const el = m.target;
        if (!el.classList.contains('anim-item-wrap')) return;
        if (el.classList.contains(ACTIVE_CLASS)) startAnimation(el);
        else stopAnimation(el);
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['class']
  });
}

// gnb menu - header
function initGnb() {
  const MOBILE_BREAKPOINT = 768;
  const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const body = document.body;

  const menuButtons = document.querySelectorAll(
    '.gnb .depth-1 a[data-menu-index], .util-menu .btn-catg[data-menu-index]'
  );
  const submenuWraps = document.querySelectorAll('.all-menu-wrap[data-menu-index]');
  submenuWraps.forEach(wrap => wrap.classList.remove('--open'));

  function handleMenuButtonClick(e) {
    e.preventDefault();
    const idx = e.currentTarget.dataset.menuIndex;
    const targetWrap = Array.from(submenuWraps).find(w => w.dataset.menuIndex === idx);
    const isAlreadyOpen = targetWrap && targetWrap.classList.contains('--open');

    if (!mobileQuery.matches && isAlreadyOpen) {
      targetWrap.classList.remove('--open');
      e.currentTarget.parentElement.classList.remove('--active');
      body.classList.remove('inactive');
      return;
    }

    submenuWraps.forEach(wrap => {
      wrap.classList.toggle('--open', wrap.dataset.menuIndex === idx);
    });
    if (!mobileQuery.matches) {
      menuButtons.forEach(btn => btn.parentElement.classList.remove('--active'));
      e.currentTarget.parentElement.classList.add('--active');
    }

    const anyOpen = Array.from(submenuWraps)
      .some(wrap => wrap.classList.contains('--open'));
    body.classList.toggle('inactive', anyOpen);
  }
  menuButtons.forEach(btn =>
    btn.addEventListener('click', handleMenuButtonClick)
  );

  // 모바일 세브메뉴
  const mobileToggleItems = document.querySelectorAll(
    '.all-menu-wrap .category .depth-1, .all-menu-wrap .btn-familysite'
  );
  mobileToggleItems.forEach(item => {
    item.addEventListener('click', e => {
      if (!mobileQuery.matches) return;
      e.currentTarget.classList.toggle('--active');
    });
  });

  // 닫기
  const mobileCloseButtons = document.querySelectorAll('.all-menu-wrap .btn-close');
  mobileCloseButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      const wrap = e.currentTarget.closest('.all-menu-wrap');
      if (!wrap) return;
      wrap.classList.remove('--open');
      const idx = wrap.dataset.menuIndex;
      const relatedBtn = Array.from(menuButtons)
        .find(b => b.dataset.menuIndex === idx);
      if (relatedBtn) relatedBtn.parentElement.classList.remove('--active');

      const anyOpen = Array.from(submenuWraps)
        .some(w => w.classList.contains('--open'));
      if (!anyOpen) body.classList.remove('inactive');
    });
  });

  document.addEventListener('click', e => {
    if (
      !e.target.closest('.gnb, .header-top .util-menu-wrap')
      && !e.target.closest('.all-menu-wrap')
    ) {
      submenuWraps.forEach(wrap => wrap.classList.remove('--open'));
      if (!mobileQuery.matches) {
        menuButtons.forEach(btn =>
          btn.parentElement.classList.remove('--active')
        );
      }
      body.classList.remove('inactive');
    }
  });

  // 리사이즈 시 리셋
  mobileQuery.addEventListener('change', ev => {
    if (!ev.matches) {
      mobileToggleItems.forEach(item =>
        item.classList.remove('--active')
      );
      submenuWraps.forEach(wrap =>
        wrap.classList.remove('active')
      );
      menuButtons.forEach(btn =>
        btn.parentElement.classList.remove('--active')
      );
      body.classList.remove('inactive');
    }
  });
}

function initSnb() {
  const navs = document.querySelectorAll('.all-menu-wrap');

  navs.forEach(nav => {
    const group = nav.getAttribute('data-menu-index');
    const menuItems = nav.querySelectorAll(`.depth-3[data-group="${group}"] a`);
    const productBoxes = nav.querySelectorAll(`.inner-header-product[data-group="${group}"]`);

    menuItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const parentItem = item.closest('.depth-3');
        const index = parentItem.getAttribute('data-index');

        productBoxes.forEach(box => box.classList.remove('active'));
        const targetBox = nav.querySelector(`.inner-header-product[data-index="${index}"]`);
        if (targetBox) targetBox.classList.add('active');
      });
    });

    const observer = new MutationObserver(() => {
      const isOpen = getComputedStyle(nav).display !== 'none';

      if (isOpen) {
        productBoxes.forEach((box, i) => {
          box.classList.toggle('active', i === 0);
        });
      } else {
        productBoxes.forEach(box => {
          box.classList.remove('active');
        });
      }
    });

    observer.observe(nav, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  });
}

function initFaqToggle(faqContainerSelector) {
  const container = document.querySelector(faqContainerSelector);
  if (!container) return;

  container.querySelectorAll('.item.--answer').forEach(el => {
    el.classList.remove('--active');
  });

  container.querySelectorAll('.item.--question').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const answer = link.closest('.list-item').querySelector('.item.--answer');
      if (answer) {
        answer.classList.toggle('--active');
      }
    });
  });
}

function initTabs(tabWrapperSelector, buttonSelector, contentSelector, activeClass) {
  const wrapper = document.querySelector(tabWrapperSelector);
  if (!wrapper) return;
  const buttons = Array.from(wrapper.querySelectorAll(buttonSelector));
  const contents = Array.from(document.querySelectorAll(contentSelector));

  function activate(index) {
    buttons.forEach((btn, i) => btn.classList.toggle(activeClass, i === index));
    contents.forEach((cnt, i) => cnt.style.display = (i === index ? 'block' : 'none'));
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => activate(i));
  });

  activate(0);
}