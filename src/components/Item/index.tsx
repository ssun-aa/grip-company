import styles from './item.module.scss'
import { ColorStarIcon, ColorFavIcon } from 'assets/svgs'
import { IListItem } from 'types/movie.d'
import { noImage } from 'assets/images'
import { cx } from 'styles'

interface Props {
  item: IListItem
  fav: boolean
  review?: string
}

function onErrorHandler(e: { currentTarget: { src: string } }) {
  e.currentTarget.src = noImage
}

function stars(num: number) {
  const arr = Array(5).fill(false).fill(true, 0, num)

  return arr.map((value) =>
    value ? <ColorStarIcon className={styles.yellowStar} /> : <ColorStarIcon className={styles.star} />
  )
}

const ListItem = ({ item, fav, review }: Props) => {
  return (
    <div className={styles.item}>
      <div className={styles.poster}>
        <img src={item.Poster} width='40px' height='60px' alt='poster' onError={onErrorHandler} />
      </div>
      <div className={styles.detail}>
        <div className={styles.starRating}>{review ? stars(item.Star) : ''}</div>
        <h1>{item.Title}</h1>
        <p>{review ? '' : item.Type}</p>
        <p>{review}</p>
      </div>
      {fav ? (
        <ColorFavIcon className={cx(styles.favIcon, styles.colorFavIcon)} />
      ) : (
        <ColorFavIcon className={styles.favIcon} />
      )}
    </div>
  )
}

export default ListItem
