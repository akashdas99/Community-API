const { Snowflake } = require("@theinternetfolks/snowflake");
const { mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const roleSchema = mongoose.Schema(
  {
    _id: {
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
  { toObject: { versionKey: false } },
  { timestamps: true }
);
roleSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Role", roleSchema);
