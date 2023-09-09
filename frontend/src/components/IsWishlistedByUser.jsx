import { FaHeart } from "react-icons/fa";

function IsWishlistedByUser() {
  return (
    <span className="tag is-normal is-rounded is-danger is-light pb-1">
      <FaHeart />
    </span>
  );
}

export default IsWishlistedByUser;
