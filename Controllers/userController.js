const User = require("../Models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const user = await User.find({ id: req.params.id });
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
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
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
    console.log(user.id);

    res.json({ user, accessToken });
  });
};

// UPDATE USER INFO
const updateUser = async (req, res) => {
  const user = await User.findOne({ id: req.params.id });

  !user && res.status(404).send("No user found");

  let hashedPassword;

  if (req.body.password) {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = {};

  req.body.firstName === undefined
    ? (updatedUser.firstName = user.firstName)
    : (updatedUser.firstName = req.body.firstName);
  req.body.lastName === undefined
    ? (updatedUser.lastName = user.lastName)
    : (updatedUser.lastName = req.body.lastName);
  req.body.email === undefined
    ? (updatedUser.email = user.email)
    : (updatedUser.email = req.body.email);

  req.body.password === undefined
    ? (updatedUser.password = user.password)
    : (updatedUser.password = hashedPassword);

  if (req.body.password !== req.body.confirmPassword) {
    res.status(400).json({ message: "Passwords do not match" });
  }

  if (req.body.address === undefined) {
    updatedUser.address = user.address;
  } else {
    updatedUser.address = {
      street:
        req.body.address.street === undefined
          ? user.address.street
          : req.body.address.street,
      city:
        req.body.address.city === undefined
          ? user.address.city
          : req.body.address.city,
      state:
        req.body.address.state === undefined
          ? user.address.state
          : req.body.address.state,
      zip:
        req.body.address.zip === undefined
          ? user.address.zip
          : req.body.address.zip,
    };
  }

  req.body.phoneNumber === undefined
    ? (updatedUser.phoneNumber = user.phoneNumber)
    : (updatedUser.phoneNumber = req.body.phoneNumber);
  req.body.wishlist === undefined
    ? (updatedUser.wishlist = user.wishlist)
    : (updatedUser.wishlist = req.body.wishlist);
  req.body.cart === undefined
    ? (updatedUser.cart = user.cart)
    : (updatedUser.cart = req.body.cart);

  const scope = req.body.email.includes("@acadmin.com")
    ? "admin"
    : req.body.email.includes("@architech.com")
    ? "employee"
    : "customer";

  req.body.email === undefined
    ? (updatedUser.scope = user.scope)
    : (updatedUser.scope = scope);

  updatedUser.id = user.id;
  updatedUser.createdAt = user.createdAt;
  updatedUser.updatedAt = new Date();

  await User.updateOne(user, updatedUser);

  res.json({
    success: true,
    updatedUser: updatedUser,
  });
};

// DELETE USER
const deleteUser = async (req, res) => {
  const user = await User.findOne({ id: req.params.id });

  await User.deleteOne(user);

  res.status(200).json({ success: true, message: "User deleted" });
};

const deleteAllUsers = async (req, res) => {
  await User.deleteMany();

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
