const express = require("express");
const connectDb = require("./config/dbConnection");
// const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

const app = express();
connectDb();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/v1/role", require("./routes/roleRoutes"));
app.use("/v1/auth", require("./routes/authRoutes"));
// app.use("/v1/community", require("./routes/communityRoutes"));
// app.use("/v1/member", require("./routes/memberRoutes"));
// app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
