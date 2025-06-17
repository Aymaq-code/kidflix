import { useEffect, useState } from "react";

export default function App() {
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
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

  // function handAddlWatchList(movie) {
  //   setWatched((prev) =>
  //     prev.some((m) => m.id === movie.id) ? prev : [...prev, movie]
  //   );
  // }

  // function deleteWatchListMovie(movieId) {
  //   setWatched((prev) => prev.filter((movie) => movie.id !== movieId));
  // }

  return (
    <div className="Kidflix">
      <Header>
        <Navbar />
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
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Close menu when clicking a menu link (mobile)
  const handleLinkClick = () => {
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <a href="#" className="logo">
        🧸 Kidflix
      </a>

      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? "✖" : "☰"}
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <a href="#" onClick={handleLinkClick}>
            HOME
          </a>
        </li>

        <li className="new-list">
          <a href="#" onClick={handleLinkClick}>
            NEW
          </a>
          <ul>
            {["Superhero", "Classics", "Magical"].map((item) => (
              <li key={item}>
                <a href="#" onClick={handleLinkClick}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </li>

        <li>
          <a href="#" onClick={handleLinkClick}>
            POPULAR
          </a>
        </li>

        <li>
          <a href="#" onClick={handleLinkClick}>
            CONTACT US
          </a>
        </li>
        <li className="navbar-logIn">
          <a href="#" onClick={handleLinkClick}>
            Login
          </a>
        </li>
      </ul>
    </nav>
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

  function handlePopup(movie) {
    setSelectedMovie(selectedMovie?.id === movie.id ? null : movie);
  }

  function closePopup() {
    setSelectedMovie(null);
  }

  return (
    <section className="movies">
      {movies.map((movie) => (
        <div className="box" key={movie.id}>
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
              <button className="btn more" onClick={() => handlePopup(movie)}>
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

function MoviesDetailPopup() {
  return (
    <div className="test">
      <h1>i am popup</h1>
    </div>
  );
}

// function WatchListMovie({ watched, onDeleteWatchListMovie }) {
//   return (
//     <div className="watchLists">
//       {watched.length === 0 ? (
//         <p className="watchListEmptyMsg">
//           Your watch list is empty. Add some movies!
//         </p>
//       ) : (
//         <div className="movies">
//           {watched.map((movie) => (
//             <div className="box small-screen" key={movie.id}>
//               <img src={movie.image} alt={movie.title} />
//               <div className="box-text watch">
//                 <h3>{movie.title}</h3>
//                 <p>
//                   Released {movie.release_date} / Score {movie.rt_score}
//                 </p>
//                 <p>Rating time: {movie.running_time}</p>
//               </div>
//               <button
//                 className="watch-btn"
//                 onClick={() => onDeleteWatchListMovie(movie.id)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

function SearchBar({ search, onSearch }) {
  return (
    <div className="header-search">
      <div className="test"></div>
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
          <a href="https://www.facebook.com/yourprofile" target="_blank">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.linkedin.com/in/yourprofile" target="_blank">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="https://github.com/Aymaq-code" target="_blank">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://wa.me/0093708760475" target="_blank">
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
