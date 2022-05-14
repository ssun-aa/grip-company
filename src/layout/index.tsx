import { Outlet } from 'react-router-dom'
import styles from './layout.module.scss'
import Navigation from 'components/Navigation'
import React, { useState } from 'react'

const Layout = () => {
  return (
    <div className={styles.app}>
      <div className={styles.wrap}>
        <div>
          <React.Suspense fallback={<div>Loading</div>}>
            <Outlet />
          </React.Suspense>
        </div>
        <nav className={styles.nav}>
          <Navigation />
        </nav>
      </div>
    </div>
  )
}

export default Layout
