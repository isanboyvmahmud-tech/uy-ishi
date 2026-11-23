import { Link } from 'react-router-dom';

// Mening ijaralarim sahifasi
function Bookings({ bookings }) {
  // 1. Jami summani for sikli bilan hisoblash bo'limi:
  // Talabga muvofiq for sikli orqali barcha ijaralarning umumiy narxi hisoblanadi
  let totalSum = 0;
  for (let i = 0; i < bookings.length; i++) {
    totalSum += bookings[i].price * bookings[i].days;
  }

  // 2. Agar ijaralar bo'sh bo'lsa (bo'sh holat):
  if (bookings.length === 0) {
    return (
      <div className="bookings-empty">
        <h2>Hozircha hech qanday ijara mavjud emas</h2>
        <p>Avtomobillarni ko'rib chiqish uchun bosh sahifaga o'ting.</p>
        <Link to="/" className="view-detail-btn">
          Mashinalarni tanlash →
        </Link>
      </div>
    );
  }

  // 3. Render bo'limi:
  return (
    <div className="bookings-container">
      {/* Sahifa sarlavhasi */}
      <header className="page-header">
        <h1>Mening ijaralarim</h1>
        <p>Siz tomondan band qilingan avtomobillar ro'yxati</p>
      </header>

      {/* Ijaralar ro'yxati */}
      <div className="bookings-list">
        {bookings.map((item, index) => {
          const itemTotal = item.price * item.days;
          return (
            <div key={index} className="booking-card">
              <div className="booking-info">
                {/* Mashina nomi */}
                <h3 className="booking-car-name">{item.name}</h3>

                {/* Ijara kunlari soni */}
                <span className="booking-days">
                  Muddat: <strong>{item.days} kun</strong>
                </span>
              </div>

              {/* Ijara summasi (price * days) */}
              <div className="booking-price-box">
                <span className="booking-price-total">
                  {itemTotal.toLocaleString('uz-UZ')} so'm
                </span>
                <small className="booking-price-calc">
                  ({item.price.toLocaleString('uz-UZ')} so'm × {item.days} kun)
                </small>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Pastda jami summa (for sikli bilan hisoblangan) */}
      <div className="bookings-summary-card">
        <div className="summary-row">
          <span className="summary-label">Jami ijaralar soni:</span>
          <span className="summary-value">{bookings.length} ta</span>
        </div>
        <div className="summary-row total-highlight">
          <span className="summary-label">Umumiy to'lov:</span>
          <span className="summary-total">
            {totalSum.toLocaleString('uz-UZ')} so'm
          </span>
        </div>
      </div>

      {/* Bosh sahifaga qaytish havolasi */}
      <div className="bookings-actions">
        <Link to="/" className="back-link">
          ← Yana mashina qo'shish
        </Link>
      </div>
    </div>
  );
}

export default Bookings;
