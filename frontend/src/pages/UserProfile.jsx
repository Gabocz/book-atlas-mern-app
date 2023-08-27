import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { fetchAllBooksByUser } from "../helpers/book";
import { getUserById } from "../helpers/user";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import UserUploads from "../components/UserUploads";
import UserWishList from "../components/UserWishList";
import { toast } from "react-toastify";

function UserProfile({ isLoading, setIsLoading }) {
  const [user, setUser] = useState(null);
  const [usersBooks, setUsersBooks] = useState([]);
  const params = useParams();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const user = await getUserById(params.id);
      setUser(user);
      if (!user) {
        toast.error(`A keresett azonosítóval felhasználó nem található.`);
        setIsLoading(false);
        return;
      }
      const books = await fetchAllBooksByUser(user._id);
      setUsersBooks(books);
      setIsLoading(false);
    })();
  }, [params.id, setIsLoading]);

  if (isLoading) {
    return <Spinner />;
  }

  return user ? (
    <div className="column">
      <header className="message">
        <div className="message-header">
          <p>"{user.name}" nevű felhasználó profilja</p>
        </div>
      </header>
      <div className="columns">
        <div className="column">
          <UserUploads profileUser={user} usersBooks={usersBooks} />
        </div>
        <div className="column is-third">
          <UserWishList profileUser={user} usersBooks={usersBooks} />
        </div>
      </div>
      <div className="panel-block">
        <BackButton />
      </div>
    </div>
  ) : (
    <BackButton />
  );
}

export default UserProfile;
