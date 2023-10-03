import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaHeart, FaRegHeart, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Map from "../components/Map";
import ImgCarouselControl from "../components/ImgCarouselControl";
import BackButton from "../components/BackButton";
import { fetchBook, deleteBook, updateBook } from "../helpers/book";
import Spinner from "../components/Spinner";
import BookCard from "../components/BookCard";
import { axiosError } from "../helpers/axiosError";

function Book({ isLoading, setIsLoading }) {
  const { user } = useContext(UserContext);
  const [book, setBook] = useState(null);
  const [wishlistedByUser, setWishlistedByUser] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 46.2530102,
    lng: 20.1414253,
  });

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchBook(params.id).then((res) => {
        if (axiosError(res)) {
          setIsLoading(false);
          toast.error(res.errorMessage);
          return;
        }
        setBook(res);
        if (user) {
          setWishlistedByUser(
            res.wishlistedBy.map((user) => user.id).includes(user.id)
          );
        }
        const { geolocation } = res;
        setMapCenter(geolocation);
        setIsLoading(false);
      });
    })();
  }, [params.id, setIsLoading, navigate, user]);

  const handleDelete = async () => {
    setIsLoading(true);
    if (window.confirm("Biztosan törölni szeretnéd ezt a könyvet?")) {
      await deleteBook(params.id, user.token).then((res) => {
        if (axiosError(res)) {
          setIsLoading(false);
          toast.error(res.errorMessage);
          return;
        }
        toast.success("Sikeres törlés.");
        setIsLoading(false);
        navigate(`/users/my-profile`);
      });
    }
  };

  const handleRemoveFromWishlist = async () => {
    setIsLoading(true);
    await updateBook(
      book._id,
      user.token,
      { userId: user.id },
      { method: "delete" }
    ).then((res) => {
      if (axiosError(res)) {
        toast.error(res.errorMessage);
        setIsLoading(false);
        return;
      } else {
        setBook(res.data);
        setWishlistedByUser(false);
        toast.success("Könyv levéve a kívánságlistáról.");
        setIsLoading(false);
      }
    });
  };

  const handleAddToWishlist = async () => {
    setIsLoading(true);
    await updateBook(book._id, user.token, { userId: user.id }).then((res) => {
      if (axiosError(res)) {
        setIsLoading(false);
        toast.error(res.errorMessage);
        return;
      } else {
        setBook(res.data);
        setWishlistedByUser(true);
        toast.success("Könyv kívánságlistához adva!");
        setIsLoading(false);
      }
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="column">
      {book && book.user && (
        <div className="columns is-multiline">
          <div className="column is-half">
            <BookCard
              book={book}
              bookOwner={book.user}
              ImgCarouselControl={ImgCarouselControl}
              wishlistedByUser={wishlistedByUser}
            />
          </div>
          <div className="column is-half">
            <Map
              mapCenter={mapCenter}
              author={book.author}
              title={book.title}
            />
          </div>
          <div className="column">
            <div className="field is-grouped">
              <p className="control">
                <BackButton />
              </p>
              {user && user.id === book.user._id ? (
                <>
                  <p className="control">
                    <Link
                      to={`/books/${book._id}/edit`}
                      className="button is-warning"
                    >
                      <span className="icon">
                        <FaEdit />
                      </span>
                      <span>Szerkeszt</span>
                    </Link>
                  </p>
                  <p className="control">
                    <button
                      onClick={handleDelete}
                      className="button is-outlined is-danger"
                    >
                      <span className="icon">
                        <FaTrashAlt />
                      </span>
                      <span>Törlés</span>
                    </button>
                  </p>
                </>
              ) : (
                user &&
                book.user !== null && (
                  <>
                    {wishlistedByUser ? (
                      <p className="control">
                        <button
                          onClick={handleRemoveFromWishlist}
                          className="button is-outlined is-danger"
                        >
                          <span className="icon">
                            <FaRegHeart />
                          </span>
                          <span>Levétel a kívánságlistáról</span>
                        </button>
                      </p>
                    ) : (
                      <p className="control">
                        <button
                          onClick={handleAddToWishlist}
                          className="button is-outlined is-danger"
                        >
                          <span className="icon">
                            <FaHeart />
                          </span>
                          <span>Kívánságlistára</span>
                        </button>
                      </p>
                    )}
                    <p className="control">
                      <a
                        className="button is-success"
                        href={`mailto: ${book.user.email}?Subject=${
                          book.author + ": " + book.title
                        }`}
                      >
                        Kapcsolatfelvétel
                      </a>
                    </p>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Book;
