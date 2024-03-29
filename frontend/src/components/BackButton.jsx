import { FaReply } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <Link onClick={() => navigate(-1)} className="button is-info is-outlined">
      <span className="icon">
        <FaReply />
      </span>
      <span>Vissza</span>
    </Link>
  );
}

export default BackButton;
