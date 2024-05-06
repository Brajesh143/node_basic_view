const express = require("express")
const router = express.Router()

const userController = require("../controllers/userController")
const isAuth = require("../middlewares/isAuth")

router.get('/', userController.getMainPage)

router.get('/signup', userController.getSignup)

router.post('/signup', userController.postSignup)

router.get('/login', userController.getLogin)

router.post('/login', userController.postLogin)

router.get('/profile', userController.getProfile)

router.post('/profile', userController.postProfile)

router.post('/logout', userController.postLogout)

module.exports = router;