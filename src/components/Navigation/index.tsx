import styles from './navigation.module.scss'
import { SearchIcon, FavIcon } from 'assets/svgs'
import { NavLink } from 'react-router-dom'

const Navigation = () => {
  return (
    <div className={styles.wrap}>
      <NavLink to='/' className={styles.icon} style={({ isActive }) => (isActive ? { fill: 'black' } : {})}>
        <SearchIcon />
      </NavLink>
      <NavLink to='/fav' className={styles.icon} style={({ isActive }) => (isActive ? { fill: 'black' } : {})}>
        <FavIcon />
      </NavLink>
    </div>
  )
}

export default Navigation
