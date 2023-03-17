const { Snowflake } = require("@theinternetfolks/snowflake");
const { mongoose } = require("mongoose");

const userSchema = mongoose.Schema(
  {
    // _id: false,
    _id: {
      type: String,
      default: () => Snowflake.generate(),
    },
    name: {
      type: String,
      trim: true,
      maxlength: 64,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      maxlength: 128,
      required: [true, "Please add user email"],
      unique: [true, "Email address already exists"],
    },
    password: {
      type: String,
      trim: true,
      maxlength: 64,
      required: [true, "Please add user password"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
