import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { getMovieAPI } from 'services/movie'
import { SearchIcon } from 'assets/svgs'
import { favListState } from 'recoil/atom'
import { IListItem } from 'types/movie.d'
import { uniqBy } from 'lodash'
import styles from './search.module.scss'
import Item from 'components/Item'
import Modal from 'components/Modal'
import { cx } from 'styles'

const Search = () => {
  const [keyword, setKeyword] = useState<string>('')
  const [page, setPage] = useState(1)
  const [isShown, setShown] = useState(false)
  const [clickedMovie, setClickedMovie] = useState<IListItem>()
  const [totalResults, setTotalResults] = useState(0)
  const [movieList, setMovieList] = useState<IListItem[]>([])
  const [loading, setLoading] = useState(true)

  const [favMovieList] = useRecoilState<IListItem[]>(favListState)

  const ListBoxRef = useRef<HTMLDivElement | null>(null)
  const observeTargetRef = useRef<HTMLLIElement | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setKeyword(e.currentTarget.value)
  }

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setMovieList([])
    setPage(1)
    setLoading(true)

    MovieApi()
  }

  const handleClick = (e: { currentTarget: { id: string } }) => {
    setShown(true)
    setClickedMovie(
      favMovieList.find((item) => item.imdbID === e.currentTarget.id) ||
        movieList?.find((item) => item.imdbID === e.currentTarget.id)
    )
  }

  const MovieApi = async () => {
    try {
      const { data } = await getMovieAPI(keyword, page)
      if (data.Response === 'True') {
        setMovieList((prev) => uniqBy([...prev, ...data.Search], 'imdbID'))
        if (page === 1) {
          setTotalResults(Number(data.totalResults))
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  }

  useEffect(() => {
    window.localStorage.setItem('favorite_list', JSON.stringify(favMovieList))
  }, [favMovieList])

  useEffect(() => {
    MovieApi()
  }, [page])

  useEffect(() => {
    const options = {
      root: ListBoxRef.current,
      rootMargin: '0px 0px 40px 0px',
      threshold: 1,
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const observer = new IntersectionObserver(([entry], observer) => {
      const target = entry

      if (target.isIntersecting && movieList.length > 0) {
        if (page * 10 < totalResults) {
          setPage((prev) => prev + 1)
          observer.unobserve(entry.target)
        } else {
          setLoading(false)
        }
      }
    }, options)

    if (observeTargetRef?.current) observer.observe(observeTargetRef.current)

    return () => {
      observer.disconnect()
    }
  }, [movieList, page, totalResults])

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
      <main ref={ListBoxRef} className={cx(styles.main, { [styles.isShown]: isShown })}>
        {movieList.length ? (
          <ul>
            {movieList.map((item: IListItem) => {
              return (
                <li onClick={handleClick} role='presentation' key={item.imdbID} id={item.imdbID}>
                  {favMovieList.find((fav) => fav.imdbID === item.imdbID) ? (
                    <Item item={item} fav />
                  ) : (
                    <Item item={item} fav={false} />
                  )}
                </li>
              )
            })}
            {loading && (
              <li ref={observeTargetRef} className={styles.loading}>
                {'Loading... '}
              </li>
            )}
          </ul>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </main>
      <Modal clickedMovie={clickedMovie} isShown={isShown} setShown={setShown} />
    </div>
  )
}

export default Search
