import { useEffect, useState } from "react";
import ErrorMessage from "./components/ErrorMessage";
import NavBar from "./components/NavBar";
import Logo from "./components/Logo";
import Search from "./components/Search";
import NumResults from "./components/NumResults";
import Main from "./components/Main";
import Box from "./components/Box";
import MoviesList from "./components/MoviesList";
import Loader from "./components/Loader";
import MovieDetails from "./components/MovieDetails";
import Summary from "./components/Summary";
import WatchedMoviesList from "./components/WatchedMoviesList";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const movieAPIKey = "dcb5e23d";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);
  // We are using a callback function to set the watched state initially
  // from the local storage.
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem('watched');
    if (storedValue) return JSON.parse(storedValue);
    return [];
  });

  function handleSelectMovie(id) {
    setSelectedId(selectedId => id === selectedId ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched(watched => [...watched, movie]);
    setQuery('');
  }

  function handleDeleteWatchedMovie(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }

  // This hook will synchronize the watched movie state with the movies
  // in local storage.
  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched])

  // To perform a side effect on initial mounting of our app.
  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError('');

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${movieAPIKey}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Something went wrong!");

        const data = await res.json();
        if (data.Response === 'False') throw new Error("Movie not found!");

        setMovies(data.Search);
        setError('');
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log(error.message);
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }

      if (query.length < 3) {
        setMovies([]);
        setError('');
        return;
      }
    }
    handleCloseMovie();
    fetchMovies();

    return function () {
      controller.abort();
    }
    // Whenever the 'query' will be changed, the useEffect 
    // code will run. 
  }, [query])

  return (
    <>
      {/* Using component composition to avoid prop-drilling */}
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error &&
            <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
          }
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {
            selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                watched={watched}
                onCloseMovie={handleCloseMovie}
                onAddWatchedMovie={handleAddWatchedMovie}
              />
            ) : (
              <>
                <Summary watched={watched} />
                <WatchedMoviesList
                  watched={watched}
                  onDeleteWatchedMovie={handleDeleteWatchedMovie}
                />
              </>
            )
          }
        </Box>
      </Main>
    </>
  );
}

