const bcryipt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(_, { username, password }, context, info) {
      // Validate user
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = `User not found`;
        throw new UserInputError("User not found", { errors });
      }
      const match = await bcryipt.compare(password, user.password);
      if (!match) {
        errors.general = `Wrong credentials`;
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      { registerInput: { username, password, confirmPassword, email } },
      context,
      info
    ) {
      // Validate User
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("User is already taken", {
          errors: {
            username: "username is taken",
          },
        });
      }

      //   Bcrypt and Save User
      password = await bcryipt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
