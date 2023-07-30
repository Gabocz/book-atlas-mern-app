import { FaUpload } from "react-icons/fa"

function FileUploader({handleChange, fileList}) {
    return (
      <div className="file has-name">
        <label id="image" className="file-label">
          <input
            onChange={handleChange}
            id="image"
            name="image"
            className="file-input" 
            type="file"
            multiple
          />
          <span className="file-cta">
            <span className="file-icon">
              <FaUpload/>
            </span>
            <span className="file-label">
              Képfeltöltés
            </span>
          </span>
          <span className="file-name">
            {fileList && fileList.length ? fileList.length : 0} fájl kiválasztva
          </span>
        </label>
      </div>
    )
}

export default FileUploader
