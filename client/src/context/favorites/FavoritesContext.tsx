import { createContext } from 'react'

import { IFavoriteContext } from '../../types'

const FavoritesContext = createContext({} as IFavoriteContext)

export default FavoritesContext
