const stripBooks = (booksArray) => {
  const strippedBooksArr = booksArray.map((book) => ({
    title: book.title,
    author: book.author,
    id: book._id,
  }));
  return strippedBooksArr;
};

module.exports = stripBooks;
