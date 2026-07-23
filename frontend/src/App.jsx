import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ChevronRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react'
import './App.css'

const categoryCards = [
  {
    name: 'Chairs',
    description: 'Thoughtful seating for every room.',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Tables',
    description: 'Gather around pieces made to last.',
    image:
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Beds',
    description: 'Rest easy in your perfect sanctuary.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Storage',
    description: 'Beautiful homes, beautifully organised.',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85',
  },
]

const fallbackProducts = [
  {
    _id: 'oak-lounge-chair',
    title: 'Oak Lounge Chair',
    category: 'Chairs',
    pricePerMonth: 1890,
    city: 'Bengaluru',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85',
  },
  {
    _id: 'travertine-table',
    title: 'Travertine Side Table',
    category: 'Tables',
    pricePerMonth: 1490,
    city: 'Mumbai',
    image:
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=900&q=85',
  },
  {
    _id: 'cloud-bed',
    title: 'Cloud King Bed',
    category: 'Beds',
    pricePerMonth: 2990,
    city: 'Delhi',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85',
  },
]

const getImage = (product) =>
  product.images?.[0]?.url || product.image || categoryCards[0].image

function App() {
  const [products, setProducts] = useState(fallbackProducts)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

    async function loadProducts() {
      try {
        const response = await fetch(`${apiUrl}/furniture`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Could not load furniture')

        const result = await response.json()
        if (result.data?.length) setProducts(result.data.slice(0, 3))
      } catch (error) {
        if (error.name !== 'AbortError') console.info('Showing curated furniture while the API is unavailable.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
    return () => controller.abort()
  }, [])

  const submitSearch = (event) => {
    event.preventDefault()
    if (!searchTerm.trim()) return
    window.location.assign(`/furniture?search=${encodeURIComponent(searchTerm.trim())}`)
  }

  return (
    <main>
      <section className="hero" id="home">
        <header className="site-header">
          <a className="brand" href="#home" aria-label="FurniFlow home">
            <span className="brand-mark">F</span>
            Furni<span>Flow</span>
          </a>

          <nav className={isMenuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
            <a href="#collection">Collection</a>
            <a href="#new-arrivals">New arrivals</a>
            <a href="#inspiration">Living room</a>
            <a href="#inspiration">Bedroom</a>
            <a href="#inspiration">Dining</a>
            <a href="#inspiration">Office</a>
          </nav>

          <div className="header-actions">
            <button className="icon-button" type="button" aria-label="Search">
              <Search size={18} strokeWidth={1.6} />
            </button>
            <button className="icon-button" type="button" aria-label="Saved items">
              <Heart size={18} strokeWidth={1.6} />
            </button>
            <button className="icon-button" type="button" aria-label="Shopping bag">
              <ShoppingBag size={18} strokeWidth={1.6} />
            </button>
            <button
              className="menu-button"
              type="button"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        <div className="hero-content">
          <p className="eyebrow"><Sparkles size={15} /> Designed around you</p>
          <h1>Design your dream space for modern, <em>beautiful</em> living.</h1>
          <p className="hero-copy">
            Discover considered furniture that brings comfort, character, and a little more joy to every corner of home.
          </p>
          <div className="hero-actions">
            <a className="button button-light" href="#collection">Explore collection <ArrowRight size={17} /></a>
            <a className="text-link" href="#inspiration">Find design inspiration <ChevronRight size={17} /></a>
          </div>
        </div>

        <form className="search-panel" onSubmit={submitSearch}>
          <Search size={20} />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search sofas, chairs, tables and more"
            aria-label="Search furniture"
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="categories section" id="collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">Shop by room</p>
            <h2>Made for the way you live</h2>
          </div>
          <a className="text-link dark-link" href="#new-arrivals">View all collections <ArrowRight size={17} /></a>
        </div>
        <div className="category-grid">
          {categoryCards.map((category) => (
            <a className="category-card" href={`/furniture?category=${category.name}`} key={category.name}>
              <div className="category-image"><img src={category.image} alt="" /></div>
              <div className="category-copy">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span>Discover <ArrowRight size={15} /></span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="new-arrivals section" id="new-arrivals">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">Fresh finds</p>
            <h2>New arrivals, ready for home</h2>
          </div>
          <p className="arrival-note">Rent distinctive furniture on your terms.</p>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product._id}>
              <div className="product-image">
                <img src={getImage(product)} alt={product.title} />
                <button type="button" aria-label={`Save ${product.title}`}><Heart size={18} /></button>
                <span>{product.category}</span>
              </div>
              <div className="product-details">
                <div><h3>{product.title}</h3><p>{product.city || 'Available now'}</p></div>
                <strong>₹{Number(product.pricePerMonth).toLocaleString('en-IN')}<small>/mo</small></strong>
              </div>
            </article>
          ))}
        </div>
        {isLoading && <p className="loading-message">Curating new arrivals…</p>}
      </section>

      <section className="inspiration" id="inspiration">
        <div className="inspiration-image" />
        <div className="inspiration-copy">
          <p className="eyebrow dark">The FurniFlow way</p>
          <h2>Timeless design for the home you are making.</h2>
          <p>Take your time. Explore pieces with presence, then make them yours for as long as you need.</p>
          <a className="button button-dark" href="#collection">Explore our story <ArrowRight size={17} /></a>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#home"><span className="brand-mark">F</span> Furni<span>Flow</span></a>
        <p>Furniture that feels like home.</p>
        <span>© 2026 FurniFlow</span>
      </footer>
    </main>
  )
}

export default App
