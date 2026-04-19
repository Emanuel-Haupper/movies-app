import { useState } from 'react'
import { HeroSection } from '../_my-components/index.ts'
import LightRays from '../components/LightRays.tsx'
import { MovieCarousel } from '../components/MovieCarousel.tsx'
import { MovieDetails, type Movie } from '../components/MovieDetails.tsx'
import { useMoviesData } from '../hooks/useMoviesData.ts'

import './../assets/css/home-page.css'

export function HomePage() {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
    const { movies, loadingMovies, moviesError } = useMoviesData()

    return (
        <div className="home-page page-transition">
            <HeroSection
                eyebrow="Welcome to"
                title="Movie Master"
                tagline="Your movies, one place, from classics to new releases"
                titleClassName="main-title-font"
                background={
                    <LightRays
                        raysOrigin="top-center"
                        raysColor="#fff"
                        raysSpeed={0.2}
                        lightSpread={0.8}
                        rayLength={1}
                        followMouse={true}
                        mouseInfluence={0.02}
                        noiseAmount={0}
                        pulsating={true}
                        fadeDistance={1}
                        saturation={1}
                    />
                }
            />

            {loadingMovies && <p className="home-page__state">Loading featured movies...</p>}
            {moviesError && <p className="home-page__state home-page__state--error">{moviesError}</p>}
            {!loadingMovies && !moviesError && (
                <MovieCarousel movies={movies} onMovieClick={setSelectedMovie} />
            )}

            {selectedMovie && (
                <MovieDetails
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </div>
    )
}
