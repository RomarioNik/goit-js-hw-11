import { uhu } from 'uhugrid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import imageItemHbs from './templates/image-item.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import refsEl from './js/refs.js';
import { Images } from './js/fatchImages.js';
import throttle from 'lodash.throttle';

const refs = refsEl();

refs.form.addEventListener('submit', handleSubmitForm);
refs.imgList.addEventListener('click', handleClickImage);
window.addEventListener('scroll', throttle(checkPosition, 300));

const images = new Images();

const lightbox = new SimpleLightbox('.gallery a', {});

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
  e.target.elements.query.value = '';
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
      renderHTML(data.hits);

      if (images.getPageNumber() === 1) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        uhu(2, 2);
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
    smoothScroll();
  }
}

function clearHTML() {
  refs.imgList.innerHTML = '';
}

const smoothScroll = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery-all')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};
