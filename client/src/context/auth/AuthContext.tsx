import { createContext } from 'react'

import { IAuthContext } from '../../types'

const AuthContext = createContext({} as IAuthContext)

export default AuthContext
