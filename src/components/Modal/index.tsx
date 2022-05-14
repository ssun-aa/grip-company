import ReactDOM from 'react-dom'
import { IListItem, ModalProps } from 'types/movie.d'
import styles from './modal.module.scss'
import { StarIcon, ColorStarIcon, CancelIcon } from 'assets/svgs'
import { useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { favListState } from 'recoil/atom'

const Modal = ({ clickedMovie, isShown, setShown, handleClickFav, handleCloseModal }: ModalProps) => {
  const outSection = useRef<HTMLDivElement>(null)
  const [favMovieList, setFavMovieList] = useRecoilState<IListItem[]>(favListState)

  const handleClickOutside = (e: { target: any }) => {
    if (outSection.current !== null) {
      if (!outSection.current.contains(e.target)) {
        setShown(false)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  const modal = (
    <aside className={styles.modal} ref={outSection}>
      <p>{clickedMovie?.Title}</p>
      <div className={styles.buttons}>
        <button type='button' onClick={handleClickFav} className={styles.button}>
          {favMovieList.some((fav) => fav.imdbID === clickedMovie?.imdbID) ? <ColorStarIcon /> : <StarIcon />}
        </button>
        <button type='button' onClick={handleCloseModal} className={styles.button}>
          <CancelIcon />
        </button>
      </div>
    </aside>
  )
  const element = document.getElementById('modal')
  return isShown ? ReactDOM.createPortal(modal, element as Element) : null
}

export default Modal
