import axios from "axios";

export const API_KEY = "32ed71067141940c96b8976038fe9071"; 
export const BASE_URL = "https://api.themoviedb.org/3";

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

export default tmdb;
