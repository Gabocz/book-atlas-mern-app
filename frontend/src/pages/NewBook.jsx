import { useState, useContext } from "react";
import FileUploader from "../components/FileUploader";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addBook } from "../helpers/book";
import { UserContext } from "../context/UserContext";
import Spinner from "../components/Spinner";
import ButtonGroup from "../components/ButtonGroup";
import { axiosError } from "../helpers/axiosError";

function NewBook({ setIsLoading, isLoading }) {
  const [fileList, setFileList] = useState(null);
  const [canSubmit, setCanSubmit] = useState(true);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [lang, setLang] = useState("");

  const files = fileList ? [...fileList] : [];

  const { user } = useContext(UserContext);
  const { token } = user;

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.files.length > 3) {
      setCanSubmit(false);
      return toast.error("Legfeljebb 3 képet tölthetsz fel.", {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: "dark",
      });
    } else {
      setCanSubmit(true);
      setFileList(e.target.files);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const bookData = new FormData();

    files.forEach((file, i) => {
      bookData.append("image", file, file.name);
    });
    bookData.append("author", author);
    bookData.append("title", title);
    bookData.append("location", location);
    bookData.append("lang", lang);

    await addBook(token, bookData).then((res) => {
      if (axiosError(res)) {
        toast.error(`Hiba! ${res.errorMessage}`);
        setIsLoading(false);
        return;
      }

      navigate("/");
      toast.success("Sikeres feltöltés");
      setIsLoading(false);
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="column">
      <header className="block px-2 py-2">
        <h1 className="title is-3 is-size-4-mobile">Tölts fel új könyvet!</h1>
      </header>
      <section className="form">
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <div className="field">
            <label id="author" className="label">
              Szerző
            </label>
            <div className="control">
              <input
                onChange={(e) => setAuthor(e.target.value)}
                id="author"
                name="author"
                value={author}
                className="input"
                type="text"
                placeholder="Szerző"
                required
              />
            </div>
          </div>
          <div className="field">
            <label id="title" className="label">
              Cím
            </label>
            <div className="control">
              <input
                onChange={(e) => setTitle(e.target.value)}
                id="title"
                name="title"
                value={title}
                className="input"
                type="text"
                placeholder="Cím"
                required
              />
            </div>
          </div>
          <div className="field">
            <label id="lang" className="label">
              Nyelv
            </label>
            <div className="control">
              <input
                onChange={(e) => setLang(e.target.value)}
                id="lang"
                name="lang"
                value={lang}
                className="input"
                type="text"
                placeholder="Nyelv"
              />
            </div>
          </div>
          <div className="field">
            <label id="location" className="label">
              Város*, utca, házszám
              <small className="is-size-7"> (*Kötelező)</small>
            </label>
            <div className="control">
              <input
                onChange={(e) => setLocation(e.target.value)}
                id="location"
                name="location"
                value={location}
                className="input"
                type="text"
                placeholder="Város"
                required
              />
            </div>
          </div>
          <FileUploader handleChange={handleChange} fileList={fileList} />
          <ButtonGroup
            canSubmit={canSubmit}
            btnText="Feltöltöm"
            icon={<FaCheck />}
          />
        </form>
      </section>
    </div>
  );
}

export default NewBook;
