export default function refsEl() {
  return {
    form: document.querySelector('.search-form'),
    imgList: document.querySelector('.gallery-all'),
    sizeRange: document.querySelector('[data-volume="size"]'),
    heightRange: document.querySelector('[data-volume="height"]'),
  };
}
