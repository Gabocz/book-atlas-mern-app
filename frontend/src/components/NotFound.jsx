import BackButton from './BackButton'

function NotFound() {
    return (
        <div className="column mt-1">
           <h1 className="title is-5">A keresett oldal nem található.</h1>
           <BackButton/> 
        </div>
    )
}

export default NotFound
