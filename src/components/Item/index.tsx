import styles from './item.module.scss'
import { ColorStarIcon, StarIcon } from 'assets/svgs'
import { IListItem } from 'types/movie.d'

interface Props {
  item: IListItem
  fav: boolean
}

const ListItem = ({ item, fav }: Props) => {
  return (
    <div className={styles.item}>
      <div className={styles.poster}>
        <input type='image' src={item.Poster} width='40px' height='60px' alt='poster' />
      </div>
      <div className={styles.detail}>
        <h1>{item.Title}</h1>
        <p>{item.Type}</p>
        <p>{item.imdbID}</p>
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
