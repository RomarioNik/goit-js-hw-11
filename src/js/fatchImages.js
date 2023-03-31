import axios from 'axios';

export class Images {
  #BASE_URL = 'http://pixabay.com/api/';
  #options = {
    params: {
      key: '33934999-d2cb520cb2e3ec608d0042eac',
      q: null,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: 1,
      per_page: 40,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fatchImages() {
    return axios
      .get(`${this.#BASE_URL}`, this.#options)
      .then(({ data }) => {
        return data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  incrementPage() {
    this.#options.params.page += 1;
  }

  setFistPage() {
    this.#options.params.page = 1;
  }

  getPageNumber() {
    return this.#options.params.page;
  }

  setValue(value) {
    this.#options.params.q = value;
  }

  getvalue() {
    return this.#options.params.q;
  }
}
