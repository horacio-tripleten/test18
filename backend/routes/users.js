const express = require("express");
const router = express.Router();
const { celebrate } = require("celebrate");
const { updateUserValidationSchema } = require("../models/user");

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  deleteUser,
} = require("../controllers/users");

router.get("/users/me", getUsers);
router.get("/users/:userId", getUserById);
router.patch("/users/avatar", updateAvatar);
router.delete("/users/me", deleteUser);

router.patch(
  "/users/me",
  celebrate({
    body: updateUserValidationSchema,
  }),
  updateUser
);

module.exports = router;
