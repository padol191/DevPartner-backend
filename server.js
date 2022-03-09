const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db");
require("dotenv").config();
console.log(process.env.mongoURI);
cors({ credentials: true, origin: true });
app.use(cors());
//Db connection
connectDB();
//Init Middleware
app.use(express.json({ extented: false }));
app.get("/", (req, res) => {
  res.send("API Running");
});

//routes

app.use("/api/auth", require("./api/auth"));
app.use("/api/posts", require("./api/post"));
app.use("/api/profile", require("./api/profile"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
