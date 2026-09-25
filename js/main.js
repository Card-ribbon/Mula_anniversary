/* =========================
   Loading
========================= */

const loading = document.querySelector('#loading');
const loadingPercent = document.querySelector('#loading-percent');

const imagePaths = [
  'images/1.png',
  'images/2.png',
  'images/3.png',
  'images/4.png',
  'images/5.png',
  'images/6.png'
];

let loadedImages = 0;
let targetPercent = 0;
let displayPercent = 0;


/* =========================
   画像読み込み
========================= */

imagePaths.forEach(path => {

  const img = new Image();

  const imageLoaded = () => {

    loadedImages++;

    targetPercent = Math.round(
      (loadedImages / imagePaths.length) * 100
    );

  };

  img.onload = imageLoaded;
  img.onerror = imageLoaded;

  img.src = path;

});


/* =========================
   プログレス表示
========================= */

const percentAnimation = setInterval(() => {

  if (displayPercent < targetPercent) {

    displayPercent++;

    if (loadingPercent) {
      loadingPercent.textContent =
        displayPercent + '%';
    }

  }


  /* 100% */

  if (
    displayPercent >= 100 &&
    loadedImages >= imagePaths.length
  ) {

    clearInterval(percentAnimation);

    setTimeout(() => {

      if (loading) {
        loading.classList.add('hide');
      }

      setTimeout(() => {

        if (loading) {
          loading.remove();
        }

      }, 800);

    }, 500);

  }

}, 30);


/* =========================
   Slideshow
========================= */

const slides = document.querySelectorAll('.slide');

let currentSlide = 0;

if (slides.length > 0) {

  setInterval(() => {

    slides[currentSlide].classList.remove('active');

    currentSlide++;

    if (currentSlide >= slides.length) {
      currentSlide = 0;
    }

    slides[currentSlide].classList.add('active');

  }, 3000);

}


/* =========================
   Button
========================= */

const action = document.querySelector('#action');

if (action) {

  action.addEventListener('click', () => {

    action.textContent = 'THANK YOU!';

    document.body.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(.985)' },
        { transform: 'scale(1)' }
      ],
      {
        duration: 350
      }
    );

  });

}


/* =========================
   Scroll animation
========================= */

const revealTargets =
  document.querySelectorAll('.section, .special');

const observer = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.animate(
        [
          {
            opacity: 0,
            transform: 'translateY(35px)'
          },
          {
            opacity: 1,
            transform: 'translateY(0)'
          }
        ],
        {
          duration: 800,
          easing: 'cubic-bezier(.2,.8,.2,1)',
          fill: 'forwards'
        }
      );

      observer.unobserve(entry.target);

    }

  });

}, {
  threshold: .12
});

revealTargets.forEach(el => observer.observe(el));
/* =========================
   YouTube NEWS
========================= */

const youtubeNews = document.querySelector('#youtube-news');

async function loadYouTubeNews() {

  if (!youtubeNews) return;

  try {

    const response = await fetch('data/youtube.json');

    if (!response.ok) {
      throw new Error('YouTube data could not be loaded.');
    }

    const data = await response.json();

    youtubeNews.innerHTML = '';

    data.videos.forEach(video => {

      const article = document.createElement('article');

      article.className = 'youtube-card';

      const date = new Date(video.published);

      const formattedDate =
        date.getFullYear() + '.' +
        String(date.getMonth() + 1).padStart(2, '0') + '.' +
        String(date.getDate()).padStart(2, '0');

      article.innerHTML = `
        <a
          href="${video.url}"
          target="_blank"
          rel="noopener noreferrer"
        >

          <div class="youtube-thumbnail">
            <img
              src="${video.thumbnail}"
              alt=""
              loading="lazy"
            >

            <span class="youtube-play">▶</span>
          </div>

          <div class="youtube-info">

            <time>${formattedDate}</time>

            <h3>${video.title}</h3>

            <span class="youtube-arrow">↗</span>

          </div>

        </a>
      `;

      youtubeNews.appendChild(article);

    });

  } catch (error) {

    console.error(error);

    youtubeNews.innerHTML = `
      <p>動画を読み込めませんでした。</p>
    `;

  }

}

loadYouTubeNews();