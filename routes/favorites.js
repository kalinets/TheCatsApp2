const express = require('express')
const { check, validationResult } = require('express-validator')
const Favorite = require('../models/Favorite')
const auth = require('../middleware/auth')

const router = express.Router()

// @route   POST /api/favorites
// @desc    add a favorite
// @access  Private
router.post('/', [
  auth,
  [
    check('id', 'required').notEmpty(),
    check('url', 'required').notEmpty(),
    check('width', 'required').notEmpty(),
    check('height', 'required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() })
    const { id, url, width, height } = req.body
    try {
      let favoritka = await Favorite.findOne({ id })
      if (favoritka) return res.status(422).json({ msg: 'Already in favorites' })
      favoritka = new Favorite({ id, url, width, height, user: req.user.id })
      await favoritka.save()
      return res.status(200).json({ msg: 'Favorite saved' })
    } catch (error) {
      console.error(error.message)
      res.status(500).send('server error')
    }
  },
])

// @route   GET /api/favorites
// @desc    get all favorites
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).sort({ date: -1 })
    res.json(favorites)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('server error')
  }
})

// @route   DELETE /api/favorites/:id
// @desc    remove a favorite
// @acess   Private
router.delete('/one/:id', auth, async (req, res) => {
  try {
    const desiredFavora = await Favorite.findOne({ id: req.params.id, user: req.user.id })
    if (!desiredFavora) return res.status(422).json({ msg: 'no such favorite' })
    await Favorite.deleteOne({ id: req.params.id })
    return res.status(200).json({ msg: 'Favorite removed' })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('server error')
  }
  res.send('remove a favka')
})

// @route   DELETE /api/favorites/many
// @desc    remove many favorites
// @access  Private
router.delete('/many', auth, async (req, res) => {
  try {
    await Favorite.deleteMany({ id: req.body })
    return res.status(200).json({ msg: 'Favorites removed' })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('server error')
  }
})

module.exports = router
