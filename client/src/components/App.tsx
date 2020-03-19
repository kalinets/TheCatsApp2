import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import axios from 'axios'
import AuthState from '../context/auth/AuthState'
import FavoritesState from '../context/favorites/FavoritesState'
import Layout from '../layout'

import './App.scss'

if (localStorage.token) {
  axios.defaults.headers.common['x-auth-token'] = localStorage.token
}

export default function App() {
  return (
    <AuthState>
      <FavoritesState>
        <Router>
          <Layout />
        </Router>
      </FavoritesState>
    </AuthState>
  )
}
