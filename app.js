require("dotenv").config();
const express = require("express");
const fakeDB = require("./fakeDB");
const jwt = require("jsonwebtoken");
const app = express();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
app.use(express.json());

app.get("/hello", (req, res) => {
    res.send("HELLO");
})

app.get("/users", (req, res) => {
    res.json({ fakeDB });
})

app.post("/register", [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a password which is more then 5 characters long").isLength({
        min: 6
    })
], async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const user = fakeDB.find(user => user.email === email);

    if (user) {
        return res.status(400).json({
            errors: {
                msg: "User already exists"
            }
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    fakeDB.push({
        email: email,
        password: hashedPassword,
    })

    const token = await jwt.sign({
        email,
        msg: "I am logged in"
    }, process.env.SECRET, {
        expiresIn: "30"
    })
    res.json(token);
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})