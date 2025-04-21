document.addEventListener("DOMContentLoaded", () => {
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
  
  btnPrev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      imgItemWrap.style.transform = `translateY(-${currentIndex === 0 ? MARGIN_TOP : (currentIndex * imgItemHeight) + MARGIN_TOP }px)`;
      return;
    }
    alert('첫번째 이미지입니다.')
  });

  btnNext.addEventListener("click", () => {
    if (currentIndex < imgItemLength - itemListNum) {
      currentIndex++;
      imgItemWrap.style.transform = `translateY(-${currentIndex === imgItemLength - itemListNum ? MARGIN_TOP : (currentIndex * imgItemHeight) + MARGIN_TOP }px)`;
      return;
    }
    alert('마지막 이미지입니다.')
  });


  // imgItems에 마우스엔터 시 product-img-detail에 해당 이미지 보여주기
  imgItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      imgDetail.src = item.querySelector("img").src;
    });
  });
});
