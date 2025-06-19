import { useEffect, useState } from "react";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [allMovies, setAllMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`https://ghibliapi.vercel.app/films`);
        if (!res.ok)
          throw new Error("Failed to fetch movies. Please try again later.");
        const data = await res.json();
        setMovies(data);
        console.log(data);

        setAllMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setMovies(allMovies);
    } else {
      const filtered = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      );
      setMovies(filtered);
      setError(filtered.length === 0 ? "No movies found for your search." : "");
    }
  }, [search, allMovies]);

  return (
    <div className="Kidflix">
      <Header>
        <Navbar />
        <Menu />
        <HeaderTitle />
        <HeaderSubSignBtns />
      </Header>

      <Box>
        <SearchBar search={search} onSearch={setSearch} />
        {isLoading && <Loader />}
        {!isLoading && !error && (
          <>
            <MoviesDetail movies={movies} />
          </>
        )}
        {error && <ErrorMessage message={error} />}
      </Box>

      <Footer />
    </div>
  );
}

// COMPONENTS

function Header({ children }) {
  return <header className="header">{children}</header>;
}

function Navbar() {
  return (
    <nav className="navbar">
      <a href="#" className="logo">
        🧸 Kidflix
      </a>

      <ul className="nav-links">
        <li>
          <a href="#">HOME</a>
        </li>

        <li className="new-list">
          <a href="#">NEW</a>
          <ul>
            {["Superhero", "Classics", "Magical"].map((item) => (
              <li key={item}>
                <a href="#">{item}</a>
              </li>
            ))}
          </ul>
        </li>

        <li>
          <a href="#">POPULAR</a>
        </li>

        <li>
          <a href="#">CONTACT US</a>
        </li>
      </ul>
      <li>
        <a href="#" className="navbar-logIn">
          Login
        </a>
      </li>
    </nav>
  );
}
function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <div className="hamburger-menu">
        <ul className="hamburger-menu-head">
          <li>
            <a href="#">🧸 Kidflix</a>
          </li>
          <li className="menu-icon" onClick={toggleMenu}>
            <span>{menuOpen ? "✖" : "☰"}</span>
          </li>
        </ul>
      </div>
      {menuOpen && (
        <ul className="menuList">
          <li>
            <a href="#">HOME</a>
          </li>

          <li className="menuList-new">
            <a href="#">NEW</a>
            <ul className="new-list">
              {["Superhero", "Classics", "Magical"].map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <a href="#">POPULAR</a>
          </li>

          <li>
            <a href="#">CONTACT US</a>
          </li>
          <li>
            <a href="#">Login</a>
          </li>
        </ul>
      )}
    </>
  );
}
function HeaderTitle() {
  return (
    <div className="header-title">
      <h1>Watch, Smile & Dream Big with Kidflix!</h1>
    </div>
  );
}

function HeaderSubSignBtns() {
  return (
    <div className="header-sub-signup">
      <input
        type="text"
        placeholder="Type your email here..."
        className="header-input"
      />
      <button className="btn-subscribe">
        Get Started <strong>&gt;</strong>
      </button>
    </div>
  );
}

function Box({ children }) {
  return (
    <div className="movieBox">
      <h1 className="movieBoxTitle">Free cartoons and animations</h1>
      {children}
    </div>
  );
}

function MoviesDetail({ movies }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [flippedCard, setFlippedCard] = useState(null);

  function handlePopup(movie) {
    setSelectedMovie(selectedMovie?.id === movie.id ? null : movie);
  }

  function closePopup() {
    setSelectedMovie(null);
  }

  function handleCardFlip(movieId) {
    setFlippedCard(flippedCard === movieId ? null : movieId);
  }

  return (
    <section className="movies">
      {movies.map((movie) => (
        <div
          className={`box ${flippedCard === movie.id ? "flipped" : ""}`}
          key={movie.id}
          onClick={() => handleCardFlip(movie.id)}
        >
          <div className="box-inner">
            <div className="front">
              <img src={movie.image} alt={movie.title} />
            </div>
            <div className="back">
              <h2>Original Title</h2>
              <h3>{movie.original_title}</h3>
              <p>
                <strong>Released date:</strong> {movie.release_date}
              </p>
              <p>
                <strong>Score:</strong> {movie.rt_score}
              </p>
              <button
                className="btn more"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePopup(movie);
                }}
              >
                More
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Popup */}
      <div
        className={`popup-overlay ${selectedMovie ? "show" : ""}`}
        onClick={closePopup}
      >
        {selectedMovie && (
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>
              &times;
            </button>

            <h2>{selectedMovie.title}</h2>
            <h3>{selectedMovie.original_title}</h3>
            <div className="small-screen-dis">
              <h5>{selectedMovie.original_title}</h5>
              <h4>Discretion</h4>
              <text>{selectedMovie.description}</text>
            </div>
            <p>
              <strong>Director:</strong> {selectedMovie.director}
            </p>
            <p>
              <strong>Release Date:</strong> {selectedMovie.release_date}
            </p>
            <p>
              <strong>Score:</strong> {selectedMovie.rt_score}
            </p>
            <div className="popup-footer">
              <img
                className="popup-img"
                src={selectedMovie.image}
                alt={selectedMovie.id}
              />

              <div className="popup-description">
                <h3>Discretion</h3>
                <p>{selectedMovie.description}</p>
              </div>
            </div>
            <button className="btn play">Watch</button>
          </div>
        )}
      </div>
    </section>
  );
}

function SearchBar({ search, onSearch }) {
  return (
    <div className="header-search">
      <div className="search-icon"></div>
      <input
        type="text"
        placeholder="🎞️ Free cartoons, animations, fairy tales & more!"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}

function Loader() {
  return <h1 style={{ color: "#fff" }}>Loading...</h1>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-top-part part1">
          <a href="#" className="footer-logo">
            🧸 Kidflix
          </a>
          <HeaderSubSignBtns />
        </div>
        <div className="footer-top-part">
          <h2>Frontend</h2>
          <ul>
            <li>
              <a href="#">HTML5</a>
            </li>
            <li>
              <a href="#">CSS</a>
            </li>
            <li>
              <a href="#">JavaScript</a>
            </li>
            <li>
              <a href="#">React.js</a>
            </li>
          </ul>
        </div>
        <div className="footer-top-part">
          <h2>Quick Links</h2>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">Contribute</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Sitemap</a>
            </li>
          </ul>
        </div>
        <div className="footer-top-part">
          <h2>ABOUT</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque
            ducimus impedit quos atque officia enim iste consequatur tempora eum
            maxime. Cupiditate porro laborum eaque reiciendis quidem.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          <i>© 2025</i> Abdul Rashid Aymaq. React JS Project. All rights
          reserved.
        </p>
        <div className="social-links">
          <a
            href="https://www.facebook.com/yourprofile"
            target="_blank"
            rel="noreferrer noopener"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/yourprofile"
            target="_blank"
            rel="noreferrer noopener"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a
            href="https://github.com/Aymaq-code"
            target="_blank"
            rel="noreferrer noopener"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://wa.me/0093708760475"
            target="_blank"
            rel="noreferrer noopener"
          >
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
