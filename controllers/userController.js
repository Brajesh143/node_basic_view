const asyncHandler = require("express-async-handlr")
const bcrypt = require("bcryptjs")

const User = require("../models/user")

const getMainPage = (req, res, next) => {
    res.render('main')
}

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
            throw new Error("Email already exist")
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
            return res.redirect('/login')
            // res.status(201).json({ message: "User successfuly created", data: user })
        }

    } catch (err) {
        const error = new Error(err)
        // error.statusCode = 500
        return next(error)
    }
})

const getLogin = (req, res, next) => {
    let message = '';
    if (req.flash('error')) {
        message = req.flash('error');
    } else if (req.flash('success')) {
        message = req.flash('success');
    }

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    
    res.render('login', {
        path: '/login',
        pageTitle: 'Login',
        message: message
    })
}

const postLogin = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body

    try {
        const userCheck = await User.findOne({ email: email })
        if (!userCheck) {
            req.flash("error", "User not found");
            return res.redirect('/login');
        }

        const checkPassword = await bcrypt.compare(password, userCheck.password)
        if (!checkPassword) {
            req.flash("error", "Invalid credential");
            return res.redirect('/login');
        }

        req.flash("success", "User successfuly loggedin");
        req.session.isLoggedIn = true;
        req.session.user = userCheck;
        req.session.save((err) => {
            return next(new Error(err))
        })

        return res.redirect('/profile');

    } catch (err) {
        const error = new Error(err)
        error.statusCode = 500
        return next(error)
    }
})

const getProfile = asyncHandler(async(req, res, next) => {
    let message = req.flash('success');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    
    return res.render('profile', {
        message: message,
        user: req.session.user
    })
})

const postProfile = asyncHandler(async(req, res, next) => {
    const { name, email, password, phone } = req.body
    const image = req.file;
    const userData = req.session.user

    try {
        const imageUrl = image.path;
        
        const userUpdate = await User.updateOne({_id: userData._id}, {$set:{name:name, email: email, phone: phone, image: imageUrl,}})

        res.redirect('/profile')

    } catch (err) {
        const error = new Error(err)
        // error.statusCode = 400
        return next(error)
    }
})

const postLogout = (req, res, next) => {
    req.session.destroy(err => {
      return next(new Error(err))
    })

    res.redirect('/login')
};

module.exports = { getSignup, postSignup, getLogin, postLogin, getProfile, postProfile, postLogout, getMainPage }