import { Link } from 'react-router-dom'

function Pagination({ totalPages, paginate }) {
    
    const pageNumbers = []

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
    }
    
    return (
        <nav className="pagination is-centered" role="navigation" aria-label="pagination">
            <ul className="pagination-list">
                {pageNumbers.map(number => (
                    <li key={number}>
                        <Link 
                          onClick={() => paginate(number)}
                          className="pagination-link" 
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
