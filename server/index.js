require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./routes/api/authRoutes");
const registerRouter = require("./routes/api/registerRoutes");

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, () => console.log("connected to db"));

app.use("/api/auth", authRouter);
app.use("/api/register", registerRouter);

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // like our main.js file, or main.css
  app.use(express.static("client/build"));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require("path");
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = 4000 || process.env.PORT;

app.listen(PORT, () => {
  console.log("listening on port:", PORT);
});
