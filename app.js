require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})