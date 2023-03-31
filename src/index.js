// import Masonry from 'masonry-layout';
// import imagesLoaded from 'imagesloaded';

// function createMansoryGallery() {
//   const grid = document.querySelector('.pictures');
//   const msnry = new Masonry(grid, {
//     itemSelector: '.pictures__item',
//     isFitWidth: true,
//     //   columnWidth: 200,
//     //   horizontalOrder: true,
//     percentPosition: true,
//     gutter: 10,
//   });

//   imagesLoaded(grid).on('progress', function () {
//     // layout Masonry after each image loads
//     msnry.layout();
//   });
// }

// import Muuri from 'muuri';
// import MagicGrid from 'magic-grid';

// let magicGrid = new MagicGrid({
//   container: '.container-grid',
//   items: 20,
//   static: true,
//   gutter: 30,
//   useMin: false,
// });
// import waterfall from 'waterfall.js/src/waterfall';
// waterfall('.container-grid');

// import StackUp from './js/simple-masonry.js';

// window.onload = function () {
//   // Create a stackup object.
//   var stackup = new StackUp({
//     containerSelector: '#gridContainer',
//     itemsSelector: '#gridContainer > .gridItem',
//     columnWidth: 240,
//   });
//   // Initialize stackup.
//   stackup.initialize();
// };

import { uhu } from 'uhugrid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import imageItemHbs from './templates/image-item.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import refsEl from './js/refs.js';
import { Images } from './js/fatchImages.js';

const refs = refsEl();

refs.form.addEventListener('submit', handleSubmitForm);
refs.imgList.addEventListener('click', handleClickImage);
(() => {
  window.addEventListener('scroll', throttle(checkPosition, 250));
  window.addEventListener('resize', throttle(checkPosition, 250));
})();

const images = new Images();

const optionsLightbox = {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
};

const lightbox = new SimpleLightbox('.gallery__item a', optionsLightbox);

Notify.init({
  width: '300px',
  position: 'right-top',
  closeButton: false,
  timeout: 3000,
  cssAnimation: true,
  cssAnimationDuration: 400,
  cssAnimationStyle: 'fade',
});

function handleClickImage(e) {
  if (e.target.nodeName === 'IMG') {
    lightbox.on('show.simplelightbox');
  }
}

function handleSubmitForm(e) {
  e.preventDefault();
  clearHTML();
  images.setFistPage();
  const query = e.target.elements.query.value.trim();

  if (!query) {
    return;
  }

  images.setValue(query);
  fatchImages();
}

function fatchImages() {
  images
    .fatchImages()
    .then(data => {
      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      console.log(data);
      renderHTML(data.hits);

      if (images.getPageNumber() === 1) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        uhu(2, 1);
        // 0, 1
      }

      lightbox.refresh();
      images.incrementPage();
    })
    .catch(err => {
      console.log(err);
    });
}

function renderHTML(data) {
  refs.imgList.insertAdjacentHTML('beforeend', imageItemHbs(data));
}

function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;

  const threshold = height - screenHeight / 2;
  const position = scrolled + screenHeight;

  if (position >= threshold) {
    fatchImages();
  }
}

function clearHTML() {
  refs.imgList.innerHTML = '';
}

function throttle(callee, timeout) {
  let timer = null;

  return function perform(...args) {
    if (timer) return;

    timer = setTimeout(() => {
      callee(...args);

      clearTimeout(timer);
      timer = null;
    }, timeout);
  };
}
