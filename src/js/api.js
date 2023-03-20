const API_KEY = '34553245-0215fc3b52d59e1d2b85f0996';
const BASE_URL = 'https://pixabay.com/api';
const options = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: API_KEY,
  },
};

export default class ApiSrvice {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchImg() {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
    const response = await fetch(url); //коли додаю в параметри опції,то код ламається по CORS чому?
    const { hits } = await response.json();
    this.incrementPage();
    return hits;
  }

  resetPage() {
    this.page = 1;
  }
  incrementPage() {
    this.page += 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
