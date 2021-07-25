import { Link } from 'react-router-dom'
import axios from 'axios'

import Routes from './routes'
import './App.css'
import Footer from './components/Footer'

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL

const App = (): JSX.Element => {
  return (
    <div className="App">
      <Link to="/">
        <header className="App-header">Dmart Price Tracker</header>
      </Link>
      <div
        className="overflow-auto"
        style={{
          height: '80vh',
        }}
      >
        <Routes />
      </div>
      <Footer />
    </div>
  )
}

export default App
