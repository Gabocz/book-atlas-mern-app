const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/Auth");
const testUser = require("../middleware/testUser");
const multer = require("multer");
const { sendUploadToGCS } = require("../middleware/upload");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: 1024 * 1024,
});

const {
  registerBook,
  getBooks,
  searchBooks,
  updateBook,
  deleteBook,
  getBook,
} = require("../controllers/bookController");

router
  .route("/")
  .post(
    authenticateUser,
    testUser,
    upload.array("image", 3),
    sendUploadToGCS,
    registerBook
  )
  .get(getBooks);

router.route("/search").get(searchBooks);

router
  .route("/:id")
  .get(getBook)
  .patch(
    authenticateUser,
    testUser,
    upload.array("image", 3),
    sendUploadToGCS,
    updateBook
  )
  .delete(authenticateUser, testUser, deleteBook);

module.exports = router;
