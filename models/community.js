const { Snowflake } = require("@theinternetfolks/snowflake");
slugGenerator;
const { mongoose } = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const communitySchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate(),
    },
    name: {
      type: String,
      trim: true,
      maxlength: 128,
      required: [true, "Please provide Community name"],
    },
    slug: { type: String, slug: "name", unique: true },
    owner: { type: String, ref: "User" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Community", communitySchema);
