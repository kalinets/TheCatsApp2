export interface ICat {
  id: number
  url: string
  width: number
  height: number
}

export interface IAction {
  type: string
  payload?: any
}

export interface IUser {
  _id: string
  date: string
  email: string
}

export interface IAuthState {
  isAuthenticated: boolean
  token: string
  loading: boolean
  error: object | null
  user: IUser | null
  isSubmitting: boolean
}

export interface IAuthContext extends IAuthState {
  loadUser: () => void
  registerUser: ({}) => void
  loginUser: ({}) => void
  logoutUser: () => void
}

export interface IFavorite extends ICat {
  user: string
  date: string
}

export interface IFavoriteState {
  favorites: IFavorite[]
  error: boolean
  loading: boolean
  isAddingToFavs: boolean
  isRemovingFromFavs: boolean
  isRemovingManyFromFavs: boolean
}

export interface IFavoriteContext extends IFavoriteState {
  getFavorites: () => void
  addFavorite: ({}: ICat) => void
  removeFavorite: ({}: number) => void
  removeManyFavorites: ({}: number[]) => void
}

export interface IBreed {
  id: string
  name: string
}
