import { useState, useEffect, useRef } from "react";
import { movieAPIKey } from "../App";
import Loader from "./Loader";
import StarRating from "./StarRating";
import { useKey } from "../hooks/useKey";

export default function MovieDetails({ selectedId, watched, onCloseMovie, onAddWatchedMovie }) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState('');

    const countRef = useRef(0);

    // With this we can count the number of times user has given 
    // a rating to a movie until finally it is added to the movie's list.
    // This data will persist across renders because of 'useRef'.
    useEffect(() => {
        if (userRating) countRef.current++;
    }, [userRating])

    const isWatched = watched.map(watchedMovie => watchedMovie.imdbID).includes(selectedId);
    const watchedUserRating = watched.find(watchedMovie => watchedMovie.imdbID === selectedId)?.userRating;

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre
    } = movie;

    useEffect(() => {
        const getMovieDetails = async () => {
            setIsLoading(true);
            const res = await fetch(`http://www.omdbapi.com/?apikey=${movieAPIKey}&i=${selectedId}`);
            const data = await res.json();
            setMovie(data);
            setIsLoading(false);
        };
        getMovieDetails();
    }, [selectedId]);

    useEffect(() => {
        if (!title) return;
        document.title = `Movie | ${title}`

        // If we return a function from a useEffect hook,
        // it is called a cleanup function that is executed when the 
        // side effect keeps happening after either re-render or unmounting of component.
        return function () {
            document.title = 'React Watchlist';
        }
    }, [title])

    useKey('Escape', onCloseMovie);

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(' ')[0]),
            userRating,
            countUserRatingDecision: countRef.current
        }

        onAddWatchedMovie(newWatchedMovie);
        onCloseMovie();
    }

    return (
        <div className="details">
            {isLoading ? <Loader /> :
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            &larr;
                        </button>
                        <img src={poster} alt={`Poster of ${movie} movie`} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>{released} &bull; {runtime}</p>
                            <p>{genre}</p>
                            <p><span>⭐</span>{imdbRating} IMDb Rating</p>
                        </div>
                    </header>

                    <section>
                        <div className="rating">
                            {!isWatched ? (
                                <>
                                    <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                                    {userRating > 0 && (
                                        <button className="btn-add" onClick={handleAdd}>
                                            + Add to Watchlist
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p>You have already rated this movie {watchedUserRating} <span>⭐</span></p>
                            )}
                        </div>
                        <p><em>{plot}</em></p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>}
        </div>
    );
}
