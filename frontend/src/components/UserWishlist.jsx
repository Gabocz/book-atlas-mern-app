import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function UserWishList({ profileUser, userWishlist }) {
  const { user } = useContext(UserContext);

  return (
    <div className="panel">
      <h3 className="panel-heading">
        {user.id === profileUser._id ? "Kívánságlistám:" : "Kivánságlistája: "}
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
                {wishlitedBook.author}: {wishlitedBook.title}
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
        <p className="panel-block">Nincsenek könyvek a kívánságlistán.</p>
      )}
    </div>
  );
}

export default UserWishList;
