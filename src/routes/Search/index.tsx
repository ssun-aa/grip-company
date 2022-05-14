import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { getMovieAPI } from 'services/movie'
import { SearchIcon } from 'assets/svgs'
import { favListState } from 'recoil/atom'
import { IListItem } from 'types/movie.d'
import _ from 'lodash'
import styles from './search.module.scss'
import Item from 'components/Item'
import Modal from 'components/Modal'

const Search = () => {
  const [keyword, setKeyword] = useState<string>('')
  const [page, setPage] = useState(1)
  const [isShown, setShown] = useState(false)
  const [clickedMovie, setClickedMovie] = useState<IListItem>()
  const [totalResults, setTotalResults] = useState(0)

  const [movieList, setMovieList] = useState<IListItem[]>([])
  const [favMovieList, setFavMovieList] = useRecoilState<IListItem[]>(favListState)

  const pageEnd = useRef<any>()

  const handlecloseModal = () => setShown((prev) => !prev)

  const handleClickFav = () => {
    if (clickedMovie) {
      if (!favMovieList.some((fav) => fav.imdbID === clickedMovie.imdbID)) {
        setFavMovieList([...favMovieList, clickedMovie])
      } else setFavMovieList(favMovieList.filter((item) => item.imdbID !== clickedMovie.imdbID))

      setShown(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setKeyword(e.currentTarget.value)
  }

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setMovieList([])
    setPage(1)

    if (page === 1) {
      MovieApi()
    }
  }

  const handleClick = (e: { currentTarget: { id: string } }) => {
    setShown(true)
    setClickedMovie(movieList?.find((item) => item.imdbID === e.currentTarget.id))
  }

  const MovieApi = async () => {
    try {
      const { data } = await getMovieAPI(keyword, page)

      if (page === 1) {
        setTotalResults(data.totalResults)
      }
      if (data.Response === 'True') {
        setMovieList((prev) => _.uniqBy([...prev, ...data.Search], 'imdbID'))
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    MovieApi()
  }, [page])

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  useEffect(() => {
    window.localStorage.setItem('favorite_list', JSON.stringify(favMovieList))
  }, [favMovieList])

  useEffect(() => {
    let observer: IntersectionObserver

    if (pageEnd.current) {
      observer = new IntersectionObserver(
        async (entries) => {
          const target = entries[0]

          if (target.isIntersecting) {
            if (page * 10 < totalResults) {
              loadMore()
            }
          }
        },
        { threshold: 1 }
      )

      observer.observe(pageEnd.current)
    }
  }, [totalResults])

  return (
    <div className={styles.wrap}>
      <header>
        <form id='searchForm' onSubmit={onSubmit}>
          <input
            required
            type='text'
            placeholder='검색어를 입력하세요'
            className={styles.searchBar}
            onChange={handleChange}
          />
          <button type='submit' form='searchForm'>
            <SearchIcon className={styles.searchIcon} />
          </button>
        </form>
      </header>
      <main>
        {movieList.length ? (
          <ul>
            {movieList.map((item: IListItem) => {
              return (
                <li onClick={handleClick} role='presentation' key={item.imdbID} id={item.imdbID}>
                  {favMovieList.some((fav) => fav.imdbID === item.imdbID) ? (
                    <Item item={item} fav />
                  ) : (
                    <Item item={item} fav={false} />
                  )}
                </li>
              )
            })}
            <li ref={pageEnd}>{'Loading... '}</li>
          </ul>
        ) : (
          <p>검색 결과가 없습니다.</p>
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

export default Search
