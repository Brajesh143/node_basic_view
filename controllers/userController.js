const asyncHandler = require("express-async-handlr")
const bcrypt = require("bcryptjs")

const User = require("../models/user")

const getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('signup', {
        errorMessage: message
    })
}

const postSignup = asyncHandler(async(req, res, next) => {
    const { name, email, password, phone } = req.body
    
    try {
        const checkUser = await User.findOne({ email: email })

        if (checkUser) {
            res.redirect('/signup')
        }
        
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone
        })

        if(user) {
            req.flash('success', 'User successfuly created.');
            res.redirect('/login')
            // res.status(201).json({ message: "User successfuly created", data: user })
        }

    } catch (err) {
        console.log(err)
    }
})

const getLogin = (req, res, next) => {
    let message = req.flash('error');
    
    res.render('login', {
        errorMessage: message
    })
}

const postLogin = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body

    try {
        const userCheck = await User.findOne({ email: email })
        if (!userCheck) {
            res.redirect('/signup')
        }

        const checkPassword = await bcrypt.compare(password, userCheck.password)
        if (!checkPassword) {
            res.redirect('/login')
        }

        req.session.isLoggedIn = true;
        req.session.user = userCheck;
        req.session.save()
        res.redirect('/login');

    } catch (err) {
        console.log(err)
    }
})

module.exports = { getSignup, postSignup, getLogin, postLogin }