import ReactDOM from 'react-dom'
import { IListItem, ModalProps } from 'types/movie.d'
import styles from './modal.module.scss'
import { ColorStarIcon, ColorFavIcon, CheckIcon } from 'assets/svgs'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { favListState } from 'recoil/atom'
import { cx } from 'styles'

const Modal = ({ clickedMovie, isShown, setShown }: ModalProps) => {
  const outSection = useRef<HTMLDivElement>(null)
  const [favMovieList, setFavMovieList] = useRecoilState<IListItem[]>(favListState)
  const [review, setReview] = useState('')
  const [starRate, setStarRate] = useState(0)

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
        return clickedMovie.imdbID === mo.imdbID ? { ...mo, Review: review, Star: starRate } : mo
      })
    )
    setShown(false)
  }

  const handleStarClick = (e: { target: { value: string } }) => {
    setStarRate(Number(e.target.value))
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
          <p className={styles.year}> {clickedMovie?.Year}</p>
          <div className={styles.starRating}>
            <input type='radio' id='5Star' name='rating' value='5' onChange={handleStarClick} />
            <label htmlFor='5Star' className={styles.star}>
              <ColorStarIcon />
            </label>
            <input type='radio' id='4Star' name='rating' value='4' onChange={handleStarClick} />
            <label htmlFor='4Star' className={styles.star}>
              <ColorStarIcon />
            </label>
            <input type='radio' id='3Star' name='rating' value='3' onChange={handleStarClick} />
            <label htmlFor='3Star' className={styles.star}>
              <ColorStarIcon />
            </label>
            <input type='radio' id='2Star' name='rating' value='2' onChange={handleStarClick} />
            <label htmlFor='2Star' className={styles.star}>
              <ColorStarIcon />
            </label>
            <input type='radio' id='1Star' name='rating' value='1' onChange={handleStarClick} />
            <label htmlFor='1Star' className={styles.star}>
              <ColorStarIcon />
            </label>
          </div>
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
          maxLength={15}
        />
        <div className={styles.buttons}>
          <button type='button' onClick={handleClickFav} className={styles.button}>
            {isFav ? (
              <ColorFavIcon className={cx(styles.favIcon, styles.colorFavIcon)} />
            ) : (
              <ColorFavIcon className={styles.favIcon} />
            )}
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
