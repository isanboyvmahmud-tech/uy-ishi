import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CarDetail from './pages/CarDetail';
import Bookings from './pages/Bookings';
import './App.css';

// Asosiy ilova komponenti
function App() {
  // 1. Ijaralar holati (State)
  const [bookings, setBookings] = useState([]);

  // 2. Layklar (Sevimlilar) holati (State):
  // Brauzer xotirasi (localStorage) dan o'qiladi, sahifa yangilansa ham saqlanadi
  const [likedCars, setLikedCars] = useState(() => {
    try {
      const saved = localStorage.getItem('likedCars');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Layklar o'zgarganda localStorage ga yozib borish
  useEffect(() => {
    localStorage.setItem('likedCars', JSON.stringify(likedCars));
  }, [likedCars]);

  // Laykni yoqish / o'chirish (Toggle) funksiyasi
  const toggleLike = (carId) => {
    setLikedCars((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
  };

  return (
    <BrowserRouter>
      {/* Yuqori navigatsiya menyusi (Header / Navbar) */}
      <header className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-brand">
            🚗 AvtoIjara
          </Link>

          {/* Menyu havolalari */}
          <nav className="nav-menu">
            <Link to="/" className="nav-link">
              Bosh sahifa
            </Link>

            {/* Sevimlilar (Layk bosilganlar) hisoblagichi */}
            <span className="nav-link likes-indicator" title="Yoqtirilgan mashinalar">
              ❤️ Sevimlilar
              {likedCars.length > 0 && (
                <span className="badge likes-badge">{likedCars.length}</span>
              )}
            </span>

            {/* Mening ijaralarim */}
            <Link to="/bookings" className="nav-link bookings-btn">
              Mening ijaralarim
              {bookings.length > 0 && (
                <span className="badge">{bookings.length}</span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      {/* Sahifalar marshrutlari (Routes) */}
      <main className="app-main">
        <Routes>
          {/* Bosh sahifa */}
          <Route
            path="/"
            element={
              <Home likedCars={likedCars} toggleLike={toggleLike} />
            }
          />

          {/* Mashina sahifasi */}
          <Route
            path="/car/:id"
            element={
              <CarDetail
                bookings={bookings}
                setBookings={setBookings}
                likedCars={likedCars}
                toggleLike={toggleLike}
              />
            }
          />

          {/* Mening ijaralarim */}
          <Route
            path="/bookings"
            element={<Bookings bookings={bookings} />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
