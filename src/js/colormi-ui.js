document.addEventListener("DOMContentLoaded", () => {
  //상품페이지 갤러리
  productImages();

  //상품페이지 스티키 정보
  productStickyInfo();



});


function productImages() {
  const thumbNailGallery = document.getElementById("thumbNailGallery");
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


function productStickyInfo() {
  const productImgDetail = document.querySelector(".product-wrap");
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

document.addEventListener('DOMContentLoaded', () => {
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
});

document.addEventListener('DOMContentLoaded', () => {
  new Swiper('.my-swiper', {
    loop: true,
    centeredSlides: true,    // 활성 슬라이드를 가운데로
    slidesPerView: 1,      // 한 화면에 1.2개 보여줘서 옆에 0.2개 보이게
    spaceBetween: 20,        // 슬라이드 사이 간격
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
          ` / ` +
          `<span class="${totalClass}">${realTotal}</span>`;
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
});
