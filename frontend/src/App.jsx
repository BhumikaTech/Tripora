
import "./App.css";
import { useState, useEffect } from "react";

import {
  MapPin,
  Compass,
  Heart,
  UserRound,
  Menu,
  ArrowUpRight,
  Star,
  Search,
  Wallet,
  Map,
  X
} from "lucide-react";

import { getDestinations } from "./services/api";
import AuthModal from "./AuthModal";
import MyTrips from "./MyTrips";

/* =========================
   NAVBAR
========================= */

function Navbar({ onOpenAuth, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">

      <a href="#" className="logo" onClick={closeMenu}>
        tripora<span>.</span>
      </a>

      {/* Desktop Navigation */}
      <div className="nav-links">
        <a href="#" onClick={closeMenu}>Home</a>
        <a href="#destinations" onClick={closeMenu}>Explore</a>
        <a href="#why-us" onClick={closeMenu}>About</a>
        {user && (
          <a href="#my-trips" onClick={closeMenu}>My Trips</a>
        )}
      </div>

      {/* Desktop Actions */}
      <div className="nav-actions">

        <button className="icon-btn" aria-label="Favorites">
          <Heart size={19} />
        </button>

        {user ? (
          <>
            <span className="logged-user">
              <UserRound size={17} />
              {user.name}
            </span>

            <button className="login-btn" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="login-btn"
              onClick={() => onOpenAuth("login")}
            >
              <UserRound size={17} />
              Login
            </button>

            <button
              className="get-started-btn"
              onClick={() => onOpenAuth("register")}
            >
              Get Started <ArrowUpRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="mobile-menu"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((previous) => !previous)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="mobile-menu-panel">

          <a href="#" onClick={closeMenu}>
            Home
          </a>

          <a href="#destinations" onClick={closeMenu}>
            Explore Destinations
          </a>

          <a href="#why-us" onClick={closeMenu}>
            About Tripora
          </a>

          {user ? (
            <>
              <a href="#my-trips" onClick={closeMenu}>
                My Trips
              </a>

              <button
                onClick={() => {
                  onLogout();
                  closeMenu();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  closeMenu();
                  onOpenAuth("login");
                }}
              >
                Login
              </button>

              <button
                onClick={() => {
                  closeMenu();
                  onOpenAuth("register");
                }}
              >
                Get Started
              </button>
            </>
          )}

        </div>
      )}

    </nav>
  );
}

/* =========================
   HERO
========================= */

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <span className="hero-tag">
          <Compass size={15} />
          YOUR NEXT ADVENTURE STARTS HERE
        </span>

        <h1>
          Explore the world.
          <br />
          Find your next <span>adventure.</span>
        </h1>

        <p>
          Discover amazing destinations, plan unforgettable trips,
          and make every journey worth remembering.
        </p>

        <a href="#destinations" className="hero-btn">
          Explore Destinations <ArrowUpRight size={18} />
        </a>

        <div className="hero-stats">

          <div>
            <h3>50+</h3>
            <span>Destinations</span>
          </div>

          <div>
            <h3>10k+</h3>
            <span>Happy Travelers</span>
          </div>

          <div>
            <h3>4.9</h3>
            <span>Average Rating</span>
          </div>

        </div>
      </div>

      <div className="hero-image">

        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200"
          alt="Beautiful mountain landscape"
        />

        <div className="floating-card">
          <MapPin size={18} />

          <div>
            <strong>Find your escape</strong>
            <span>Explore somewhere new</span>
          </div>
        </div>

      </div>

    </section>
  );
}

/* =========================
   DESTINATIONS
========================= */

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);

  useEffect(() => {
    async function loadDestinations() {
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (error) {
        console.error("Error loading destinations:", error);
        setError("Unable to load destinations. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadDestinations();
  }, []);

  const filteredDestinations = destinations.filter((destination) =>
    `${destination.name} ${destination.country}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const fallbackImages = [
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900",
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900",
    "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=900",
    "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=900"
  ];

  return (
    <section className="destinations-section" id="destinations">

      <div className="section-heading">
        <span className="section-tag">DISCOVER PLACES</span>

        <h2>
          Explore beautiful <span>destinations</span>
        </h2>

        <p>
          Find your perfect getaway and start planning your next journey.
        </p>
      </div>

      <div className="destination-search">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search destinations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="no-destinations">Loading destinations...</p>
      ) : error ? (
        <p className="no-destinations">{error}</p>
      ) : filteredDestinations.length === 0 ? (
        <p className="no-destinations">
          No destinations found. Try another search!
        </p>
      ) : (
        <div className="destination-grid">

          {filteredDestinations.map((destination, index) => (
            <div className="destination-card" key={destination._id}>

              <div className="destination-image">

                <img
                  src={
                    destination.imageUrl ||
                    fallbackImages[index % fallbackImages.length]
                  }
                  alt={destination.name}
                />

                <span className="destination-rating">
                  <Star size={14} fill="currentColor" />
                  4.9
                </span>

                <button
                  className="favorite-btn"
                  aria-label="Add to favorites"
                >
                  <Heart size={18} />
                </button>

              </div>

              <div className="destination-info">

                <div>
                  <h3>{destination.name}</h3>

                  <span className="destination-location">
                    <MapPin size={14} />
                    {destination.country}
                  </span>
                </div>

                <div className="destination-price">
                  <span>Budget per day</span>

                  <strong>
                    ₹{Number(
                      destination.budgetPerDay || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <button
                  className="destination-btn"
                  onClick={() => setSelectedDestination(destination)}
                >
                  Explore <ArrowUpRight size={16} />
                </button>

              </div>
            </div>
          ))}

        </div>
      )}

      {/* Destination Details Popup */}

      {selectedDestination && (
        <div
          className="destination-modal"
          onClick={() => setSelectedDestination(null)}
        >
          <div
            className="destination-modal-content"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setSelectedDestination(null)}
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <span className="section-tag">
              DESTINATION DETAILS
            </span>

            <h2>{selectedDestination.name}</h2>

            <p className="modal-location">
              <MapPin size={16} />
              {selectedDestination.country}
            </p>

            <div className="modal-budget">
              <Wallet size={22} />

              <div>
                <span>Estimated daily budget</span>

                <h3>
                  ₹{Number(
                    selectedDestination.budgetPerDay || 0
                  ).toLocaleString("en-IN")}
                  <small> / day</small>
                </h3>
              </div>
            </div>

            <button
              className="destination-btn modal-action"
              onClick={() => setSelectedDestination(null)}
            >
              Close Details
            </button>

          </div>
        </div>
      )}

    </section>
  );
}

/* =========================
   WHY TRIPORA
========================= */

function WhyTripora() {
  return (
    <section className="why-section" id="why-us">

      <div className="section-heading">
        <span className="section-tag">WHY TRIPORA</span>

        <h2>
          Travel planning, <span>made simple.</span>
        </h2>

        <p>
          Everything you need to turn your travel dreams into reality.
        </p>
      </div>

      <div className="features-grid">

        <div className="feature-card">
          <div className="feature-icon">
            <Compass size={25} />
          </div>

          <h3>Discover Amazing Places</h3>

          <p>
            Explore beautiful destinations and find places
            that match your travel dreams.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Wallet size={25} />
          </div>

          <h3>Manage Your Budget</h3>

          <p>
            Keep track of your travel expenses and
            make smarter budget decisions.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Map size={25} />
          </div>

          <h3>Plan Every Detail</h3>

          <p>
            Organize your trips and keep your travel
            plans in one convenient place.
          </p>
        </div>

      </div>
    </section>
  );
}

/* =========================
   FOOTER
========================= */

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div className="footer-brand">
          <a href="#" className="logo">
            tripora<span>.</span>
          </a>

          <p>
            Discover more. Travel better.
            Make every journey unforgettable.
          </p>
        </div>

        <div className="footer-links">

          <div>
            <h4>Explore</h4>
            <a href="#destinations">Destinations</a>
            <a href="#why-us">Why Tripora</a>
          </div>

          <div>
            <h4>My Account</h4>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new Event("open-login"));
              }}
            >
              Login
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new Event("open-register"));
              }}
            >
              Register
            </a>
          </div>

          <div>
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Tripora. All rights reserved.</p>
        <span>Made for the love of travel ✦</span>
      </div>

    </footer>
  );
}

/* =========================
   MAIN APP
========================= */

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  function openAuth(mode = "login") {
    setAuthMode(mode);
    setShowAuth(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  useEffect(() => {
    const openLogin = () => openAuth("login");
    const openRegister = () => openAuth("register");

    window.addEventListener("open-login", openLogin);
    window.addEventListener("open-register", openRegister);

    return () => {
      window.removeEventListener("open-login", openLogin);
      window.removeEventListener("open-register", openRegister);
    };
  }, []);

  return (
    <>
      <Navbar
        onOpenAuth={openAuth}
        user={user}
        onLogout={handleLogout}
      />

      <Hero />

      {/* Show My Trips only when user is logged in */}
      {user && <MyTrips />}

      <Destinations />

      <WhyTripora />

      <Footer />

      {showAuth && (
        <AuthModal
          key={authMode}
          initialMode={authMode}
          onClose={() => setShowAuth(false)}
          onLoginSuccess={setUser}
        />
      )}
    </>
  );
}

export default App;
