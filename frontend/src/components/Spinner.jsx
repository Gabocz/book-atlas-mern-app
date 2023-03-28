function Spinner() {
    return (
        <div className="columns is-mobile is-centered mt-6">
            <div className="column is-half is-offset-one-quarter">
            <button className="button is-loading is-large is-white" disabled >Loading</button>
            </div>
        </div>
    )
}

export default Spinner
