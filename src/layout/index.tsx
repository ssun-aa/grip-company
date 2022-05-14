import { Outlet } from 'react-router-dom'
import styles from './layout.module.scss'
import Navigation from 'components/Navigation'
import React from 'react'

const Layout = () => {
  return (
    <div className={styles.app}>
      <div className={styles.wrap}>
        <React.Suspense fallback={<div>Loading</div>}>
          <Outlet />
        </React.Suspense>
        <nav className={styles.nav}>
          <Navigation />
        </nav>
      </div>
    </div>
  )
}

export default Layout
