
import { Film, House } from 'lucide-react'
import { Content, Footer, Topbar } from './_my-components'
import './assets/css/app.css'
import { useState } from 'react'
import { HomePage } from './pages/HomePage'
import { MoviesPage } from './pages/MoviesPage'

type Page = 'home' | 'movies'

const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    icon: <House size={14} />
  },
  {
    id: 'movies',
    label: 'Movies',
    icon: <Film size={14} />
  }
]

function App() {
  const [page, setPage] = useState<Page>('home')

  return (
    <main className='app-shell'>
      <Topbar
        appName="Movie Master"
        logo={<Film size={18} strokeWidth={1.6} />}
        appNameClassName='main-title-font'
        items={NAV_ITEMS}
        currentItem={page}
        onNavigate={(id) => setPage(id as Page)}
      />
      <main className="app-content">
        <Content className="app-content__inner">
          {page === 'home' && <HomePage />}
          {page === 'movies' && <MoviesPage />}
          <Footer
            appName="Movie Master"
            notes={['Built with React + WebGL']}
          />
        </Content>
      </main>
    </main>
  )
}

export default App
