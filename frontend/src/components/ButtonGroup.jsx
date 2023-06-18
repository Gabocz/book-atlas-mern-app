import BackButton from "./BackButton"


function ButtonGroup({ btnText, canSubmit, icon }) {
    return (
        <div className="field is-grouped mt-2">
          <div className="control">
            <BackButton/>
          </div>
          <div className="control">
            <button type="submit" className="button has-background-info has-text-light is-responsive" disabled={!canSubmit}>
              <span className="icon">{icon}</span>
              <span>{btnText}</span>
            </button>
          </div>
        </div>
    )
}

export default ButtonGroup
