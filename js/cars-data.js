const cars = [
  {
    name: 'Toyota Fortuner',
    category: 'suv',
    image: 'https://saftours.com/wp-content/uploads/2025/03/toyota-fortuner-rent-lahore.jpeg',
    local: '25,000', outstation: '28,000'
  },
  {
    name: 'Audi A6',
    category: 'luxury',
    image: 'https://saftours.com/wp-content/uploads/2024/12/audi-a6-rent-lahore-7-e1744318494649-1024x930.jpeg',
    local: '35,000', outstation: '40,000'
  },
  {
    name: 'Toyota Land Cruiser V8',
    category: 'luxury',
    image: 'https://saftours.com/wp-content/uploads/2023/11/v8-landcruiser-rent-lahore-2-1024x1000.webp',
    local: '30,000', outstation: '35,000'
  },
  {
    name: 'Toyota Yaris',
    category: 'sedan',
    image: 'https://saftours.com/wp-content/uploads/2025/04/toyota-yaris-rent-lahore-7-1024x768.jpeg',
    local: '6,000', outstation: '9,000'
  },
  {
    name: 'Toyota Corolla',
    category: 'sedan',
    image: 'https://saftours.com/wp-content/uploads/2023/11/corolla-rent-lahore-1-1024x682.webp',
    local: '6,000', outstation: '9,000'
  },
  {
    name: 'Honda Civic 2021',
    category: 'sedan',
    image: 'https://saftours.com/wp-content/uploads/2023/11/honda-civic-x-rent-lahore-1024x655.webp',
    local: '9,000', outstation: '10,000'
  },
  {
    name: 'Honda Civic 2025',
    category: 'sedan',
    image: 'https://saftours.com/wp-content/uploads/2025/01/honda-civic-rent-lahore-768x1024.jpeg',
    local: '12,000', outstation: '15,000'
  },
  {
    name: 'KIA Sportage',
    category: 'suv',
    image: 'https://saftours.com/wp-content/uploads/2022/01/KIA-Sportage-Rent-Lahore-1024x576.jpg',
    local: '12,000', outstation: '15,000'
  },
  {
    name: 'MG HS',
    category: 'suv',
    image: 'https://saftours.com/wp-content/uploads/2024/07/mg-hs-rent-lahore-3-jpg-1.webp',
    local: '12,000', outstation: '15,000'
  },
  {
    name: 'Toyota Prado',
    category: 'suv',
    image: 'https://saftours.com/wp-content/uploads/2024/06/toyota-prado-rent-lahore-1024x768.jpeg',
    local: '25,000', outstation: '28,000'
  },
  {
    name: 'Honda BRV',
    category: 'suv',
    image: 'https://saftours.com/wp-content/uploads/2025/03/rent-a-car-lahore-2-768x1024.jpeg',
    local: '7,000', outstation: '10,000'
  },
  {
    name: 'Suzuki Wagon R',
    category: 'economy',
    image: 'https://saftours.com/wp-content/uploads/2021/11/wagon-r-rent-lahore.jpg',
    local: '4,500', outstation: '5,500'
  },
  {
    name: 'Suzuki Cultus',
    category: 'economy',
    image: 'https://saftours.com/wp-content/uploads/2022/01/suzuki-cultus-rent-lahore-1.jpg',
    local: '4,500', outstation: '5,500'
  },
  {
    name: 'Toyota Hiace Van',
    category: 'van',
    image: 'https://saftours.com/wp-content/uploads/2021/12/grand-cabin-van-rent-lahore.jpg',
    local: '12,000', outstation: '15,000'
  },
  {
    name: 'Toyota Coaster',
    category: 'van',
    image: 'https://saftours.com/wp-content/uploads/2024/06/toyota-coaster-rent-lahore-2-1024x576-1.jpeg',
    local: '18,000', outstation: '25,000'
  }
];

const categoryLabels = {
  economy: 'Economy',
  sedan: 'Sedan',
  suv: 'SUV',
  luxury: 'Luxury',
  van: 'Van'
};

const faqs = [
  {
    q: 'What does the rental service include?',
    a: 'A well-maintained vehicle with a professional, background-verified chauffeur. Insurance, maintenance checks, and 24/7 support included. Fuel, tolls, and parking are customer responsibility.'
  },
  {
    q: 'How much does it cost to rent a car with driver?',
    a: '<ul><li>Economy: from PKR 4,500/day</li><li>Sedans: PKR 5,000–12,000/day</li><li>Luxury: PKR 18,000–35,000/day</li><li>Wedding cars: PKR 25,000–50,000 for 6 hours</li></ul>'
  },
  {
    q: 'Are there any hidden fees?',
    a: 'No. All charges are communicated upfront before booking confirmation. We believe in earning loyalty through honest dealing.'
  },
  {
    q: 'How far in advance should I book?',
    a: 'We recommend 24–48 hours ahead for luxury and wedding cars. Same-day bookings are also available — call us anytime!'
  },
  {
    q: 'Can I hire a car for outstation trips?',
    a: 'Yes. We cover Lahore to Islamabad (3–4 hrs), Karachi (18–20 hrs), Faisalabad (2–3 hrs), Multan (5–6 hrs), and Peshawar (5–6 hrs) with experienced highway drivers.'
  },
  {
    q: 'Are drivers licensed and verified?',
    a: 'Every chauffeur undergoes criminal background checks, license verification, route training, and regular safety courses. Your safety is our top priority.'
  },
  {
    q: 'Do you provide airport pickup?',
    a: 'Yes — 24/7 airport transfers at Allama Iqbal International Airport with flight tracking, meet & greet, and luggage assistance.'
  },
  {
    q: 'Is self-drive available?',
    a: 'No. We provide professional chauffeur-driven service only, ensuring navigation, safety, and a stress-free experience.'
  }
];

function renderCars(filter = 'all') {
  const grid = document.getElementById('cars-grid');
  if (!grid) return;

  const filtered = filter === 'all' ? cars : cars.filter(c => c.category === filter);

  grid.style.opacity = '0';
  grid.style.transform = 'translateY(12px)';
  grid.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

  setTimeout(() => {
    grid.innerHTML = filtered.map((car, i) => `
      <div class="car-card reveal-scale" data-category="${car.category}" data-delay="${(i % 4) * 80}">
        <div class="car-img-wrap">
          <img src="${car.image}" alt="${car.name} rent Lahore" loading="lazy">
          <span class="car-badge">${categoryLabels[car.category]}</span>
          <span class="car-price-tag">From <span>PKR ${car.local}</span>/day</span>
        </div>
        <div class="car-card-body">
          <h3>${car.name}</h3>
          <table class="price-table">
            <thead>
              <tr><th>City</th><th>Per Day</th><th>Driver</th><th>Hours</th></tr>
            </thead>
            <tbody>
              <tr><td>Local</td><td>PKR ${car.local}</td><td>500</td><td>12h</td></tr>
              <tr><td>Outstation</td><td>PKR ${car.outstation}</td><td>2,000</td><td>24h</td></tr>
              <tr><td>Fuel</td><td colspan="3">Not Included</td></tr>
            </tbody>
          </table>
        </div>
        <div class="car-card-footer">
          <button class="car-book-btn" data-car="${car.name}">Book This Car</button>
        </div>
      </div>
    `).join('');

    grid.style.opacity = '1';
    grid.style.transform = 'translateY(0)';
    observeReveals();
    bindCarBookButtons();
  }, 280);
}

function renderFaqs() {
  const list = document.getElementById('faq-list');
  if (!list) return;

  list.innerHTML = faqs.map(faq => `
    <div class="faq-item">
      <button class="faq-question">
        ${faq.q}
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner">${faq.a}</div>
      </div>
    </div>
  `).join('');
}

function observeReveals() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    if (!el.classList.contains('observed')) {
      el.classList.add('observed');
      const delay = el.dataset.delay || 0;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), +delay);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
      observer.observe(el);
    }
  });
}

function bindCarBookButtons() {
  document.querySelectorAll('.car-book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const carName = btn.dataset.car;
      const carSelect = document.getElementById('car');
      if (carSelect) carSelect.value = carName;
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

renderCars();
renderFaqs();
observeReveals();

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCars(btn.dataset.filter);
  });
});
