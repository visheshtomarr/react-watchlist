import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import StarRating from './StarRating';

function Test() {
  const [movieRating, setMovieRating] = useState(0);

  return (
    <div>
      <StarRating
        color='red'
        maxRating={10}
        // With this prop, we will provide the 'StarRating' component
        // the functionality to update the 'movieRating' state of the 'Test' component.
        onSetRating={setMovieRating}
      />
      <p>This movie was rated {movieRating} {movieRating !== 1 ? 'stars' : 'star'}</p>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <StarRating
      maxRating={5}
      messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}
    />
    <StarRating size={24} color='lightgreen' defaultRating={3} />
    <Test /> */}
    <App />
  </React.StrictMode>
);
