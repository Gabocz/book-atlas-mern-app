const User = require("../models/userModel");
const Book = require("../models/bookModel");
const CustomError = require("../errors");
const checkUserPermissions = require("../utils/checkUserPermissions");
const { StatusCodes } = require("http-status-codes");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError.BadRequestError(
      "Add meg a neved, az e-mail címed és a jelszavad."
    );
  }

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError(
      `A(z) ${email} címmel már létezik felhasználó. Jelentkezz be vagy használj másik email címet.`
    );
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  res.status(StatusCodes.CREATED).json({
    id: user._id,
    name: user.name,
    email: user.email,
    token: user.createJWT(),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError(
      "Add meg az email címet és a jelszót."
    );
  }

  const user = await User.findOne({ email }).populate({
    path: "wishlist",
    select: "author title",
  });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Érvénytelen hitelesítés.");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Érvénytelen hitelesítés.");
  }

  res.status(StatusCodes.OK).json({
    id: user._id,
    name: user.name,
    email: user.email,
    wishlist: user.wishlist,
    token: user.createJWT(),
  });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError("Add meg az email címed és a neved.");
  }

  const foundUser = await User.findById(req.params.id);

  if (!foundUser) {
    throw new CustomError.NotFoundError(
      `Nem található felhasználó ${req.params.id} azonosítóval.`
    );
  }

  if (foundUser.name === name && foundUser.email === email) {
    throw new CustomError.BadRequestError("Az adatok nem változtak.");
  }

  checkUserPermissions(req.user, foundUser);

  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });
  res.status(StatusCodes.OK).json({
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    token: updatedUser.createJWT(),
  });
};

const addBookToMyWishlist = async (req, res) => {
  const { bookId } = req.body;
  const book = await Book.findById(bookId);
  if (!book) {
    throw new CustomError.NotFoundError(
      `Nem található könyv ${bookId} azonosítóval.`
    );
  }
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new CustomError.NotFoundError(
      `Nem található felhasználó ${req.params.id} azonosítóval.`
    );
  }

  if (user._id.toString() !== req.user.id) {
    throw new CustomError.UnauthorizedError("Hozzáférés megtagadva!");
  }

  if (user.wishlist.includes(bookId) || book.wishlistedBy.includes(user._id)) {
    throw new CustomError.BadRequestError(
      "Ezt a könyvet már kívánságlistáztad!"
    );
  }
  user.wishlist.push(bookId);
  book.wishlistedBy.push(user._id);
  await user.save();
  await book.save();

  res.status(StatusCodes.OK).json({ msg: "Könyv kívánságlistához adva!" });
};

const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate({
      path: "wishlist",
      select: "author title",
    })
    .populate({
      path,
    });
  if (!user) {
    throw new CustomError.NotFoundError(
      `Nem található felhasználó ${req.params.id} azonosítóval.`
    );
  }
  res.status(StatusCodes.OK).json(user);
};

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  addBookToMyWishlist,
  getSingleUser,
  getAllUsers,
};
