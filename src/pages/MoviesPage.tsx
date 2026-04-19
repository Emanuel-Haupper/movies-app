import { useState } from 'react'
import { DataTable, Badge, PageHeader } from '../_my-components'
import { MovieDetails, type Movie } from '../components/MovieDetails'
import { useMoviesData } from '../hooks/useMoviesData'
import '../assets/css/movies-page.css'

function scoreClass(score: number) {
    if (score >= 8.5) return 'imdb-score--high'
    if (score >= 7.5) return 'imdb-score--mid'
    return 'imdb-score--low'
}

function formatBoxOffice(millions: number) {
    if (millions >= 1000) return `$${(millions / 1000).toFixed(1)}B`
    return `$${millions}M`
}

const STATUS_VARIANT: Record<Movie['status'], 'info' | 'warning' | 'default'> = {
    'Franchise': 'info',
    'Award Winner': 'warning',
    'Standalone': 'default',
}

const COLUMNS = [
    { key: 'title', label: 'Title', minWidth: '220px' },
    { key: 'year', label: 'Year', minWidth: '72px' },
    { key: 'genre', label: 'Genre', minWidth: '110px' },
    { key: 'director', label: 'Director', minWidth: '175px' },
    {
        key: 'imdbScore',
        label: 'IMDb',
        minWidth: '80px',
        render: (v: number) => (
            <span className={`imdb-score ${scoreClass(v)}`}>{v.toFixed(1)}</span>
        ),
    },
    {
        key: 'boxOffice',
        label: 'Box Office',
        minWidth: '105px',
        render: (v: number) => formatBoxOffice(v),
    },
    {
        key: 'status',
        label: 'Status',
        minWidth: '120px',
        render: (v: Movie['status']) => <Badge label={v} variant={STATUS_VARIANT[v]} />,
    },
]

export function MoviesPage() {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
    const { movies, loadingMovies, moviesError } = useMoviesData()

    return (
        <div className="movies-page page-transition">
            <PageHeader
                title="Movies"
                subtitle="A curated list of landmark films — sort, filter and paginate below"
            />
            {loadingMovies && <p className="movies-page__state">Loading movies from OMDb...</p>}
            {moviesError && <p className="movies-page__state movies-page__state--error">{moviesError}</p>}
            <DataTable
                data={movies}
                columns={COLUMNS}
                filterKey="title"
                filters={[
                    { key: 'genre', label: 'Genre', type: 'select' },
                    { key: 'status', label: 'Status', type: 'select' },
                    { key: 'year', label: 'Year', type: 'range' },
                    { key: 'imdbScore', label: 'IMDb Score', type: 'range' },
                ]}
                onRowClick={row => setSelectedMovie(row as Movie)}
            />
            {selectedMovie && (
                <MovieDetails
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </div>
    )
}