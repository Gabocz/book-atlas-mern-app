import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaRegUser, FaEnvelope, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import Spinner from "../components/Spinner";

function Register({ setIsLoading, isLoading }) {
  const { registerUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (password.length < 6) {
      toast.error("A jelszónak minimum 6 karakter hosszúnak kell lennie!");
      setIsLoading(false);
      return;
    }

    if (password !== password2) {
      toast.error("A jelszavak nem egyeznek.");
      setIsLoading(false);
      return;
    } else {
      const userData = {
        name,
        email,
        password,
      };
      await registerUser(userData).then((data) => {
        if (data) {
          toast.success("Sikeres regisztráció");
          navigate("/");
          setIsLoading(false);
        } else {
          toast.error("Sikertelen regisztráció. Próbáld újra.");
          setIsLoading(false);
          setFormData({
            name: "",
            email: "",
            password: "",
            password2: "",
          });
        }
      });
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="column">
      <header className="block px-2 py-2">
        <h1 className="title is-3 is-size-4-mobile">
          <i className="mr-2">
            <FaRegUser />
          </i>
          Regisztráció
        </h1>
      </header>
      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="field">
            <label id="name" className="label">
              Név
            </label>
            <div className="control has-icons-left">
              <input
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                className="input"
                type="text"
                placeholder="Név"
                required
              />
              <span className="icon is-small is-left">
                <FaUser />
              </span>
            </div>
          </div>
          <div className="field">
            <label id="email" className="label">
              Email
            </label>
            <div className="control has-icons-left">
              <input
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                className="input"
                type="email"
                placeholder="Email"
                required
              />
              <span className="icon is-small is-left">
                <FaEnvelope />
              </span>
            </div>
          </div>
          <div className="field">
            <label id="password" className="label">
              Jelszó
            </label>
            <div className="control">
              <input
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                className="input"
                type="password"
                minLength={6}
                placeholder="Jelszó"
                required
                autoComplete="true"
              />
            </div>
          </div>
          <div className="field">
            <label id="password2" className="label">
              Jelszó még egyszer
            </label>
            <div className="control">
              <input
                id="password2"
                name="password2"
                value={password2}
                onChange={onChange}
                className="input"
                type="password"
                placeholder="Jelszó még egyszer"
                required
                autoComplete="true"
              />
            </div>
          </div>
          <div className="field is-fullwidth mt-5">
            <div className="control">
              <button className="button is-outlined is-link is-responsive">
                <span className="icon">
                  <FaCheck />
                </span>
                <span>Regisztrálok</span>
              </button>
            </div>
          </div>
        </form>
        <div className="mt-4">
          <Link className="is-underlined" to="/login">
            Regisztráltál már? Lépj be!
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Register;
