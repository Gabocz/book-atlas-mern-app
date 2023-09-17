import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

function UserUploads({ profileUser, userUploads }) {
  const { user } = useContext(UserContext);

  return (
    <div className="panel">
      <h3 className="panel-heading">
        {user.id === profileUser.id ? "Feltöltéseim:" : "Feltöltései:"}
      </h3>
      {userUploads.length > 0 ? (
        <>
          <ul>
            {userUploads.map((book) => (
              <Link
                key={book.id}
                to={"/books/" + book.id}
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
              Több betöltése
            </button>
          </div>
        </>
      ) : (
        <p className="panel-block">Még nincsenek feltöltött könyvek.</p>
      )}
    </div>
  );
}

export default UserUploads;
