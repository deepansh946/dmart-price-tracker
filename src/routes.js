import { Route, Switch, Redirect } from 'react-router-dom'

import Home from './views/Home'
import Dmart from './views/Dmart'
import Others from './views/Others'

function Routes() {
  return (
    <Switch>
      <Route exact path="/dmart/:cart" render={props => <Dmart {...props} />} />
      <Route
        exact
        path="/others/:cart"
        render={props => <Others {...props} />}
      />
      <Route exact path="/" render={props => <Home {...props} />} />
      <Redirect from="*" to="/notFound" />
    </Switch>
  )
}

export default Routes
