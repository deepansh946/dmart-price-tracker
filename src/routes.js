import { Route, Switch, Redirect } from 'react-router-dom'

import Home from './views/Home'
import Cart from './views/Cart'

function Routes() {
  return (
    <Switch>
      <Route exact path="/:cart" render={props => <Cart {...props} />} />
      <Route exact path="/" render={props => <Home {...props} />} />
      <Redirect from="*" to="/notFound" />
    </Switch>
  )
}

export default Routes
