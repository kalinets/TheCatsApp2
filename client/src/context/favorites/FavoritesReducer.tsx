import { IFavoriteState, IAction } from '../../types'

import {
  GET_FAVORITES_SUCCESS,
  GET_FAVORITES_FAIL,
  ADD_FAVORITE_SUCCESS,
  ADD_FAVORITE_FAIL,
  REMOVE_FAVORITE_SUCESS,
  REMOVE_FAVORITE_FAIL,
  SET_ADDING_FAVORITE,
  SET_REMOVING_FAVORITE,
  SET_LOADING_FAVORITES,
  REMOVE_MANY_FAVORITES_SUCCESS,
  REMOVE_MANY_FAVORITES_FAIL,
  SET_REMOVING_MANY_FAVORITES,
} from '../types'

export default (state: IFavoriteState, action: IAction) => {
  switch (action.type) {
    case ADD_FAVORITE_SUCCESS:
      return {
        ...state,
        favorites: [action.payload, ...state.favorites],
        isAddingToFavs: false,
      }
    case REMOVE_FAVORITE_SUCESS:
      return {
        ...state,
        favorites: state.favorites.filter(item => item.id !== action.payload),
        isRemovingFromFavs: false,
      }
    case GET_FAVORITES_SUCCESS:
      return {
        ...state,
        favorites: action.payload,
        loading: false,
      }
    case GET_FAVORITES_FAIL:
    case ADD_FAVORITE_FAIL:
    case REMOVE_FAVORITE_FAIL:
    case REMOVE_MANY_FAVORITES_FAIL:
      return {
        ...state,
        loading: false,
        isAddingToFavs: false,
        isRemovingFromFavs: false,
        isRemovingManyFromFavs: false,
        error: action.payload,
      }
    case SET_ADDING_FAVORITE:
      return {
        ...state,
        isAddingToFavs: true,
      }
    case SET_REMOVING_FAVORITE:
      return {
        ...state,
        isRemovingFromFavs: true,
      }
    case SET_LOADING_FAVORITES:
      return {
        ...state,
        favorites: [],
        loading: true,
      }
    case SET_REMOVING_MANY_FAVORITES:
      return {
        ...state,
        isRemovingManyFromFavs: true,
      }
    case REMOVE_MANY_FAVORITES_SUCCESS:
      return {
        ...state,
        favorites: state.favorites.filter(item => !action.payload.includes(item.id)),
        isRemovingManyFromFavs: false,
      }
    default:
      return state
  }
}
