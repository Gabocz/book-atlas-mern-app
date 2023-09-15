const Book = require("../models/bookModel");
const User = require("../models/userModel");
const CustomError = require("../errors");
const checkUserPermissions = require("../utils/checkUserPermissions");
const { StatusCodes } = require("http-status-codes");

const registerBook = async (req, res) => {
  const { title, author, location, lang } = req.body;

  if (!title || !author || !location) {
    throw new CustomError.BadRequestError(
      "Töltsd ki az összes kötelező mezőt."
    );
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    throw new CustomError.NotFoundError(
      `Nem található felhasználó ${req.user.id} azonosítóval.`
    );
  }

  const book = await Book({
    title,
    author,
    location,
    lang,
    images: req.files.length
      ? req.files.map((f) => ({
          url: f.cloudStoragePublicUrl,
          filename: f.cloudStorageObject,
        }))
      : { url: undefined, filename: undefined },
    user: req.user.id,
  });

  await book.save();

  res.status(StatusCodes.CREATED).json(book);
};

const updateBook = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new CustomError.NotFoundError(
      `Nem található felhasználó ${req.user.id} azonosítóval.`
    );
  }
  const BookToUpdate = await Book.findById(req.params.id);

  if (!BookToUpdate) {
    throw new CustomError.NotFoundError(
      `Nem található könyv ${req.params.id} azonosítóval.`
    );
  }

  checkUserPermissions(req.user, BookToUpdate.user);

  if (Object.keys(req.body).toString() === "userId") {
    if (BookToUpdate.wishlistedBy.includes(user._id)) {
      throw new CustomError.BadRequestError(
        "Ezt a könyvet már kívánságlistáztad!"
      );
    }
    BookToUpdate.wishlistedBy.push(req.body.userId);
    await BookToUpdate.save();
    res.status(StatusCodes.OK).json({ msg: "Könyv a kívánságlistához adva!" });
  } else {
    const { title, author, location, lang } = req.body;

    const imagesObj = req.files.length
      ? req.files.map((f) => ({
          url: f.cloudStoragePublicUrl,
          filename: f.cloudStorageObject,
        }))
      : { url: undefined, filename: undefined };

    (BookToUpdate.title = title),
      (BookToUpdate.author = author),
      (BookToUpdate.location = location),
      (BookToUpdate.lang = lang),
      (BookToUpdate.images = imagesObj),
      await BookToUpdate.save();

    res.status(StatusCodes.OK).json({ updatedBook: BookToUpdate });
  }
};

const deleteBook = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new CustomError.NotFoundError(
      `Nem található felhasználó ${req.user.id} azonosítóval.`
    );
  }

  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new CustomError.NotFoundError(
      `Nem található könyv ${req.params.id} azonosítóval.`
    );
  }

  checkUserPermissions(req.user, book.user);

  await book.remove();

  res.status(StatusCodes.OK).json({ msg: "Sikeres törlés." });
};

const getBooks = async (req, res) => {
  const { page = 1, limit = 8 } = req.query;
  const books = await Book.find()
    .populate({
      path: "wishlistedBy",
      select: "_id",
    })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .exec();

  if (!books) {
    throw new CustomError.NotFoundError("Még nincsenek feltöltött könyvek.");
  } else {
    const count = await Book.countDocuments();
    res.status(StatusCodes.OK).json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  }
};

const getBook = async (req, res) => {
  const book = await Book.findById(req.params.id)
    .populate({
      path: "user",
      select: "name",
    })
    .populate({
      path: "wishlistedBy",
      select: "_id",
    });
  if (!book) {
    throw new CustomError.NotFoundError(
      `Nem található könyv ${req.params.id} azonosítóval.`
    );
  }
  res.status(StatusCodes.OK).json(book);
};

const searchBooks = async (req, res) => {
  const searchTerm = req.query.query;
  const newReg = new RegExp(searchTerm, "i");

  if (!searchTerm) {
    throw new CustomError.BadRequestError(
      "A kereséshez írj valamit a keresőmezőbe!"
    );
  }

  const books = await Book.find({
    $or: [{ author: { $regex: newReg } }, { title: { $regex: newReg } }],
  });

  if (books.length === 0) {
    throw new CustomError.NotFoundError(
      `A(z) \"${searchTerm}\" kifejezésre a keresés nem hozott eredményt.`
    );
  }

  res.status(StatusCodes.OK).json(books);
};

module.exports = {
  registerBook,
  getBooks,
  getBook,
  searchBooks,
  updateBook,
  deleteBook,
};
