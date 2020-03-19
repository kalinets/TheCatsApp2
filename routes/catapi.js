const express = require('express')
const axios = require('axios')

const API_KEY = '3a54f87e-245c-499a-b552-c423e6595899'
const BREED_SEARCH_URL = 'https://api.thecatapi.com/v1/breeds'
const DEFAULT_SEARCH_URL = 'https://api.thecatapi.com/v1/images/search'
const SEARCH_BY_BREED_URL = 'https://api.thecatapi.com/v1/images/search?breed_ids='

const router = express.Router()

router.get('/random', async (req, res) => {
  const headers = { 'x-api-key': API_KEY }
  const response = await axios.get(DEFAULT_SEARCH_URL, headers)
  if (response.status === 200) {
    res.send(response.data)
  } else {
    console.log(response.status)
  }
})

router.get('/breeds', async (req, res) => {
  const headers = { 'x-api-key': API_KEY }
  const response = await axios.get(BREED_SEARCH_URL, headers)
  if (response.status === 200) {
    const breeds = response.data.map(({ name, id }) => ({ name, id }))
    res.send(breeds)
  }
})

router.get('/breeds/:id', async (req, res) => {
  const breedId = req.params.id
  const headers = { 'x-api-key': API_KEY }
  const response = await axios.get(SEARCH_BY_BREED_URL + breedId, headers)
  if (response.status === 200) {
    res.send(response.data)
  }
})

module.exports = router
