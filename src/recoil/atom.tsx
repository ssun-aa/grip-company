import { atom } from 'recoil'
import { IListItem } from '../types/movie.d'

const data = window.localStorage.getItem('favorite_list')
export const favListState = atom<IListItem[]>({
  key: '#favList', // unique ID (with respect to other atoms/selectors)

  default: data ? JSON.parse(data) : [], // default value (aka initial value)
})
