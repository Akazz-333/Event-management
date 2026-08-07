import { connectDB } from '../config/db';
import { Movie } from '../models/Movie';

const sampleMFlixMovies = [
  {
    title: 'The Dark Knight',
    plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    fullplot: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
    genres: ['Action', 'Crime', 'Drama'],
    runtime: 152,
    poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
    released: new Date('2008-07-18'),
    directors: ['Christopher Nolan'],
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    imdb: { rating: 9.0, votes: 2700000 },
    rated: 'PG-13',
    year: 2008,
  },
  {
    title: 'Inception',
    plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    fullplot: 'Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb\'s rare ability has made him a coveted player in this treacherous new world of corporate espionage.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    runtime: 148,
    poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    released: new Date('2010-07-16'),
    directors: ['Christopher Nolan'],
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    imdb: { rating: 8.8, votes: 2400000 },
    rated: 'PG-13',
    year: 2010,
  },
  {
    title: 'Interstellar',
    plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    fullplot: 'Earth\'s future has been riddled by disasters, famines, and droughts. There is only one way to ensure humanity\'s survival: Interstellar travel. A newly discovered wormhole in the far reaches of our solar system allows a team of astronauts to go where no man has gone before.',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    runtime: 169,
    poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
    released: new Date('2014-11-07'),
    directors: ['Christopher Nolan'],
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    imdb: { rating: 8.7, votes: 1900000 },
    rated: 'PG-13',
    year: 2014,
  },
  {
    title: 'Pulp Fiction',
    plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    fullplot: 'Vincent Vega and Jules Winnfield are two hitmen on the hunt for a stolen briefcase belonging to their employer, mob boss Marsellus Wallace. Wallace has also asked Vincent to take his wife Mia out for a night while he is out of town.',
    genres: ['Crime', 'Drama'],
    runtime: 154,
    poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjJhXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    released: new Date('1994-10-14'),
    directors: ['Quentin Tarantino'],
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson', 'Bruce Willis'],
    imdb: { rating: 8.9, votes: 2100000 },
    rated: 'R',
    year: 1994,
  },
  {
    title: 'Avatar: The Way of Water',
    plot: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    fullplot: 'Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.',
    genres: ['Action', 'Adventure', 'Fantasy'],
    runtime: 192,
    poster: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctYzE2Yy00N2U0LThhMjgtYjMwMWZlZmUxODA3XkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_SX300.jpg',
    released: new Date('2022-12-16'),
    directors: ['James Cameron'],
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang'],
    imdb: { rating: 7.6, votes: 450000 },
    rated: 'PG-13',
    year: 2022,
  },
  {
    title: 'Oppenheimer',
    plot: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    fullplot: 'During World War II, Lt. Gen. Leslie Groves Jr. appoints physicist J. Robert Oppenheimer to work on the top-secret Manhattan Project. Oppenheimer and a team of scientists spend years developing and designing the atomic bomb.',
    genres: ['Biography', 'Drama', 'History'],
    runtime: 180,
    poster: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ5LTk4OWEtNzA3M2EwZzgxNjUzXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg',
    released: new Date('2023-07-21'),
    directors: ['Christopher Nolan'],
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    imdb: { rating: 8.9, votes: 650000 },
    rated: 'R',
    year: 2023,
  },
];

async function seedMFlix() {
  await connectDB();
  console.log('Seeding sample_mflix movies collection...');
  const count = await Movie.countDocuments();
  if (count === 0) {
    await Movie.insertMany(sampleMFlixMovies);
    console.log(`Successfully seeded ${sampleMFlixMovies.length} sample_mflix movies! 🎬`);
  } else {
    console.log(`sample_mflix.movies collection already contains ${count} records.`);
  }
  process.exit(0);
}

seedMFlix();
