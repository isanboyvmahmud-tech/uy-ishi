import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import defaultCars from '../assets/cars.json';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

// Bosh sahifa komponenti (Avto-ijara)
function Home({ likedCars = [], toggleLike }) {
  // 1. Holatlar (State) bo'limi:
  const [cars, setCars] = useState(defaultCars);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // 2. Ma'lumotlarni yuklash (useEffect & fetch) bo'limi:
  useEffect(() => {
    fetch('/cars.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ma'lumotlarni yuklashda xatolik yuz berdi");
        }
        return response.json();
      })
      .then((data) => {
        setCars(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Xatolik:", err);
        setLoading(false);
      });
  }, []);

  // 3. Yuklanish va xato holatlari:
  if (loading) {
    return <div className="loading-container">Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="error-container">Xatolik: {error}</div>;
  }

  const vipCars = cars.filter((c) => c.isVip);
  const standardCars = cars.filter((c) => !c.isVip);

  // Kartochka render funksiyasi
  const renderCarCard = (car, isVipCard = false) => {
    const isLiked = likedCars.includes(car.id);

    return (
      <div
        key={car.id}
        className={`car-card ${isVipCard ? 'vip-car-card' : ''}`}
      >
        {/* Mashina rasmi */}
        <div className="car-image-box">
          <img
            src={car.image || FALLBACK_IMAGE}
            alt={car.name}
            className="car-thumb"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />

          {/* VIP nishoni */}
          {car.isVip && (
            <span className="vip-ribbon-badge">👑 VIP KLASS</span>
          )}

          {/* Layk tugmasi */}
          <button
            type="button"
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              if (toggleLike) toggleLike(car.id);
            }}
            title={isLiked ? "Yoqtirishdan chiqarish" : "Yoqtirish (Layk)"}
            aria-label="Layk"
          >
            <span className="heart-icon">{isLiked ? '❤️' : '🤍'}</span>
          </button>
        </div>

        {/* Mashina nomi va davlat raqami */}
        <div className="car-title-row">
          <h2 className="car-name">
            {car.name}
            {car.isVip && <span className="vip-crown">⭐</span>}
          </h2>
          {isLiked && <span className="liked-text-badge">Yoqtirildi</span>}
        </div>

        {/* Davlat raqami va Rangi (agar mavjud bo'lsa) */}
        {(car.plateNumber || car.color) && (
          <div className="car-custom-meta">
            {car.plateNumber && (
              <span className="license-plate" title="Davlat raqami">
                <span className="plate-flag">🇺🇿</span>
                <span className="plate-text">{car.plateNumber}</span>
              </span>
            )}
            {car.color && (
              <span className="color-tag" title="Mashina rangi">
                🎨 {car.color}
              </span>
            )}
          </div>
        )}

        {/* Mashina tavsifi */}
        {car.desc && <p className="car-desc">{car.desc}</p>}

        {/* Kunlik narxi */}
        <div className="car-price">
          <span className={`price-value ${car.isVip ? 'vip-price' : ''}`}>
            {car.price.toLocaleString('uz-UZ')} so'm
          </span>
          <span className="price-unit">/kun</span>
        </div>

        {/* O'rindiqlar soni */}
        {car.seats && (
          <div className="car-meta">
            <span>O'rindiqlar: {car.seats} ta</span>
          </div>
        )}

        {/* /car/:id sahifasiga olib boruvchi tugma */}
        <Link
          to={`/car/${car.id}`}
          className={`view-detail-btn ${car.isVip ? 'vip-detail-btn' : ''}`}
        >
          {car.isVip ? '👑 VIP Band qilish →' : 'Batafsil / Band qilish →'}
        </Link>
      </div>
    );
  };

  // 4. Render bo'limi:
  return (
    <div className="home-container">
      {/* Sarlavha qismi */}
      <header className="page-header">
        <h1>Avto-ijara avtoparki</h1>
        <p>
          O'zingizga ma'qul avtomobilni tanlang — jami {cars.length} ta
          avtomobil xizmatingizda
        </p>

        {/* Kategoriya filtrlari */}
        <div className="category-filter-tabs">
          <button
            type="button"
            className={`filter-tab-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            🚗 Barchasi ({cars.length})
          </button>
          <button
            type="button"
            className={`filter-tab-btn vip-filter-btn ${
              filter === 'vip' ? 'active' : ''
            }`}
            onClick={() => setFilter('vip')}
          >
            👑 VIP Mashinalar ({vipCars.length})
          </button>
          <button
            type="button"
            className={`filter-tab-btn ${filter === 'standard' ? 'active' : ''}`}
            onClick={() => setFilter('standard')}
          >
            🚙 Standart ({standardCars.length})
          </button>
        </div>
      </header>

      {/* VIP MASHINALAR BO'LIMI */}
      {(filter === 'all' || filter === 'vip') && vipCars.length > 0 && (
        <section className="vip-exclusive-section">
          <div className="vip-section-header">
            <div className="vip-badge-pill">👑 EKSKLYUZIV TOIFA</div>
            <h2 className="vip-section-title">VIP & Premium Avtomobillar</h2>
            <p className="vip-section-subtitle">
              Eng yuqori qulaylik, hashamat va nufuzli sayohatlar uchun
              maxsus saralangan avtopark
            </p>
          </div>

          <div className="cars-grid vip-grid">
            {vipCars.map((car) => renderCarCard(car, true))}
          </div>
        </section>
      )}

      {/* STANDART MASHINALAR BO'LIMI */}
      {(filter === 'all' || filter === 'standard') && standardCars.length > 0 && (
        <section className="standard-section">
          {filter === 'all' && (
            <div className="section-title-divider">
              <h2>🚙 Qulay va Tejamkor Avtomobillar</h2>
              <p>Kundalik harakat va shahar ichida qulay sayohatlar uchun</p>
            </div>
          )}

          <div className="cars-grid">
            {standardCars.map((car) => renderCarCard(car, false))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
