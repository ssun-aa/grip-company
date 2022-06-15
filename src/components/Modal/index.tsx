import ReactDOM from 'react-dom'
import { IListItem, ModalProps } from 'types/movie.d'
import styles from './modal.module.scss'
import { StarIcon, ColorStarIcon, CheckIcon } from 'assets/svgs'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { favListState } from 'recoil/atom'

const Modal = ({ clickedMovie, isShown, setShown }: ModalProps) => {
  const outSection = useRef<HTMLDivElement>(null)
  const [favMovieList, setFavMovieList] = useRecoilState<IListItem[]>(favListState)
  const [review, setReview] = useState('')

  const handleClickOutside = (e: { target: any }) => {
    if (outSection.current !== null) {
      if (!outSection.current.contains(e.target)) {
        setShown(false)
      }
    }
  }

  const handleClickFav = () => {
    if (clickedMovie) {
      if (!favMovieList.some((fav) => fav.imdbID === clickedMovie.imdbID)) {
        setFavMovieList([...favMovieList, clickedMovie])
      } else setFavMovieList(favMovieList.filter((item) => item.imdbID !== clickedMovie.imdbID))
    }
  }

  const handleInputChange = (e: { currentTarget: { value: SetStateAction<string> } }) => {
    setReview(e.currentTarget.value)
  }

  const handleSaveReview = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    setFavMovieList((list) =>
      list.map((mo) => {
        return clickedMovie.imdbID === mo.imdbID ? { ...mo, Review: review } : mo
      })
    )
    setShown(false)
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  useEffect(() => setReview(clickedMovie?.Review), [clickedMovie?.Review])

  const isFav = favMovieList.some((fav) => fav.imdbID === clickedMovie?.imdbID)

  const modal = (
    <aside className={styles.modal} ref={outSection}>
      <div className={styles.movieDetail}>
        <img src={clickedMovie?.Poster} alt='poster' width='50px' />
        <div className={styles.text}>
          <p className={styles.title}>{clickedMovie?.Title}</p>
          <p>{clickedMovie?.Year}</p>
        </div>
      </div>
      <form onSubmit={handleSaveReview}>
        <input
          className={styles.input}
          type='text'
          disabled={!isFav}
          placeholder='즐겨찾기 후 작성이 가능합니다.'
          onChange={handleInputChange}
          value={review || ''}
        />
        <div className={styles.buttons}>
          <button type='button' onClick={handleClickFav} className={styles.button}>
            {isFav ? <ColorStarIcon /> : <StarIcon />}
          </button>
          <button type='button' onClick={handleSaveReview} className={styles.button}>
            <CheckIcon />
          </button>
        </div>
      </form>
    </aside>
  )
  const element = document.getElementById('modal')
  return isShown ? ReactDOM.createPortal(modal, element as Element) : null
}

export default Modal
