import { useState, useEffect, useContext } from "react";
import { FaUser, FaEnvelope, FaEdit, FaSave } from "react-icons/fa";
import UserUploads from "../components/UserUploads";
import UserWishlist from "../components/UserWishlist";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import { getCurrentUser } from "../helpers/user";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

function Profile({ setIsLoading, isLoading }) {
  const { user } = useContext(UserContext);
  const { updateUser } = useContext(UserContext);
  const { token, id } = user;

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const { name, email } = formData;

  const [changeDetails, setChangeDetails] = useState(false);
  const [currentUserUploads, setCurrentUserUploads] = useState([]);
  const [currentUserWishlist, setCurrentUserWishlist] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const user = await getCurrentUser(token);
      setCurrentUserUploads(user.uploadedBooks);
      setCurrentUserWishlist(user.wishlistedBooks);
      setIsLoading(false);
    })();
  }, [setIsLoading, id, token]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    if (!name || !email) {
      toast.error("Töltsd ki az összes kötelező mezőt.");
      return;
    }
    setIsLoading(true);
    await updateUser(formData).then((res) => {
      if (res.name === "AxiosError") {
        toast.error(res.response.data.msg);
        setChangeDetails(false);
        setFormData({ name: user.name, email: user.email });
        setIsLoading(false);
        return;
      }
      toast.success("Sikeres adatmódosítás.");
      setChangeDetails(false);
      setIsLoading(false);
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <header className="message">
        <div className="message-header">
          <p>Profilom</p>
        </div>
      </header>
      <div className="columns">
        <div className="column is-third">
          <div className="panel has-background-grey-lighter">
            <h3 className="panel-heading has-background-grey-lighter">
              Adataim szerkesztése
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <div className="panel-block">
                  <label id="name" className="label">
                    Név
                  </label>
                </div>
                <div className="panel-block">
                  <div className="control has-icons-left">
                    <input
                      id="name"
                      name="name"
                      value={name}
                      onChange={handleChange}
                      className="input"
                      type="text"
                      disabled={!changeDetails}
                    />
                    <span className="icon is-small is-left">
                      <FaUser />
                    </span>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="panel-block">
                  <label id="email" className="label">
                    Email
                  </label>
                </div>
                <div className="panel-block">
                  <div className="control has-icons-left">
                    <input
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      className="input"
                      type="email"
                      disabled={!changeDetails}
                    />
                    <span className="icon is-small is-left">
                      <FaEnvelope />
                    </span>
                  </div>
                </div>
              </div>
            </form>
            <div className="field">
              <div className="panel-block">
                <div className="control mb-2">
                  <button
                    className="button button is-dark is-outlined is-fullwidth"
                    onClick={() => {
                      changeDetails && handleSubmit();
                      setChangeDetails((prevState) => !prevState);
                    }}
                  >
                    {changeDetails ? (
                      <>
                        <span className="icon">
                          <FaSave />
                        </span>
                        <span>Mentés</span>
                      </>
                    ) : (
                      <>
                        <span className="icon">
                          <FaEdit />
                        </span>
                        <span>Szerkesztés</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="column is-third">
          <UserUploads profileUser={user} userUploads={currentUserUploads} />
        </div>
        <div className="column is-third">
          <UserWishlist profileUser={user} userWishlist={currentUserWishlist} />
        </div>
      </div>
      <BackButton />
    </>
  );
}

export default Profile;
