import React, { useReducer, useEffect, useContext } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import FavoritesContext from './FavoritesContext'
import FavoritesReducer from './FavoritesReducer'
import AuthContext from '../auth/AuthContext'

import { ICat } from '../../types'
import {
  GET_FAVORITES_SUCCESS,
  GET_FAVORITES_FAIL,
  ADD_FAVORITE_SUCCESS,
  ADD_FAVORITE_FAIL,
  REMOVE_FAVORITE_FAIL,
  REMOVE_FAVORITE_SUCESS,
  SET_ADDING_FAVORITE,
  SET_REMOVING_FAVORITE,
  SET_LOADING_FAVORITES,
  REMOVE_MANY_FAVORITES_SUCCESS,
  REMOVE_MANY_FAVORITES_FAIL,
  SET_REMOVING_MANY_FAVORITES,
} from '../types'

interface Props {
  children: React.ReactNode
}
interface AddFavSocket {
  cat: ICat
  userId: string
}
interface RemoveOneSocket {
  favoriteId: number
  userId: string
}
interface RemoveManySocket {
  markedFavorites: number[]
  userId: string
}

let apiUrl: string
if (process.env.NODE_ENV !== 'production') {
  apiUrl = 'http://localhost:6125'
} else {
  apiUrl = ''
}

const socket = io.connect(apiUrl)

export default function FavoritesState(props: Props): JSX.Element {
  const initialState = {
    error: null,
    favorites: [],
    loading: true,
    isAddingToFavs: false,
    isRemovingFromFavs: false,
    isRemovingManyFromFavs: false,
  }

  const { user, loading, isAuthenticated } = useContext(AuthContext)

  const [state, dispatch] = useReducer(FavoritesReducer, initialState)

  useEffect(() => {
    if (!loading && isAuthenticated) {
      socket.on('add', (data: AddFavSocket) => addFavoriteSocket(data))
      socket.on('removeOne', (data: RemoveOneSocket) => removeFavoriteSocket(data))
      socket.on('removeMany', (data: RemoveManySocket) => removeManyFavoritesSocket(data))
    }
  }, [loading, isAuthenticated])

  const getFavorites = async () => {
    setLoadingFavorites()
    try {
      const res = await axios.get(`${apiUrl}/api/favorites`)
      dispatch({
        type: GET_FAVORITES_SUCCESS,
        payload: res.data,
      })
    } catch (error) {
      dispatch({
        type: GET_FAVORITES_FAIL,
        payload: error,
      })
    }
  }

  const addFavorite = async (cat: ICat) => {
    setAddingFavorite()
    try {
      const res = await axios.post(`${apiUrl}/api/favorites`, cat)
      if (res.status !== 200) return
      dispatch({
        type: ADD_FAVORITE_SUCCESS,
        payload: cat,
      })
      socket.emit('add', { cat, userId: user?._id })
    } catch (error) {
      dispatch({
        type: ADD_FAVORITE_FAIL,
        payload: error,
      })
    }
  }

  const addFavoriteSocket = ({ cat, userId }: AddFavSocket) => {
    if (userId !== user?._id) return
    dispatch({
      type: ADD_FAVORITE_SUCCESS,
      payload: cat,
    })
  }

  const removeFavorite = async (id: number) => {
    setRemovingFavorite()
    try {
      const res = await axios.delete(`${apiUrl}/api/favorites/one/${id}`)
      if (res.status !== 200) return
      dispatch({
        type: REMOVE_FAVORITE_SUCESS,
        payload: id,
      })
      socket.emit('removeOne', { favoriteId: id, userId: user?._id })
    } catch (error) {
      dispatch({
        type: REMOVE_FAVORITE_FAIL,
        payload: error,
      })
    }
  }

  const removeFavoriteSocket = ({ favoriteId, userId }: RemoveOneSocket) => {
    if (userId !== user?._id) return
    dispatch({
      type: REMOVE_FAVORITE_SUCESS,
      payload: favoriteId,
    })
  }

  const setAddingFavorite = () => dispatch({ type: SET_ADDING_FAVORITE })

  const setRemovingFavorite = () => dispatch({ type: SET_REMOVING_FAVORITE })

  const setLoadingFavorites = () => dispatch({ type: SET_LOADING_FAVORITES })

  const setRemovingManyFavorites = () => dispatch({ type: SET_REMOVING_MANY_FAVORITES })

  const removeManyFavorites = async (markedFavorites: number[]) => {
    setRemovingManyFavorites()
    try {
      const res = await axios.delete(`${apiUrl}/api/favorites/many`, { data: markedFavorites })
      if (res.status !== 200) return
      dispatch({
        type: REMOVE_MANY_FAVORITES_SUCCESS,
        payload: markedFavorites,
      })
      socket.emit('removeMany', { markedFavorites, userId: user?._id })
    } catch (error) {
      dispatch({
        type: REMOVE_MANY_FAVORITES_FAIL,
        payload: error,
      })
    }
  }

  const removeManyFavoritesSocket = ({ markedFavorites, userId }: RemoveManySocket) => {
    if (userId !== user?._id) return
    dispatch({
      type: REMOVE_MANY_FAVORITES_SUCCESS,
      payload: markedFavorites,
    })
  }

  return (
    <FavoritesContext.Provider
      value={{
        error: state.error,
        favorites: state.favorites,
        loading: state.loading,
        isAddingToFavs: state.isAddingToFavs,
        isRemovingFromFavs: state.isRemovingFromFavs,
        isRemovingManyFromFavs: state.isRemovingManyFromFavs,
        getFavorites,
        addFavorite,
        removeFavorite,
        removeManyFavorites,
      }}
    >
      {props.children}
    </FavoritesContext.Provider>
  )
}
