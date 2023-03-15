const { Snowflake } = require("@theinternetfolks/snowflake");
slugGenerator;
const { mongoose } = require("mongoose");

const scopes = {
  "Community Admin": ["member-get", "member-add", "member-remove"],
  "Community Member": ["member-get"],
  "Community Moderator": ["member-get", "member-remove"],
};
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
