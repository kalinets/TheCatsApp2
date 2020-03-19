import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import AuthContext from '../../context/auth/AuthContext'

type Props = {
  component: React.ComponentType<any>
  exact?: boolean
  path: string
}

export default function PrivateRoute({ component: Component, ...rest }: Props) {
  const { isAuthenticated, loading } = useContext(AuthContext)

  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated && !loading ? <Redirect to='/' /> : <Component {...props} />
      }
    />
  )
}
