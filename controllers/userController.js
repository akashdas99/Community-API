const validator = require("validator");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");
const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.signup = async (req, res) => {
  try {
    let errors = [];
    const { name, email, password } = req.body;
    if (!validator.isLength(name, { min: 2 })) {
      errors.push({
        param: "name",
        message: "Name should be at least 2 characters.",
        code: "INVALID_INPUT",
      });
    }
    if (!validator.isEmail(email)) {
      errors.push({
        param: "email",
        message: "Please provide a valid email address.",
        code: "INVALID_INPUT",
      });
    }
    if (!validator.isLength(password, { min: 6 })) {
      errors.push({
        param: "password",
        message: "Password should be at least 6 characters.",
        code: "INVALID_INPUT",
      });
    }

    if (errors.length !== 0)
      return res.status(400).json({
        status: false,
        errors: errors,
      });
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      return res.status(409).json({
        status: false,
        errors: [
          {
            param: "email",
            message: "User with this email address already exists.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
        expiresIn: "15m",
      });

      res.status(201).json({
        status: true,
        content: {
          data: {
            id: user._id,
            name: name,
            email: email,
            created_at: user.createdAt,
          },
          meta: {
            access_token: token,
          },
        },
      });
    } else {
      res.status(400);
      throw new Error("Unable to save in DB");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "email",
            message: "Please provide a valid email address.",
            code: "INVALID_INPUT",
          },
        ],
      });
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
        expiresIn: "15m",
      });
      res.status(200).json({
        status: true,
        content: {
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.createdAt,
          },
          meta: {
            access_token: token,
          },
        },
      });
    } else {
      res.status(401).json({
        status: false,
        errors: [
          {
            param: "password",
            message: "The credentials you provided are invalid.",
            code: "INVALID_CREDENTIALS",
          },
        ],
      });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
exports.isSignedIn = expressjwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false,
});

exports.me = async (req, res) => {
  try {
    if (!req.auth)
      return res.status(401).json({
        status: false,
        errors: [
          {
            message: "You need to sign in to proceed.",
            code: "NOT_SIGNEDIN",
          },
        ],
      });
    const user = await User.findOne({ _id: req.auth._id });
    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
      },
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
