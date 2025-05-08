document.addEventListener("DOMContentLoaded", () => {
  //상품페이지 갤러리
  const thumbNailGallery = document.getElementById("thumbNailGallery");
  if(thumbNailGallery) return productImages(thumbNailGallery);

  //상품페이지 스티키 정보
  const productImgDetail = document.querySelector(".product-wrap");
  if(productImgDetail) return productStickyInfo(productImgDetail);

  //loading lottie
  loadingLottie();

  //main swiper
  new Swiper('.my-swiper', {
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 20,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
      renderFraction: function (currentClass, totalClass) {
        const realSlides = Array.from(this.slides).filter(
          slide => !slide.classList.contains('swiper-slide-duplicate')
        );
        const realTotal = realSlides.length;
        const current = this.realIndex + 1;

        return `<span class="${currentClass}">${current}</span>` +
          `<span class="${totalClass}">${realTotal}</span>`;
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

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

});


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
      imgItemWrap.style.transform = `translateY(-${currentIndex === 0 ? MARGIN_TOP : (currentIndex * imgItemHeight) + MARGIN_TOP}px)`;
      return;
    }
    alert('첫번째 이미지입니다.')
  });

  btnNext.addEventListener("click", () => {
    if (currentIndex < imgItemLength - itemListNum) {
      currentIndex++;
      imgItemWrap.style.transform = `translateY(-${currentIndex === imgItemLength - itemListNum ? MARGIN_TOP : (currentIndex * imgItemHeight) + MARGIN_TOP}px)`;
      return;
    }
    alert('마지막 이미지입니다.')
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

function productStickyInfo(target) {
  const productImgDetail = target;
  const productInfo = document.querySelector(".product-inner");
  const productInfoHeight = productInfo.offsetHeight;
  const productInfoTop = productInfo.getBoundingClientRect().top + window.scrollY;

  const parentContentBox = productImgDetail.closest(".content-box");
  const nextContentBox = parentContentBox && parentContentBox.nextElementSibling;

  if (parentContentBox) {
    parentContentBox.style.height = `${productImgDetail.offsetHeight}px`;
  }

  let timer = null;

  window.addEventListener("scroll", () => {
    if (!timer) {
      timer = setTimeout(() => {
        const scrollTop = window.scrollY;
        if (scrollTop > productInfoTop + productInfoHeight) {
          productImgDetail.classList.add("scroll");

          if (nextContentBox && nextContentBox.classList.contains("content-box")) {
            nextContentBox.style.paddingTop = `${productImgDetail.offsetHeight}px`;
          }
        } else {
          productImgDetail.classList.remove("scroll");

          if (nextContentBox && nextContentBox.classList.contains("content-box")) {
            nextContentBox.style.paddingTop = "";
          }
        }
        timer = null;
      }, 0);
    }
  });
}

function loadingLottie() {
  const ACTIVE_CLASS = '--active';

  const animConfig = {
    loading: './img/assets/loading.json',
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

function initGnb(){
  const links = document.querySelectorAll('.gnb .depth-1 a[data-menu-index]');
  const wraps = document.querySelectorAll('.all-menu-wrap[data-menu-index]');

  wraps.forEach(w => w.style.display = 'none');

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const idx = link.dataset.menuIndex;

      wraps.forEach(w => {
        if (w.dataset.menuIndex === idx) {
          w.style.display = 'block';
        } else {
          w.style.display = 'none';
        }
      });
      links.forEach(a => a.parentElement.classList.remove('--active'));
      link.parentElement.classList.add('--active');
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.gnb') && !e.target.closest('.all-menu-wrap')) {
      wraps.forEach(w => w.style.display = 'none');
      links.forEach(a => a.parentElement.classList.remove('--active'));
    }
  });
}