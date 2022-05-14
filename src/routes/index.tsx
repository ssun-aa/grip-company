import { RecoilRoot } from 'recoil'
import Layout from 'layout'
import Search from './Search'
import Favorites from './Favorites'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path='' element={<Search />} />
            <Route path='/fav' element={<Favorites />} />
          </Route>
        </Routes>
      </Router>
    </RecoilRoot>
  )
}

export default App
