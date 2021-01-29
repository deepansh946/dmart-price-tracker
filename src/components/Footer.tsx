import { GitHub, LinkedIn, Twitter } from '@material-ui/icons'
import { SOCIAL_LINKS } from '../resources/constants'

function Footer() {
  const onClick = (key: number) => {
    window.open(SOCIAL_LINKS[key])
  }
  return (
    <div className="App-footer">
      <p> Handcrafted by Deepansh Bhargava</p>
      <span className="icons">
        <GitHub onClick={() => onClick(0)} />
        <LinkedIn className="ml-4" onClick={() => onClick(1)} />
        <Twitter className="ml-4" onClick={() => onClick(2)} />
      </span>
    </div>
  )
}

export default Footer
