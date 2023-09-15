import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { getUserById } from "../helpers/user";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import UserUploads from "../components/UserUploads";
import UserWishList from "../components/UserWishList";
import { toast } from "react-toastify";
import { axiosError } from "../helpers/axiosError";

function UserProfile({ isLoading, setIsLoading }) {
  const [profileUser, setProfileUser] = useState(null);
  const params = useParams();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getUserById(params.id).then((res) => {
        if (axiosError(res)) {
          toast.error(`${res.errorMessage}`);
          setIsLoading(false);
          return;
        }
        setProfileUser(res);
        setIsLoading(false);
      });
    })();
  }, [params.id, setIsLoading]);

  if (isLoading) {
    return <Spinner />;
  }

  return profileUser ? (
    <div className="column">
      <header className="message">
        <div className="message-header">
          <p>"{profileUser.name}" nevű felhasználó profilja</p>
        </div>
      </header>
      <div className="columns">
        <div className="column">
          <UserUploads
            profileUser={profileUser}
            userUploads={profileUser.uploadedBooks}
          />
        </div>
        <div className="column is-third">
          <UserWishList
            profileUser={profileUser}
            userWishlist={profileUser.wishlistedBooks}
          />
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
