import React, { useContext, useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { Button } from 'antd'
import AuthContext from '../../context/auth/AuthContext'
import FavoritesContext from '../../context/favorites/FavoritesContext'
import { ROUTES } from '../../constants'

export default function Navigation() {
  const { isAuthenticated, loadUser, logoutUser } = useContext(AuthContext)
  const { favorites, getFavorites } = useContext(FavoritesContext)
  const history = useHistory()

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      getFavorites()
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    logoutUser()
    history.push('/')
  }

  const stylo = { margin: '5px', display: 'inline-block' }

  const userLinks = (
    <>
      <NavLink style={stylo} to={ROUTES.viewCatPage}>
        <Button>View cat 🐈</Button>
      </NavLink>
      {!!favorites?.length && (
        <NavLink style={stylo} to={ROUTES.favorites}>
          <Button>Favorites 😻</Button>
        </NavLink>
      )}
      <Button style={stylo} onClick={handleLogout}>
        Sign out 📤
      </Button>
    </>
  )
  const guestLinks = (
    <>
      <NavLink style={stylo} to={ROUTES.signUp}>
        <Button>Sign up 📝</Button>
      </NavLink>
      <NavLink style={stylo} to={ROUTES.signIn}>
        <Button>Sign in 📲</Button>
      </NavLink>
    </>
  )

  return (
    <nav>
      <NavLink exact style={stylo} to='/'>
        <Button>Home 🏠</Button>
      </NavLink>
      {isAuthenticated ? userLinks : guestLinks}
    </nav>
  )
}
