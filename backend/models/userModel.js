const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Kérlek, add meg a neved."],
      minLength: [3, "A felhasználónév nem lehet rövidebb 3 karakternél"],
      maxLength: [50, "A felhasználónév nem lehet hosszabb 50 karakternél"],
    },
    email: {
      type: String,
      required: [true, "Kérlek, add meg az email címed."],
      validate: {
        validator: validator.isEmail,
        message: "Kérlek, adj meg egy érvényes email címet.",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Kérlek, add meg a jelszavad."],
      minLength: [6, "A jelszó túl rövid."],
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
