import { Link } from 'react-router-dom'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'

function Pagination({ totalPages, paginate, currentPage }) {
    
    const pageNumbers = []

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
    }
    
    return (
        <nav className="pagination is-centered" role="navigation" aria-label="pagination">
            <Link 
              onClick={() => currentPage !== 1 && paginate(currentPage - 1)} 
              className="pagination-previous"
              disabled={currentPage === 1}
            >
                <span className="icon">
                    <FaAngleLeft/>
                </span>
                <span className="has-text-weight-medium"> Előző</span>
            </Link>
            <Link 
              onClick={() => currentPage !==totalPages && paginate(currentPage + 1)} 
              className="pagination-next"
              disabled={currentPage === totalPages}
            >
                <span className="has-text-weight-medium">Következő</span>
                <span className="icon">
                <FaAngleRight/>
                </span>
            </Link>
            <ul className="pagination-list">
                {pageNumbers.map(number => (
                    <li key={number}>
                        <Link 
                          onClick={() => paginate(number)}
                          className={number === currentPage ? "pagination-link is-current has-text-weight-medium" : "pagination-link"}
                          aria-label={"Goto page " + number}>
                            {number}
                        </Link>
                    </li>
                )
                )}
            </ul>
        </nav>
    )
}

export default Pagination
