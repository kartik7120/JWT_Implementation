require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.get("/hello", (req, res) => {
    res.send("HELLO");
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})