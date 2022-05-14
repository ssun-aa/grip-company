import styles from './favorites.module.scss'
import { useEffect, useMount, useState } from 'hooks'
import { atom, useRecoilState } from 'recoil'
import { favListState } from 'recoil/atom'
import { IListItem } from 'types/movie.d'
import Item from 'components/Item'
import Modal from 'components/Modal'

const Favorites = () => {
  const [isShown, setShown] = useState(false)
  const [clickedMovieId, setClickedMovieId] = useState('')
  const [clickedMovie, setClickedMovie] = useState<IListItem>()

  const [favMovieList, setFavMovieList] = useRecoilState<IListItem[]>(favListState)

  const handlecloseModal = () => setShown((prev) => !prev)

  const handleClickFav = () => {
    if (clickedMovie) {
      if (!favMovieList.includes(clickedMovie)) setFavMovieList([...favMovieList, clickedMovie])
      else setFavMovieList(favMovieList.filter((item) => item !== clickedMovie))

      setShown(false)
    }
  }

  const handleClick = (e: { currentTarget: { id: string } }) => {
    setShown(true)
    setClickedMovieId(e.currentTarget.id)
  }

  useEffect(() => {
    setClickedMovie(favMovieList.find((item) => item.imdbID === clickedMovieId))
  }, [clickedMovieId])

  useEffect(() => {
    window.localStorage.setItem('favorite_list', JSON.stringify(favMovieList))
  }, [favMovieList])

  return (
    <div className={styles.wrap}>
      <header className={styles.title}>
        <p>내 즐겨찾기</p>
      </header>
      <main>
        {favMovieList.length ? (
          <ul>
            {favMovieList.map((item: IListItem) => (
              <li onClick={handleClick} role='presentation' key={item.imdbID} id={item.imdbID}>
                <Item item={item} fav />
              </li>
            ))}
          </ul>
        ) : (
          <p>즐겨찾기가 없습니다.</p>
        )}
      </main>
      <Modal
        clickedMovie={clickedMovie}
        isShown={isShown}
        setShown={setShown}
        handleClickFav={handleClickFav}
        handleCloseModal={handlecloseModal}
      />
    </div>
  )
}

export default Favorites
