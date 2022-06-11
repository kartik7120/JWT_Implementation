require("dotenv").config();
const express = require("express");
const { userData, publicPosts, privatePosts } = require("./fakeDB");
const jwt = require("jsonwebtoken");
const app = express();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
app.use(express.json());

const checkAuthMiddleware = async (req, res, next) => {
    // For every request a user is going to send the webtoken
    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(400).json("No token is found");
    }
    try {
        let user = jwt.verify(token, process.env.SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.status(400).json("Token is invalid");
    }
}

app.get("/hello", (req, res) => {
    res.send("HELLO");
})

app.get("/publicPosts", (req, res) => {
    res.json(publicPosts);
})

app.get("/privatePosts", checkAuthMiddleware, (req, res) => {
    res.json(privatePosts);
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

    const user = userData.find(user => user.email === email);

    if (user) {
        return res.status(400).json({
            errors: {
                msg: "User already exists"
            }
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    userData.push({
        email: email,
        password: hashedPassword,
    })

    const token = await jwt.sign({
        email,
        msg: "I am logged in"
    }, process.env.SECRET, {
        expiresIn: "3000000"
    })
    res.json(token);
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    let user = userData.find(user => user.email === email);

    if (!user) {
        return res.status(400).json({
            errors: {
                msg: "email or password is not correct"
            }
        })
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return res.status(400).json({
            errors: {
                msg: "email or password is not correct"
            }
        })
    }

    const token = await jwt.sign({
        email,
        msg: "User is logged in"
    }, process.env.SECRET, {
        expiresIn: "3000000"
    })

    res.json(token);
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})