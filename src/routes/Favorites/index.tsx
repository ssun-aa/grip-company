import styles from './favorites.module.scss'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
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

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return

    const currentList = [...favMovieList]
    const beforIndex = result.source.index
    const afterIndex = result.destination.index

    const removeItem = currentList.splice(beforIndex, 1)

    currentList.splice(afterIndex, 0, removeItem[0])

    setFavMovieList(currentList)
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
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId='favorites'>
              {(provided) => (
                <ul className='favorites' {...provided.droppableProps} ref={provided.innerRef}>
                  {favMovieList.map((item: IListItem, index: number) => (
                    <Draggable key={item.imdbID} draggableId={item.imdbID} index={index}>
                      {(provide) => (
                        <li
                          ref={provide.innerRef}
                          {...provide.draggableProps}
                          {...provide.dragHandleProps}
                          onClick={handleClick}
                          role='presentation'
                          key={item.imdbID}
                          id={item.imdbID}
                        >
                          <Item item={item} fav />
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
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
