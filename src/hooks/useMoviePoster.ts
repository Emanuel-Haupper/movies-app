import { useState, useEffect } from 'react'

// Module-level cache survives re-renders and is shared across all hook instances.
const cache: Record<string, string | null> = {}
const inflight: Record<string, Promise<string | null>> = {}

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY?.trim()

type OmdbResponse = {
    Response: 'True' | 'False'
    Poster?: string
}

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
    }
    return response.json() as Promise<T>
}

async function fetchOmdbPosterByTitle(title: string, year?: number): Promise<string | null> {
    if (!OMDB_API_KEY) return null
    const yearParam = year ? `&y=${year}` : ''
    const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&type=movie&t=${encodeURIComponent(title)}${yearParam}`
    const data = await fetchJson<OmdbResponse>(url)
    if (data.Response !== 'True') return null
    if (!data.Poster || data.Poster === 'N/A') return null
    return data.Poster
}

function fetchPoster(title: string, year: number): Promise<string | null> {
    const key = `${title}:::${year}`
    if (key in cache) return Promise.resolve(cache[key])
    if (key in inflight) return inflight[key]

    const p = (async () => {
        const withYear = await fetchOmdbPosterByTitle(title, year)
        if (withYear) {
            cache[key] = withYear
            delete inflight[key]
            return withYear
        }

        const withoutYear = await fetchOmdbPosterByTitle(title)
        cache[key] = withoutYear
        delete inflight[key]
        return withoutYear
    })()
        .catch(() => {
            cache[key] = null
            delete inflight[key]
            return null as string | null
        })

    inflight[key] = p
    return p
}

export function useMoviePoster(title: string, year: number) {
    const key = `${title}:::${year}`
    const [url, setUrl] = useState<string | null>(key in cache ? cache[key] : null)
    const [loading, setLoading] = useState(!(key in cache))

    useEffect(() => {
        if (key in cache) {
            setUrl(cache[key])
            setLoading(false)
            return
        }
        let cancelled = false
        setLoading(true)
        fetchPoster(title, year).then(u => {
            if (!cancelled) {
                setUrl(u)
                setLoading(false)
            }
        })
        return () => { cancelled = true }
    }, [key, title, year])

    return { url, loading }
}
