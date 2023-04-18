var express = require("express");
var router = express.Router();
const {
  getUsers,
  getUser,
  registerUser,
  loginUser,
  refreshUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} = require("../Controllers/userController");

/* GET users listing. */
router.get("/", getUsers);

router.get("/:id", getUser);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/refresh", refreshUser);

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

router.delete("/delete-all", deleteAllUsers);

module.exports = router;
