import { average } from "../App";

export default function Summary({ watched }) {
    const avgImdbRating = parseFloat(average(watched.map((movie) => movie.imdbRating)).toFixed(1));
    const avgUserRating = parseFloat(average(watched.map((movie) => movie.userRating)).toFixed(1));
    const avgRuntime = parseFloat(average(watched.map((movie) => movie.runtime)).toFixed(1));

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} {watched.length !== 1 ? 'movies' : 'movie'}</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}
