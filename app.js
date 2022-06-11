require("dotenv").config();
const express = require("express");
const fakeDB = require("./fakeDB");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

app.get("/hello", (req, res) => {
    res.send("HELLO");
})

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    res.json("Register route");
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})