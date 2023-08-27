import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function UserWishList({ profileUser, usersBooks }) {
  const { user } = useContext(UserContext);

  return (
    <div className="panel">
      <h3 className="panel-heading">
        {user.id === profileUser.id ? "Kívánságlistám:" : "Kivánságlistája: "}
      </h3>
      <ul>
        <Link className="panel-block">1 Könyv</Link>
        <Link className="panel-block">2 Könyv</Link>
        <Link className="panel-block">3 Könyv</Link>
        <Link className="panel-block">4 Könyv</Link>
        <Link className="panel-block">5 Könyv</Link>
      </ul>
      <div className="panel-block">
        <button className="button is-link is-outlined is-fullwidth">
          Következő
        </button>
      </div>
    </div>
  );
}

export default UserWishList;
