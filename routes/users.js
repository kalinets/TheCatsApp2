const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')

const router = express.Router()

// @route   POST /api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password should be at least 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const { email, password } = req.body

    try {
      let user = await User.findOne({ email })
      if (user) {
        return res.status(422).json({ msg: 'User already exists' })
      }

      user = new User({ email, password })

      const salt = await bcrypt.genSalt()
      user.password = await bcrypt.hash(password, salt)
      user.save()

      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (error, token) => {
          if (error) throw error
          res.json({ token })
        }
      )
    } catch (error) {
      console.error(error.message)
      res.status(500).send('server error')
    }
  }
)

module.exports = router
