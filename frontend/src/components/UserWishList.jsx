import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import IsWishlistedByUser from "./IsWishlistedByUser";

function UserWishlist({ profileUser, userWishlist }) {
  const { user } = useContext(UserContext);

  return (
    <div className="panel">
      <h3 className="panel-heading">
        {user.id === profileUser.id ? "Kívánságlistám:" : "Kivánságlistája: "}
      </h3>
      {userWishlist.length ? (
        <>
          <ul>
            {userWishlist.map((wishlitedBook) => (
              <Link
                to={"/books/" + wishlitedBook.id}
                key={wishlitedBook.id}
                className="panel-block"
              >
                <IsWishlistedByUser />
                {wishlitedBook.author}: {wishlitedBook.title}
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
        <p className="panel-block">Nincsenek könyvek a kívánságlistán.</p>
      )}
    </div>
  );
}

export default UserWishlist;
