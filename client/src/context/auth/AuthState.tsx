import React, { useReducer } from 'react'
import axios from 'axios'
import AuthContext from './AuthContext'
import AuthReducer from './AuthReducer'

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERROR,
  SET_SUBMITTING_FORM,
} from '../types'

type Props = {
  children: React.ReactNode
}

let apiUrl: string
if (process.env.NODE_ENV !== 'production') {
  apiUrl = 'http://localhost:6125'
} else {
  apiUrl = ''
}

export default function AuthState(props: Props): JSX.Element {
  const initialState = {
    isAuthenticated: false,
    token: localStorage.getItem('token'),
    loading: true,
    error: null,
    user: null,
    isSubmitting: false,
  }

  const [state, dispatch] = useReducer(AuthReducer, initialState)

  const loadUser = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/auth`)
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      })
    } catch (error) {
      dispatch({ type: AUTH_ERROR })
      clearError()
    }
  }

  const registerUser = async (formData: object) => {
    setSubmittingForm()
    const config = { headers: { 'Content-Type': 'application/json' } }
    try {
      const res = await axios.post(`${apiUrl}/api/users`, formData, config)
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data.token,
      })
      loadUser()
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: error.response.data.msg || error.response.data.errors[0].msg,
      })
      clearError()
    }
  }

  const loginUser = async (formData: object) => {
    setSubmittingForm()
    const config = { headers: { 'Content-Type': 'application/json' } }
    try {
      const res = await axios.post(`${apiUrl}/api/auth`, formData, config)
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data.token,
      })
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.response.data.msg || error.response.data.errors[0].msg,
      })
      clearError()
    }
  }

  const logoutUser = () => {
    dispatch({
      type: LOGOUT,
    })
  }

  const clearError = () => {
    dispatch({
      type: CLEAR_ERROR,
    })
  }

  const setSubmittingForm = () => {
    dispatch({
      type: SET_SUBMITTING_FORM,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        user: state.user,
        isSubmitting: state.isSubmitting,
        loadUser,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
