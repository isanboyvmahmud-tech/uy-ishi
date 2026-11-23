import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import defaultCars from '../assets/cars.json';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

// Mashina sahifasi komponenti
function CarDetail({ bookings, setBookings, likedCars = [], toggleLike }) {
  // 1. URL parametrlari va navigatsiya:
  const { id } = useParams();
  const navigate = useNavigate();

  // 2. Holatlar (State) bo'limi:
  const initialCar = defaultCars.find((item) => String(item.id) === String(id));
  const [car, setCar] = useState(initialCar || null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(1);
  const [error, setError] = useState(null);

  // 3. Ma'lumotlarni yuklash (useEffect & fetch) bo'limi:
  useEffect(() => {
    fetch('/cars.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ma'lumotlarni yuklab bo'lmadi");
        }
        return res.json();
      })
      .then((data) => {
        const foundCar = data.find((item) => String(item.id) === String(id));
        if (foundCar) {
          setCar(foundCar);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // 4. Kunlarni o'zgartirish funksiyalari («−» va «+»):
  const handleDecrease = () => {
    if (days > 1) {
      setDays((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    setDays((prev) => prev + 1);
  };

  // 5. Ijaraga olish funksiyasi:
  const handleRent = () => {
    if (!car) return;

    setBookings([
      ...bookings,
      {
        id: car.id,
        name: car.name,
        price: car.price,
        days: days,
      },
    ]);

    navigate('/bookings');
  };

  // 6. Yuklanish va xato holatlari:
  if (loading) {
    return <div className="loading-container">Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="error-container">Xatolik: {error}</div>;
  }

  if (!car) {
    return (
      <div className="error-container">
        <h2>Mashina topilmadi</h2>
        <Link to="/" className="back-link">
          ← Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  const isLiked = likedCars.includes(car.id);
  const totalPrice = car.price * days;

  // 7. Render bo'limi:
  return (
    <div className="car-detail-container">
      {/* Orqaga qaytish havolasi */}
      <Link to="/" className="back-link">
        ← Barcha mashinalarga qaytish
      </Link>

      <div className={`detail-card ${car.isVip ? 'detail-vip-card' : ''}`}>
        {/* Mashina rasmi va Layk tugmasi */}
        <div className="detail-image-box">
          <img
            src={car.image || FALLBACK_IMAGE}
            alt={car.name}
            className="detail-main-img"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />

          {car.isVip && (
            <span className="vip-ribbon-badge">👑 VIP KLASS</span>
          )}

          <button
            type="button"
            className={`like-btn detail-like-btn ${isLiked ? 'liked' : ''}`}
            onClick={() => {
              if (toggleLike) toggleLike(car.id);
            }}
            title={isLiked ? "Yoqtirishdan chiqarish" : "Yoqtirish (Layk)"}
            aria-label="Layk"
          >
            <span className="heart-icon">{isLiked ? '❤️' : '🤍'}</span>
          </button>
        </div>

        {/* Mashina nomi va sarlavha */}
        <div className="detail-header-row">
          <div>
            <h1 className="detail-title">
              {car.name}
              {car.isVip && <span className="vip-crown">⭐</span>}
            </h1>
            {/* Davlat raqami va Rangi */}
            {(car.plateNumber || car.color) && (
              <div className="car-custom-meta" style={{ marginTop: '8px' }}>
                {car.plateNumber && (
                  <span className="license-plate">
                    <span className="plate-flag">🇺🇿</span>
                    <span className="plate-text">{car.plateNumber}</span>
                  </span>
                )}
                {car.color && (
                  <span className="color-tag">🎨 {car.color}</span>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className={`like-pill-btn ${isLiked ? 'active' : ''}`}
            onClick={() => {
              if (toggleLike) toggleLike(car.id);
            }}
          >
            {isLiked ? '❤️ Yoqtirildi' : '🤍 Layk bosish'}
          </button>
        </div>

        {/* Mashina tavsifi */}
        {car.desc && <p className="detail-desc">{car.desc}</p>}

        {/* Xususiyatlar */}
        <div className="detail-specs">
          <div className="spec-item">
            <span className="spec-label">O'rindiqlar soni:</span>
            <span className="spec-value">{car.seats} ta</span>
          </div>
          {car.color && (
            <div className="spec-item">
              <span className="spec-label">Rangi:</span>
              <span className="spec-value">{car.color}</span>
            </div>
          )}
          {car.plateNumber && (
            <div className="spec-item">
              <span className="spec-label">Davlat raqami:</span>
              <span className="spec-value">{car.plateNumber}</span>
            </div>
          )}
          <div className="spec-item">
            <span className="spec-label">Kunlik narxi:</span>
            <span className="spec-value price-text">
              {car.price.toLocaleString('uz-UZ')} so'm/kun
            </span>
          </div>
        </div>

        {/* Kun tanlash va narx hisoblash */}
        <div className="calculator-section">
          <h3>Ijara muddatini tanlang:</h3>

          <div className="days-counter">
            <button
              type="button"
              className="counter-btn"
              onClick={handleDecrease}
              disabled={days <= 1}
            >
              −
            </button>
            <span className="days-display">{days} kun</span>
            <button
              type="button"
              className="counter-btn"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>

          <div className="total-price-box">
            <span className="total-label">Narx:</span>
            <span className="total-value">
              {totalPrice.toLocaleString('uz-UZ')} so'm
            </span>
            <small className="calculation-formula">
              ({car.price.toLocaleString('uz-UZ')} so'm × {days} kun)
            </small>
          </div>
        </div>

        {/* «Ijaraga olish» tugmasi */}
        <button
          type="button"
          className={`rent-submit-btn ${car.isVip ? 'vip-submit-btn' : ''}`}
          onClick={handleRent}
        >
          {car.isVip ? '👑 VIP Ijaraga olish' : 'Ijaraga olish'}
        </button>
      </div>
    </div>
  );
}

export default CarDetail;
