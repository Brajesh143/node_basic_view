const express = require("express")
const router = express.Router()

const userController = require("../controllers/userController")
const isAuthCheck = require("../middlewares/isAuth")

router.get('/', userController.getMainPage)

router.get('/signup', userController.getSignup)

router.post('/signup', userController.postSignup)

router.get('/login', userController.getLogin)

router.post('/login', userController.postLogin)

router.get('/profile', isAuthCheck, userController.getProfile)

router.post('/profile', isAuthCheck, userController.postProfile)

router.post('/logout', isAuthCheck, userController.postLogout)

module.exports = router;