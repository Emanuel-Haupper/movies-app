import { useEffect, useState } from 'react';
import { type Movie } from '../components/MovieDetails';

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY?.trim()

const MOVIE_SEEDS: Array<{ title: string; year: number }> = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Dark Knight', year: 2008 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: "Schindler's List", year: 1994 },
    { title: 'Inception', year: 2010 },
    { title: 'Interstellar', year: 2014 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: 'Avatar', year: 2009 },
    { title: 'Titanic', year: 1997 },
    { title: 'Avengers: Endgame', year: 2019 },
    { title: 'Parasite', year: 2019 },
    { title: 'Oppenheimer', year: 2023 },
    { title: 'Barbie', year: 2023 },
    { title: 'Top Gun: Maverick', year: 2022 },
    { title: 'Everything Everywhere All At Once', year: 2022 },
    { title: 'Dune: Part One', year: 2021 },
    { title: 'Whiplash', year: 2014 },
    { title: 'Mad Max: Fury Road', year: 2015 },
    { title: 'Get Out', year: 2017 },
]

type OmdbMovieResponse = {
    Response: 'True' | 'False'
    Title?: string
    Year?: string
    Genre?: string
    Director?: string
    imdbRating?: string
    BoxOffice?: string
    Awards?: string
}

function parseYear(value: string | undefined, fallback: number) {
    const parsed = Number.parseInt(value ?? '', 10)
    return Number.isFinite(parsed) ? parsed : fallback
}

function parseImdbScore(value: string | undefined) {
    const parsed = Number.parseFloat(value ?? '')
    return Number.isFinite(parsed) ? parsed : 0
}

function parseBoxOfficeToMillions(value: string | undefined) {
    if (!value || value === 'N/A') return 0
    const cleaned = value.replace(/[$,]/g, '')
    const parsed = Number.parseFloat(cleaned)
    if (!Number.isFinite(parsed)) return 0
    return Math.round(parsed / 1_000_000)
}

function deriveStatus(title: string, awards: string | undefined): Movie['status'] {
    if (awards && /Oscar|Academy Award|Golden Globe|BAFTA/i.test(awards)) return 'Award Winner'
    if (/[:]|\b(II|III|IV|V|VI|VII|VIII|IX|X)\b/i.test(title)) return 'Franchise'
    if (/Avengers|Mad Max|Top Gun|Dune|Matrix|Godfather|Avatar|Lord of the Rings/i.test(title)) return 'Franchise'
    return 'Standalone'
}

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    return response.json() as Promise<T>
}

async function fetchMovieFromOmdb(seed: { title: string; year: number }): Promise<Movie | null> {
    if (!OMDB_API_KEY) return null
    const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&type=movie&t=${encodeURIComponent(seed.title)}&y=${seed.year}`
    const data = await fetchJson<OmdbMovieResponse>(url)
    if (data.Response !== 'True') return null

    return {
        title: data.Title ?? seed.title,
        year: parseYear(data.Year, seed.year),
        genre: (data.Genre ?? 'Unknown').split(',')[0]?.trim() || 'Unknown',
        director: data.Director ?? 'Unknown',
        imdbScore: parseImdbScore(data.imdbRating),
        boxOffice: parseBoxOfficeToMillions(data.BoxOffice),
        status: deriveStatus(data.Title ?? seed.title, data.Awards),
    }
}

export function useMoviesData() {
    const [movies, setMovies] = useState<Movie[]>([])
    const [loadingMovies, setLoadingMovies] = useState(true)
    const [moviesError, setMoviesError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function loadMovies() {
            if (!OMDB_API_KEY) {
                setMoviesError('VITE_OMDB_API_KEY is missing. Add it to .env.local and restart the dev server.')
                setLoadingMovies(false)
                return
            }

            setLoadingMovies(true)
            setMoviesError(null)

            try {
                const results = await Promise.all(MOVIE_SEEDS.map(seed => fetchMovieFromOmdb(seed)))
                const resolved = results.filter((movie): movie is Movie => movie !== null)

                if (!cancelled) {
                    setMovies(resolved)
                    setLoadingMovies(false)
                }
            } catch {
                if (!cancelled) {
                    setMoviesError('Could not load movies from OMDb right now.')
                    setLoadingMovies(false)
                }
            }
        }

        loadMovies()
        return () => { cancelled = true }
    }, [])

    return { movies, loadingMovies, moviesError }
}
