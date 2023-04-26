const User = require("../Models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Wish = require("../Models/wishSchema");
const Cart = require("../Models/cartSchema");
const Order = require("../Models/ordersSchema");

// GET USERS
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
};

// CREATE NEW USER
const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phoneNumber,
    wishlist,
    cart,
    scope,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);

      const scope = email.includes("@atadmin.com")
        ? "admin"
        : email.includes("@architech.com")
        ? "employee"
        : "customer";

      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        address: {
          street: req.body.address.street,
          city: req.body.address.city,
          state: req.body.address.state,
          zip: req.body.address.zip,
        },
        phoneNumber,
        wishlist,
        cart,
        scope,
      });

      await User.create(user);

      res.status(201).json({ user, token: generateToken(user._id) });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.status(200).json({
      success: true,
      user,
      token: generateToken(user._id),
      refreshToken: refreshToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REFRESH USER LOGIN
const refreshUser = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized, no refresh token" });
  }

  if (!refreshToken.includes(refreshToken)) {
    return res.status(403).json({ message: "Forbidden, tokens not included" });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Forbidden, tokens do not match" });
    }

    const accessToken = generateToken({ id: user.id });

    res.json({ user, accessToken });
  });
};

// UPDATE USER INFO
const updateUser = async (req, res) => {
  const user = await User.findOne({ id: req.params.id });

  !user && res.status(404).send("No user found");

  const {
    firstName = user.firstName,
    lastName = user.lastName,
    email = user.email,
    password,
    address = user.address,
    phoneNumber = user.phoneNumber,
  } = req.body;

  const updateObj = {
    firstName,
    lastName,
    email,
    address: {
      ...user.address,
      ...address,
    },
    phoneNumber,
    updatedAt: new Date(),
  };

  if (password !== undefined) {
    updateObj.password = await bcrypt.hash(password, 10);
  }

  if (email !== undefined) {
    const scope = email.includes("@atadmin.com")
      ? "admin"
      : email.includes("@architech.com")
      ? "employee"
      : "customer";
    updateObj.scope = scope;
  }

  await User.updateOne({ id: req.params.id }, { $set: updateObj });

  res.json({
    success: true,
    updatedUser: updateObj,
  });
};

// DELETE USER
const deleteUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });

  await User.deleteOne(user);
  await Order.deleteMany({ user: user._id });
  await Cart.deleteMany({ user: user._id });
  await Wish.deleteMany({ user: user._id });

  res.status(200).json({ success: true, message: "User deleted" });
};

const deleteAllUsers = async (req, res) => {
  await User.deleteMany();
  await Order.deleteMany();
  await Cart.deleteMany();
  await Wish.deleteMany();

  res.status(200).json({ success: true, message: "All Users deleted" });
};

//GENERATE A USER TOKEN
const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  return token;
};

//GENERATE A REFRESH TOKEN
const refreshToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_REFRESH, {
    expiresIn: "1h",
  });

  return token;
};

module.exports = {
  getUsers,
  getUser,
  registerUser,
  loginUser,
  refreshUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
};
