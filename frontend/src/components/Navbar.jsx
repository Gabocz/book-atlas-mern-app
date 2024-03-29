import { useState, useContext } from "react";
import {
  FaBookOpen,
  FaSearch,
  FaSignOutAlt,
  FaUpload,
  FaUser,
  FaQuestionCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import { searchBooks } from ".//../helpers/book";
import TestUserLogin from "./TestUserLogin";

function Navbar({ setFoundBooks, setIsLoading, setCurrentPage }) {
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useContext(UserContext);
  const { logout } = useContext(UserContext);

  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    toast.success("Sikeres kilépés.");
    navigate("/");
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      return toast.error("A kereséshez írj valamit a keresőmezőbe.");
    }
    setIsLoading(true);
    await searchBooks(searchTerm).then((data) => {
      if (data) {
        setFoundBooks(data);
        navigate("books/search-results");
        setSearchTerm("");
        setIsLoading(false);
      } else {
        setFoundBooks([]);
        navigate("books/search-results");
        setSearchTerm("");
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <nav
        className="navbar mt-1"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link
            className="navbar-item   has-text-weight-bold is-size-4"
            to="/"
            onClick={() => setCurrentPage(1)}
          >
            <span className="icon is-small mr-1">
              <FaBookOpen />
            </span>
            <span className="is-size-5-mobile">BookAtlas</span>
          </Link>
          <Link
            onClick={() => setIsActive(!isActive)}
            role="button"
            className={isActive ? "navbar-burger is-active" : "navbar-burger"}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbar"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </Link>
        </div>
        <div className={isActive ? "navbar-menu is-active" : "navbar-menu"}>
          <div className="navbar-start">
            <div className="navbar-item">
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <div className="control has-icons-right">
                    <input
                      onChange={handleChange}
                      value={searchTerm}
                      className="input is-info is-rounded"
                      type="text"
                      placeholder="Keresés"
                    />
                    <span className="icon is-small is-right">
                      <FaSearch />
                    </span>
                  </div>
                </div>
              </form>
            </div>
            <div className="navbar-item">
              <Link
                to="/cluster-map"
                className="button is-info is-rounded"
                role="button"
              >
                Klasztertérkép
              </Link>
            </div>
          </div>
          {user ? (
            <>
              <div className="navbar-end">
                <div className="navbar-item">
                  <div className="buttons">
                    <Link to="/about" className="button is-light">
                      <span className="icon">
                        <FaQuestionCircle />
                      </span>
                      <span className="is-underlined">Rólunk</span>
                    </Link>
                  </div>
                </div>
                <div className="navbar-item">
                  <div className="buttons">
                    <Link to="/new-book" className="button is-light">
                      <span className="icon">
                        <FaUpload />
                      </span>
                      <span>Könyvfeltöltés</span>
                    </Link>
                  </div>
                </div>
                <div className="navbar-item">
                  <div className="buttons">
                    <Link
                      to={`/users/my-profile`}
                      className="button is-light is-active"
                    >
                      <span className="icon">
                        <FaUser />
                      </span>
                      <strong>{user.name}</strong>
                    </Link>
                  </div>
                </div>
                <div className="navbar-item">
                  <div className="buttons">
                    <button onClick={onLogout} className="button is-light">
                      <span className="icon">
                        <FaSignOutAlt />
                      </span>
                      <span>Kilépés</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <Link to="/about" className="button is-light">
                    <span className="is-underlined">Rólunk</span>
                  </Link>
                </div>
              </div>
              <div className="navbar-item">
                <div className="buttons">
                  <Link
                    to="/register"
                    className="button is-dark is-outlined is-responsive"
                  >
                    <span>Regisztráció</span>
                  </Link>
                  <Link
                    to="/login"
                    className="button is-dark is-outlined is-responsive"
                  >
                    Bejelentkezés
                  </Link>
                  <TestUserLogin />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
