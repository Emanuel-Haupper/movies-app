import { useEffect, useRef } from 'react'
import { X, Star, DollarSign, User, Clapperboard, Tag } from 'lucide-react'
import { CustomButton, Badge } from '../_my-components'
import { useMoviePoster } from '../hooks/useMoviePoster'
import './css/movie-details.css'

export type Movie = {
    title: string
    year: number
    genre: string
    director: string
    imdbScore: number
    boxOffice: number
    status: 'Franchise' | 'Standalone' | 'Award Winner'
}

export const MOVIE_FACTS: Record<string, string> = {
    'The Shawshank Redemption': 'It flopped at the box office during its initial run but became the #1 rated film on IMDb after its VHS release. It earned seven Academy Award nominations without winning any.',
    'The Godfather': 'Marlon Brando stuffed his cheeks with cotton wool for the audition to get the raspy voice. The cat in the opening scene was a stray that wandered onto set and was never part of the script.',
    'The Dark Knight': 'Heath Ledger stayed in a hotel room for six weeks, keeping a diary as the Joker to prepare for the role. He passed away before the film was released and won a posthumous Oscar.',
    'Pulp Fiction': "The film was shot non-chronologically even within its already non-linear structure. John Travolta's career was revitalized — he had largely been forgotten by Hollywood before this role.",
    'The Lord of the Rings: The Return of the King': 'It won all 11 Academy Awards it was nominated for — every single category — tying the record for most wins. Director Peter Jackson shot all three films simultaneously over 15 months in New Zealand.',
    "Schindler's List": 'Spielberg refused a directing fee, calling it "blood money." The film was shot in black and white except for the famous red coat — a decision Spielberg made to make one child impossible to ignore.',
    'Inception': 'The spinning-top ending was intentional ambiguity. The real tell is Cobb\'s wedding ring — he wears it in every dream sequence but never in reality.',
    'Interstellar': 'NASA scientists collaborated on the visual effects for the black hole Gargantua. The simulation was so accurate it produced new scientific papers on gravitational lensing.',
    'The Matrix': 'Keanu Reeves broke three vertebrae preparing for the film and still performed many of his own stunts. The directors originally pitched a $80M budget; the studio gave them $10M for a proof of concept.',
    'Goodfellas': "Martin Scorsese used real mobsters as technical advisors and extras. Ray Liotta's laugh during the \"funny how?\" scene was improvised — Joe Pesci genuinely didn't know what was coming.",
    'Forrest Gump': "The feather CGI at the start cost more than some entire films of the era. Tom Hanks didn't receive his salary; instead, he took a percentage of the profits — a decision that made him tens of millions.",
    'Spirited Away': "Miyazaki wrote the screenplay with no pre-planned ending, discovering it scene by scene. It remained Japan's highest-grossing film for nearly 20 years until Demon Slayer: Mugen Train in 2020.",
    'The Silence of the Lambs': "Jodie Foster and Anthony Hopkins only share about 24 minutes of screen time together. Hopkins modeled Hannibal Lecter's voice on HAL 9000 from 2001: A Space Odyssey.",
    'Avatar': "Cameron invented new 3D camera systems to shoot the film and built the Simulcam to see virtual and live action blended in real time. He had written the script in 1994 but waited 12 years for technology to catch up.",
    'Titanic': 'Cameron drew the famous sketch of Rose himself for the film. He made 12 dives to the actual Titanic wreck and spent more time with the ship than any of its original passengers.',
    'Avengers: Endgame': 'The 3-hour film had no post-credits scene — a deliberate choice by the Russos. The final battle was filmed with over 3,000 visual effects shots, a record at the time.',
    'Parasite': "Bong Joon-ho based the semi-basement apartment on a place he actually lived in during his twenties. The film became the first non-English language film to win Best Picture at the Academy Awards.",
    'Oppenheimer': 'Nolan banned CGI for the Trinity test — the atomic bomb explosion was achieved practically using a combination of miniatures, magnesium, aluminum powder, and gasoline. Shot entirely on film.',
    'Barbie': "The production bought so much fluorescent pink paint that it caused a global shortage. Margot Robbie and Ryan Gosling reportedly didn't meet until the first day of filming.",
    'Top Gun: Maverick': "Tom Cruise insisted all cast members complete rigorous Navy aviation training. The film used real F/A-18 Super Hornets, and Cruise actually flew a P-51 Mustang and a Darkstar in several sequences.",
    'Everything Everywhere All At Once': 'Made on a budget of $14.3 million, it became A24\'s highest-grossing film ever. Michelle Yeoh became the first Asian woman to win Best Actress at the Academy Awards.',
    'Dune: Part One': 'Villeneuve refused to use CGI sandworms until the design felt totally alien. The sand sequences were shot in the Wadi Rum desert in Jordan — the same location used for The Martian.',
    'Whiplash': "Shot in just 19 days on a budget of $3.3 million. Miles Teller actually plays the drums in the film and practiced 8 hours a day for three months. His hands visibly bleed in several scenes.",
    'Mad Max: Fury Road': 'George Miller shot 480 hours of footage over 120 days in the Namibian desert. Charlize Theron and Tom Hardy reportedly refused to be in the same shot together for part of the production.',
    'Get Out': "Jordan Peele's debut feature, made on a $4.5 million budget. It became the first debut film by a Black writer-director to gross over $100 million in the US. Peele won Best Original Screenplay at the Oscars.",
}

const STATUS_VARIANT: Record<Movie['status'], 'info' | 'warning' | 'default'> = {
    'Franchise': 'info',
    'Award Winner': 'warning',
    'Standalone': 'default',
}

function scoreClass(score: number) {
    if (score >= 8.5) return 'movie-detail__stat-value--high'
    if (score >= 7.5) return 'movie-detail__stat-value--mid'
    return 'movie-detail__stat-value--low'
}

function formatBoxOffice(millions: number) {
    if (millions >= 1000) return `$${(millions / 1000).toFixed(1)}B`
    return `$${millions}M`
}

type MovieDetailsProps = {
    movie: Movie
    onClose: () => void
}

export function MovieDetails({ movie, onClose }: MovieDetailsProps) {
    const overlayRef = useRef<HTMLDivElement>(null)
    const { url: posterUrl, loading: posterLoading } = useMoviePoster(movie.title, movie.year)

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [onClose])

    function handleOverlayClick(e: React.MouseEvent) {
        if (e.target === overlayRef.current) onClose()
    }

    const fact = MOVIE_FACTS[movie.title]

    return (
        <div className="movie-overlay" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="movie-detail">
                <CustomButton
                    className="movie-detail__close"
                    icon={<X size={18} />}
                    variant="ghost"
                    onClick={onClose}
                    aria-label="Close"
                />

                <div className="movie-detail__poster-hero">
                    {posterLoading && <div className="movie-detail__poster-skeleton" />}
                    {!posterLoading && posterUrl && (
                        <img src={posterUrl} alt={movie.title} className="movie-detail__poster-img" />
                    )}
                </div>

                <div className="movie-detail__header">
                    <h2 className="movie-detail__title">{movie.title}</h2>
                    <div className="movie-detail__meta">
                        <Badge label={movie.status} variant={STATUS_VARIANT[movie.status]} />
                        <span className="movie-detail__year">{movie.year}</span>
                    </div>
                </div>

                <div className="movie-detail__stats">
                    <div className="movie-detail__stat">
                        <span className="movie-detail__stat-label"><Star size={10} style={{ marginRight: 4 }} />IMDb Score</span>
                        <span className={`movie-detail__stat-value movie-detail__stat-value--score ${scoreClass(movie.imdbScore)}`}>
                            {movie.imdbScore.toFixed(1)}
                        </span>
                    </div>
                    <div className="movie-detail__stat">
                        <span className="movie-detail__stat-label"><DollarSign size={10} style={{ marginRight: 4 }} />Box Office</span>
                        <span className="movie-detail__stat-value">{formatBoxOffice(movie.boxOffice)}</span>
                    </div>
                    <div className="movie-detail__stat">
                        <span className="movie-detail__stat-label"><User size={10} style={{ marginRight: 4 }} />Director</span>
                        <span className="movie-detail__stat-value" style={{ fontSize: '0.85rem' }}>{movie.director}</span>
                    </div>
                    <div className="movie-detail__stat">
                        <span className="movie-detail__stat-label"><Tag size={10} style={{ marginRight: 4 }} />Genre</span>
                        <span className="movie-detail__stat-value" style={{ fontSize: '0.85rem' }}>{movie.genre}</span>
                    </div>
                </div>

                {fact && (
                    <div className="movie-detail__fact">
                        <span className="movie-detail__fact-title"><Clapperboard size={10} style={{ marginRight: 4 }} />Did you know?</span>
                        <p className="movie-detail__fact-body">{fact}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
