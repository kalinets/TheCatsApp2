import axios from 'axios'

import { IAuthState, IAction } from '../../types'

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

export default (state: IAuthState, action: IAction) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload)
      axios.defaults.headers.common['x-auth-token'] = action.payload
      return {
        ...state,
        ...action.payload,
        error: null,
        isAuthenticated: true,
        loading: false,
        isSubmitting: false,
      }
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['x-auth-token']
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        isSubmitting: false,
        user: null,
        error: action.payload,
      }
    case USER_LOADED:
      return {
        ...state,
        error: null,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      }
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }
    case SET_SUBMITTING_FORM:
      return {
        ...state,
        isSubmitting: true,
      }
    default:
      return state
  }
}
