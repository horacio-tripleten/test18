const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Card = require("../models/card");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findById(req.user._id).orFail(
      new Error("document not found")
    );
    res.json(users);
  } catch (err) {
    req.type = "user";
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true }
    );

    if (!updateUser) {
      const error = new Error("");
      error.status = 404;
      throw error;
    }
    res.json(updateUser);
  } catch (err) {
    req.type = "user";
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updateAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    ).orFail(new Error("Document not found"));

    res.json(updateAvatar);
  } catch (err) {
    req.type = "user";
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      const error = new Error("");
      error.status = 404;
      throw error;
    }

    res.json({ message: "User info deleted successfully" });
  } catch (err) {
    req.type = "user";
    next(err);
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, name, about, avatar } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      error: 400,
    });
  }
};

const { JWT_SECRET } = process.env;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Es necesario un email y una contraseña.");
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const error = new Error("Usuario no encontrado.");
      error.status = 401;
      throw error;
    }

    const isPasswordValid = await bycrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Contraseña invalida.");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      JWT_SECRET,
      {
        experiesIn: "7d",
      }
    );
    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  deleteUser,
  createUser,
  login
};
