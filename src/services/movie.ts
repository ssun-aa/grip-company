import { axios } from 'hooks/worker'
import { IMovieAPIRes } from 'types/movie.d'

const BASE_URL = 'https://www.omdbapi.com/'
const API_KEY = process.env.REACT_APP_MOVIE_API_KEY

export const getMovieAPI = (keyword: string, page: number) => {
  console.log(keyword, page)

  return axios.get<IMovieAPIRes>(`${BASE_URL}?apikey=${API_KEY}&s=${keyword}&page=${page}`)
}
