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
  const activeClass = '--active';
  const initialized = new WeakSet();

  const initSpinner = (parent) => {
    const spinner = parent.querySelector('.loadingSpinner');
    if (!spinner || initialized.has(spinner)) return;
    const anim = lottie.loadAnimation({
      container: spinner,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: './img/assets/loading.json'
    });
    anim.setSpeed(1);
    initialized.add(spinner);
  };

  document.querySelectorAll(`.loading-item.${activeClass}`)
    .forEach(initSpinner);

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (
        m.type === 'attributes' &&
        m.attributeName === 'class'
      ) {
        const el = m.target;
        if (
          el.classList.contains('loading-item') &&
          el.classList.contains(activeClass)
        ) {
          initSpinner(el);
        }
      }
    }
  });

  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['class']
  });
});