import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

function UserUploads({ profileUser, usersBooks }) {
  const { user } = useContext(UserContext);

  return (
    <div className="panel">
      <h3 className="panel-heading">
        {user.id === profileUser.id ? "Feltöltéseim:" : "Feltöltései:"}
      </h3>
      {usersBooks.length > 0 ? (
        <>
          <ul>
            {usersBooks.map((book) => (
              <Link
                key={book._id}
                to={"/books/" + book._id}
                className="panel-block"
              >
                <p>
                  {book.author}: {book.title}
                </p>
              </Link>
            ))}
          </ul>
          <div className="panel-block">
            <button className="button is-link is-outlined is-fullwidth">
              Következő
            </button>
          </div>
        </>
      ) : (
        <p className="panel-block is-size-6-mobile">
          Még nincsenek feltöltött könyvek.
        </p>
      )}
    </div>
  );
}

export default UserUploads;
