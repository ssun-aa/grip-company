import styles from './item.module.scss'
import { ColorStarIcon, StarIcon } from 'assets/svgs'
import { IListItem } from 'types/movie.d'
import { noImage } from 'assets/images'

interface Props {
  item: IListItem
  fav: boolean
  review?: string
}

function onErrorHandler(e: { currentTarget: { src: string } }) {
  e.currentTarget.src = noImage
}

const ListItem = ({ item, fav, review }: Props) => {
  return (
    <div className={styles.item}>
      <div className={styles.poster}>
        <img src={item.Poster} width='40px' height='60px' alt='poster' onError={onErrorHandler} />
      </div>
      <div className={styles.detail}>
        <h1>{item.Title}</h1>
        <p>{item.Type}</p>
        <p>{review || item.imdbID}</p>
        {fav ? (
          <ColorStarIcon className={styles.favIcon} viewBox='0,0,30,30' />
        ) : (
          <StarIcon className={styles.favIcon} viewBox='0,0,30,30' />
        )}
      </div>
    </div>
  )
}

export default ListItem
