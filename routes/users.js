var express = require("express");
var router = express.Router();
const {
  getUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../Controllers/userController");

/* GET users listing. */
router.get("/", getUsers);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

module.exports = router;
