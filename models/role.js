const { Snowflake } = require("@theinternetfolks/snowflake");
slugGenerator;
const { mongoose } = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    _id: false,
    id: {
      type: String,
      default: () => Snowflake.generate(),
    },
    name: {
      type: String,
      trim: true,
      maxlength: 64,
      required: [true, "Please provide Community name"],
      unique: true,
    },
    scope: {
      type: [String],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Role", roleSchema);
