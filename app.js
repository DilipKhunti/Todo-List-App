const express = require("express");
const path = require("path");

require("dotenv").config();
require("./conn/conn");

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const User = require("./routes/user");
const Task = require("./routes/task")

app.use("/api", User);
app.use("/api", Task)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
