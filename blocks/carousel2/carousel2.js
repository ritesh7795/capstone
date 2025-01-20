function updateActiveSlide(slide) {
  const block = slide.closest('.carousel2');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel2-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel2-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel2-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel2-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel2-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    const targetSlide = block.querySelector("div").dataset.activeSlide;
    console.log("targetSlide", targetSlide)
    showSlide(block, parseInt(targetSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    const targetSlide = block.querySelector("div").dataset.activeSlide;

    showSlide(block, parseInt(targetSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel2-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

export default async function decorate(block) {
  const response = await fetch("http://localhost:3000/query-index.json");
  const json = await response.json();
  const carouselData = json.data.filter(item => item.path.includes("/index"));
  const isSingleSlide = carouselData.length < 2;
  function generateCarousel(carouselData) {
    // Create the outer carousel container
    const carousel = document.createElement('div');
    carousel.classList.add('carousel2');
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-roleprice', 'Carousel2');
    carousel.setAttribute('data-active-slide', '0');

    // Create the slides container
    const slidesContainer = document.createElement('div');
    slidesContainer.classList.add('carousel2-slides-container');

    // Create navigation buttons
    const navButtons = document.createElement('div');
    navButtons.classList.add('carousel2-navigation-buttons');
    navButtons.innerHTML = `
    <button type="button" class="slide-prev" aria-label="Previous Slide"</button>
    <button type="button" class="slide-next" aria-label="Next Slide"</button>
  `;
    slidesContainer.appendChild(navButtons);

    // Create the slides wrapper (ul)
    const slidesWrapper = document.createElement('ul');
    slidesWrapper.classList.add('carousel2-slides');
    carouselData.forEach((data, index) => {
      const slide = createSlide(data, index);
      slidesWrapper.appendChild(slide);
    });
    slidesContainer.appendChild(slidesWrapper);

    // Create the slide indicators (ol)
    const slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel2-slide-indicators');
    carouselData.forEach((_, index) => {
      if (index % 5 == 0) {
        const indicator = createSlideIndicator(index, carouselData.length);
        slideIndicators.appendChild(indicator);
      }
    });

    // Create the carousel navigation controls
    const navControls = document.createElement('nav');
    navControls.setAttribute('aria-label', 'Carousel2 Slide Controls');
    navControls.appendChild(slideIndicators);
    carousel.appendChild(slidesContainer);
    carousel.appendChild(navControls);
    return carousel;

    // Append the carousel to the body or desired container

  }

  function createSlide(data, index) {
    const slide = document.createElement('li');
    slide.classList.add('carousel2-slide');
    slide.dataset.slideIndex = index;
    slide.setAttribute('data-slide-index', index);
    slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    slide.setAttribute('id', `carousel2-1-slide-${index}`);

    // Create the slide image
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('carousel2-slide-image');
    const picture = document.createElement('picture');

    const sourceWebp1 = document.createElement('source');
    sourceWebp1.setAttribute('type', 'image/webp');
    sourceWebp1.setAttribute('srcset', `${data.image}?width=2000&format=webply&optimize=medium`);
    picture.appendChild(sourceWebp1);

    const sourceWebp2 = document.createElement('source');
    sourceWebp2.setAttribute('type', 'image/webp');
    sourceWebp2.setAttribute('srcset', `${data.image}?width=750&format=webply&optimize=medium`);
    picture.appendChild(sourceWebp2);

    const img = document.createElement('img');
    img.setAttribute('loading', 'lazy');
    img.setAttribute('src', `${data.image}?width=750&format=png&optimize=medium`);
    img.setAttribute('alt', data.altText);
    img.setAttribute('width', '1440');
    img.setAttribute('height', '660');
    picture.appendChild(img);

    imageDiv.appendChild(picture);
    slide.appendChild(imageDiv);

    // Create slide content (text and linlink)
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('carousel2-slide-content');

    const heading = document.createElement('h4');
    heading.setAttribute('id', `carousel2-1-slide-title-${index}`);
    heading.textContent = data.title;
    contentDiv.appendChild(heading);

    const price = document.createElement('p');
    price.textContent = data.price;
    contentDiv.appendChild(price);

    const link = document.createElement('a');
    link.setAttribute('href', data.url);
    link.setAttribute('title', 'ADD TO CART');
    link.textContent = 'ADD TO CART';
    contentDiv.appendChild(link);

    slide.appendChild(contentDiv);
    return slide;
  }

  function createSlideIndicator(index, totalSlides) {
    const indicator = document.createElement('li');
    indicator.classList.add('carousel2-slide-indicator');
    indicator.dataset.targetSlide = index;
    indicator.setAttribute('data-target-slide', index);
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', `Show Slide ${index + 1} of ${totalSlides}`);
    if (index === 0) {
      button.setAttribute('disabled', 'true');
    }
    indicator.appendChild(button);
    return indicator;
  }

  // Initialize the carousel with the data
  const carousel = generateCarousel(carouselData);
  block.prepend(carousel);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}
