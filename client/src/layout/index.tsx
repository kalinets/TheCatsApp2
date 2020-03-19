import React, { useContext } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Layout, Row, Col } from 'antd'
import AuthContext from '../context/auth/AuthContext'
import { ROUTES } from '../constants'
import PrivateRoute from '../components/PrivateRoute'
import Navigation from '../components/Navigation'
import ViewCat from '../components/ViewCat'
import SignUp from '../components/SignUp'
import SignIn from '../components/SignIn'
import Favorites from '../components/Favorites'
import OfflineAlert from '../components/OfflineAlert'
import GlobalPreloader from '../components/GlobalPreloader'

const { Header, Footer, Content } = Layout

export default function index(): JSX.Element {
  const { loading } = useContext(AuthContext)

  return (
    <Layout>
      <Header style={{ height: 'auto', padding: '10px 0', lineHeight: 1 }}>
        <Navigation />
      </Header>
      <OfflineAlert />
      <Content
        style={{ padding: '20px 10px 0', width: '100%', maxWidth: '1280px', margin: 'auto' }}
      >
        <Switch>
          <Route exact path={ROUTES.signUp}>
            <Row>
              <Col span={14} offset={5}>
                <SignUp />
              </Col>
            </Row>
          </Route>
          <Route exact path={ROUTES.signIn}>
            <Row>
              <Col span={14} offset={5}>
                <SignIn />
              </Col>
            </Row>
          </Route>
          <PrivateRoute exact path={ROUTES.viewCatPage} component={ViewCat} />
          <PrivateRoute exact path={ROUTES.favorites} component={Favorites} />
          <Route exact path='/'>
            <h1>🚧👷‍♂️👷‍♀️🚧</h1>
            <h2>Main page is under construction</h2>
          </Route>
          <Route>
            <h1>🤷‍♂️</h1>
            <p>Page does not exist</p>
          </Route>
        </Switch>
      </Content>
      <Footer style={{ padding: '20px' }}>
        This MERN app was created in 2020 by{' '}
        <a href='https://kalinets.space/' target='_blank'>
          me
        </a>
        , with the help of{' '}
        <a href='https://thecatapi.com/' target='_blank'>
          The Cat API
        </a>
        .
        <br />
        You can find the code on the{' '}
        <a href='https://github.com/kalinets/TheCatsApp2' target='_blank'>
          GitHub
        </a>
        .
      </Footer>
      {loading && <GlobalPreloader />}
    </Layout>
  )
}
