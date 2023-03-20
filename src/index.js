import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import ApiService from './js/api';
axios.defaults.baseURL = 'https://pixabay.com/api/';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
});

const apiService = new ApiService();

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', fetchGallery);

function onSearch(e) {
  e.preventDefault();

  apiService.query = e.currentTarget.elements.searchQuery.value.trim();
  if (!apiService.query) {
    return Notify.failure(
      'Sorry, the search field cannot be empty. Please enter information to search.'
    );
  }

  apiService.resetPage();
  apiService.fetchImg().then(hits => {
    if (hits.length !== 0) {
      refs.loadMoreBtn.classList.remove('hidden');
    }
    message(hits);

    clearGallery();
    createMurckup(hits);
  });
}

function fetchGallery() {
  apiService.fetchImg().then(hits => {
    stopSearch(hits);
    createMurckup(hits);
  });
}

function createMurckup(hits) {
  const murckup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        downloads,
        views,
        comments,
      }) => {
        return `<div class="photo-card"><a class="gallery-link" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
        <p class="info-item">
            <b>Likes ${likes}</b>
        </p>
        <p class="info-item">
            <b>Views ${views}</b>
        </p>
        <p class="info-item">
            <b>Comments ${comments}</b>
        </p>
        <p class="info-item">
            <b>Downloads ${downloads}</b>
        </p>
    </div>
</div>`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', murckup);
  lightbox.refresh();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
function message(hits) {
  if (hits.length === 0) {
    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function stopSearch(hits) {
  if (hits.length < 40) {
    refs.loadMoreBtn.classList.add('hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
