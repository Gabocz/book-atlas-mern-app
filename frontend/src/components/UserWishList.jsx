import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function UserWishList({ profileUser }) {
  const { user } = useContext(UserContext);

  return (
    <div className="panel">
      <h3 className="panel-heading">
        {user.id === profileUser.id ? "Kívánságlistám:" : "Kivánságlistája: "}
      </h3>
      {profileUser.wishlist.length ? (
        <>
          <ul>
            {profileUser.wishlist.map((wishlitedBook) => (
              <Link key={wishlitedBook.id} className="panel-block">
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
