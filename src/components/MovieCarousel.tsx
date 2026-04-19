import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Film } from 'lucide-react'
import { CustomButton } from '../_my-components'
import { type Movie, MOVIE_FACTS } from './MovieDetails'
import { useMoviePoster } from '../hooks/useMoviePoster'
import './css/movie-carousel.css'

const FEATURED_TITLES = [
    'The Shawshank Redemption',
    'The Dark Knight',
    'Inception',
    'Pulp Fiction',
    'Parasite',
    'Spirited Away',
    'Interstellar',
    'Mad Max: Fury Road',
]

type Props = {
    movies: Movie[]
    onMovieClick: (movie: Movie) => void
}

function CarouselSlide({
    movie,
    active,
    onSelect,
}: {
    movie: Movie
    active: boolean
    onSelect: () => void
}) {
    const { url, loading } = useMoviePoster(movie.title, movie.year)
    const fact = MOVIE_FACTS[movie.title]
    const slideClassName = [
        'movie-carousel__slide',
        active ? 'movie-carousel__slide--active' : '',
    ].filter(Boolean).join(' ')
    const mediaClassName = [
        'movie-carousel__media',
        url ? 'movie-carousel__media--with-image' : 'movie-carousel__media--fallback',
    ].filter(Boolean).join(' ')

    return (
        <div className={slideClassName}>
            <div className="movie-carousel__info">
                <div className="movie-carousel__tags">
                    <span className="movie-carousel__genre">{movie.genre}</span>
                    <span className="movie-carousel__year">{movie.year}</span>
                </div>
                <h3 className="movie-carousel__title">{movie.title}</h3>
                <p className="movie-carousel__director">{movie.director}</p>
                <div className="movie-carousel__score">
                    <Star size={11} fill="currentColor" />
                    {movie.imdbScore.toFixed(1)}
                </div>
                {fact && <p className="movie-carousel__fact">{fact}</p>}
                <CustomButton variant="outline" onClick={onSelect} className="movie-carousel__cta">
                    View Details
                </CustomButton>
            </div>

            <div
                className={mediaClassName}
                style={url ? { backgroundImage: `url(${url})` } : undefined}
            >
                {loading && <div className="movie-carousel__skeleton" />}
                {!loading && !url && (
                    <div className="movie-carousel__no-poster">
                        <Film size={28} />
                    </div>
                )}
            </div>
        </div>
    )
}

export function MovieCarousel({ movies, onMovieClick }: Props) {
    const featured = FEATURED_TITLES
        .map(t => movies.find(m => m.title === t))
        .filter((m): m is Movie => m !== undefined)

    const [active, setActive] = useState(0)
    const [paused, setPaused] = useState(false)

    if (featured.length === 0) {
        return (
            <section className="movie-carousel movie-carousel--empty" aria-label="Featured movies unavailable">
                <div className="movie-carousel__empty-copy">
                    <span className="movie-carousel__empty-eyebrow">Featured now</span>
                    <h3 className="movie-carousel__empty-title">No featured movies available yet</h3>
                    <p className="movie-carousel__empty-text">
                        Once movie data loads, this area will highlight standout titles with posters and quick details.
                    </p>
                </div>
                <div className="movie-carousel__empty-art" aria-hidden="true">
                    <div className="movie-carousel__empty-ring">
                        <Film size={34} />
                    </div>
                </div>
            </section>
        )
    }

    useEffect(() => {
        if (paused || featured.length < 2) return
        const id = setInterval(() => setActive(i => (i + 1) % featured.length), 5000)
        return () => clearInterval(id)
    }, [paused, featured.length])

    const prev = () => setActive(i => (i - 1 + featured.length) % featured.length)
    const next = () => setActive(i => (i + 1) % featured.length)

    return (
        <div
            className="movie-carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {featured.map((movie, i) => (
                <CarouselSlide
                    key={movie.title}
                    movie={movie}
                    active={i === active}
                    onSelect={() => onMovieClick(movie)}
                />
            ))}

            <div className="movie-carousel__nav">
                <CustomButton
                    variant="ghost"
                    icon={<ChevronLeft size={14} />}
                    onClick={prev}
                    aria-label="Previous"
                />
                <div className="movie-carousel__dots">
                    {featured.map((_, i) => (
                        <button
                            key={i}
                            className={`movie-carousel__dot${i === active ? ' movie-carousel__dot--active' : ''}`}
                            onClick={() => setActive(i)}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
                <CustomButton
                    variant="ghost"
                    icon={<ChevronRight size={14} />}
                    onClick={next}
                    aria-label="Next"
                />
            </div>
        </div>
    )
}
