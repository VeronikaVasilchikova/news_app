const newsService = (function() {
 const appKey = '0b27e843a7f049439c7539230fe15dcd';
 const apiUrl = 'https://newsapi.org/v2';

 return {
   topHeadLines(country = 'ua', cb) {
     fetch(`${apiUrl}/top-headlines?country=${country}&apiKey=${appKey}`)
      .then(response => {
        return response.json();
      })
      .then(response => {
        removePreloader();
        renderNews(response.articles);
      })
      .catch(err => {
        showAlert(err, 'error-msg');
      });
   },
   everything(query, cb) {
     fetch(`${apiUrl}/everything?q=${query}&apiKey=${appKey}`)
      .then(response => {
        return response.json();
      })
      .then(response => {
        removePreloader();
        renderNews(response.articles);
      })
      .catch(err => {
        showAlert(err, 'error-msg');
      });
   }
 };
})();

//  init selects
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
  loadNews();
});

const form = document.forms['newsControls'];
const countrySelect = form.elements['country'];
const searchInput = form.elements['search'];

// add event to form submitting
form.addEventListener('submit', e => {
  e.preventDefault();
  loadNews();
})

// load news in dependence on chosen endpoints
function loadNews() {
  showPreloader();
  const country = countrySelect.value;
  const searchText = searchInput.value;

  if(!searchText) {
    newsService.topHeadLines(country);
  } else {
    newsService.everything(searchText);
  }
  
}

// draw fiels with news
function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row');
  if(newsContainer.children.length) {
    clearContainer(newsContainer);
  }
  let fragment = '';
  news.forEach(item => {
    const el = newsTemplate(item);
    fragment = el;
    newsContainer.insertAdjacentHTML('afterbegin', fragment);
  });
  
}

// clear field after new request
function clearContainer(container) {
  let child = container.lastElementChild;
  while(child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

// draw a card with one news
function newsTemplate({ urlToImage, title, url, description }) {
  return `
    <div class="col s12">
      <div class="card">
        <div class="card-image">
          <img src="${urlToImage}" />
          <span class="card-title">${title || ''}</span>
        </div>
        <div class="card-content">
          <p>${description || ''}</p>
        </div>
        <div class="card-action">
          <a href="${url}">Read more</a>
        </div>
      </div>
    </div>
  `;
}

// show error message in failed case
function showAlert(msg, type = 'success') {
  M.toast({ html: msg, classes: type });
}

// show preloader while news is loading
function showPreloader() {
  document.body.insertAdjacentHTML(
    'afterbegin', 
    `
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
    `);
}

// stop showing preloader when news has been loaded
function removePreloader() {
  const loader = document.querySelector('.progress');
  if(loader) {
    loader.remove();
  }
}