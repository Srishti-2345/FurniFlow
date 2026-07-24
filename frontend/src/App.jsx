import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  CircleX,
  MapPin,
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
  const isProductRoute = window.location.pathname.startsWith('/furniture/')
  const isFurnitureRoute = window.location.pathname === '/furniture'
  const isBookingRoute = window.location.pathname === '/bookings/new'
  const isBookingsDashboardRoute = window.location.pathname === '/bookings'
  const isLoginRoute = window.location.pathname === '/login'
  const isRegisterRoute = window.location.pathname === '/register'
  const isSellerListingsRoute = window.location.pathname === '/seller/listings'
  const isSellerNewListingRoute = window.location.pathname === '/seller/listings/new'
  const isSellerBookingsRoute = window.location.pathname === '/seller/bookings'

  if (isSellerBookingsRoute) return <SellerBookingsPage />
  if (isSellerNewListingRoute) return <SellerListingFormPage />
  if (isSellerListingsRoute) return <SellerListingsPage />
  if (isLoginRoute || isRegisterRoute) return <AuthPage mode={isRegisterRoute ? 'register' : 'login'} />
  if (isBookingRoute) return <BookingPage />
  if (isBookingsDashboardRoute) return <BookingsDashboardPage />
  if (isProductRoute) return <FurnitureDetailPage />
  return isFurnitureRoute ? <FurniturePage /> : <HomePage />
}

function HomePage() {
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

function FurniturePage() {
  const initialParams = new URLSearchParams(window.location.search)
  const [products, setProducts] = useState(fallbackProducts)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(initialParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(initialParams.get('category') || 'All furniture')
  const [selectedCity, setSelectedCity] = useState('All cities')
  const [priceLimit, setPriceLimit] = useState('Any price')
  const [sortBy, setSortBy] = useState('Featured')

  useEffect(() => {
    const controller = new AbortController()
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

    async function loadProducts() {
      try {
        const response = await fetch(`${apiUrl}/furniture`, { signal: controller.signal })
        if (!response.ok) throw new Error('Could not load furniture')
        const result = await response.json()
        if (result.data?.length) setProducts(result.data)
      } catch (error) {
        if (error.name !== 'AbortError') console.info('Showing curated furniture while the API is unavailable.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
    return () => controller.abort()
  }, [])

  const filteredProducts = useMemo(() => {
    const maxPrice = priceLimit === 'Under ₹2,000' ? 2000 : priceLimit === 'Under ₹3,000' ? 3000 : Infinity
    const visibleProducts = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All furniture' || product.category === selectedCategory
      const matchesCity = selectedCity === 'All cities' || product.city === selectedCity
      return matchesSearch && matchesCategory && Number(product.pricePerMonth) <= maxPrice && matchesCity
    })

    return [...visibleProducts].sort((first, second) => {
      if (sortBy === 'Price: low to high') return first.pricePerMonth - second.pricePerMonth
      if (sortBy === 'Price: high to low') return second.pricePerMonth - first.pricePerMonth
      return 0
    })
  }, [priceLimit, products, searchTerm, selectedCategory, selectedCity, sortBy])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All furniture')
    setSelectedCity('All cities')
    setPriceLimit('Any price')
    setSortBy('Featured')
  }

  return (
    <main className="catalog-page">
      <header className="catalog-header">
        <a className="brand catalog-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a>
        <nav aria-label="Main navigation"><a href="/">Home</a><a className="active" href="/furniture">Shop</a><a href="/#inspiration">Inspiration</a></nav>
        <a className="catalog-bag" href="/">Saved <Heart size={17} strokeWidth={1.6} /></a>
      </header>

      <section className="catalog-intro">
        <p className="eyebrow dark">Furniture to rent</p>
        <h1>Find the piece that<br /><em>feels like home.</em></h1>
        <p>Thoughtfully selected furniture, delivered for the way you live now.</p>
      </section>

      <section className="catalog-content">
        <form className="catalog-search" onSubmit={(event) => event.preventDefault()}>
          <Search size={19} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search our collection" aria-label="Search our collection" />
          {searchTerm && <button type="button" aria-label="Clear search" onClick={() => setSearchTerm('')}><CircleX size={18} /></button>}
        </form>

        <div className="catalog-toolbar">
          <div className="filter-row">
            <label>Category<select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}><option>All furniture</option><option>Chairs</option><option>Tables</option><option>Beds</option><option>Storage</option></select><ChevronDown size={15} /></label>
            <label>Location<select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}><option>All cities</option><option>Bengaluru</option><option>Mumbai</option><option>Delhi</option></select><ChevronDown size={15} /></label>
            <label>Budget<select value={priceLimit} onChange={(event) => setPriceLimit(event.target.value)}><option>Any price</option><option>Under ₹2,000</option><option>Under ₹3,000</option></select><ChevronDown size={15} /></label>
          </div>
          <button className="clear-button" type="button" onClick={clearFilters}>Clear filters</button>
        </div>

        <div className="catalog-result-bar">
          <p>{isLoading ? 'Finding furniture…' : `${filteredProducts.length} piece${filteredProducts.length === 1 ? '' : 's'} for your space`}</p>
          <label className="sort-control">Sort by <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option></select><ChevronDown size={14} /></label>
        </div>

        {filteredProducts.length ? <div className="catalog-product-grid">
          {filteredProducts.map((product) => <article className="product-card catalog-product" key={product._id}>
            <div className="product-image"><img src={getImage(product)} alt={product.title} /><button type="button" aria-label={`Save ${product.title}`}><Heart size={18} /></button><span>{product.category}</span></div>
            <div className="product-details"><div><h3>{product.title}</h3><p><MapPin size={12} /> {product.city || 'Available now'}</p></div><strong>₹{Number(product.pricePerMonth).toLocaleString('en-IN')}<small>/mo</small></strong></div>
            <a className="view-piece" href={`/furniture/${product._id}`}>View piece <ArrowRight size={16} /></a>
          </article>)}
        </div> : <div className="empty-state"><h2>Nothing quite right yet.</h2><p>Try widening your filters, or return soon for newly listed pieces.</p><button className="button button-dark" type="button" onClick={clearFilters}>Show all furniture</button></div>}
      </section>

      <footer><a className="brand footer-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a><p>Furniture that feels like home.</p><span>© 2026 FurniFlow</span></footer>
    </main>
  )
}

function FurnitureDetailPage() {
  const productId = decodeURIComponent(window.location.pathname.split('/').pop())
  const [product, setProduct] = useState(() => fallbackProducts.find((item) => item._id === productId) || fallbackProducts[0])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

    async function loadProduct() {
      try {
        const response = await fetch(`${apiUrl}/furniture/${productId}`, { signal: controller.signal })
        if (!response.ok) throw new Error('Could not load furniture')
        const result = await response.json()
        if (result.data) setProduct(result.data)
      } catch (error) {
        if (error.name !== 'AbortError') console.info('Showing a preview while this furniture item is unavailable.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
    return () => controller.abort()
  }, [productId])

  const gallery = product.images?.length ? product.images.map((image) => image.url) : [getImage(product)]
  const description = product.description || `A considered ${product.category?.toLowerCase() || 'piece'} with an easy, timeless presence. Designed to make everyday living feel more comfortable and personal.`
  const condition = product.condition?.replace('_', ' ') || 'Like new'

  return (
    <main className="detail-page">
      <header className="catalog-header">
        <a className="brand catalog-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a>
        <nav aria-label="Main navigation"><a href="/">Home</a><a className="active" href="/furniture">Shop</a><a href="/#inspiration">Inspiration</a></nav>
        <a className="catalog-bag" href="/">Saved <Heart size={17} strokeWidth={1.6} /></a>
      </header>

      <div className="breadcrumb"><a href="/furniture">Collection</a><ChevronRight size={14} /><span>{product.category || 'Furniture'}</span><ChevronRight size={14} /><strong>{product.title}</strong></div>

      <section className="detail-layout">
        <div className="gallery">
          <div className="gallery-main"><img src={gallery[selectedImage]} alt={product.title} />{isLoading && <span className="gallery-status">Loading piece…</span>}</div>
          {gallery.length > 1 && <div className="gallery-thumbnails">{gallery.map((image, index) => <button className={selectedImage === index ? 'selected' : ''} type="button" key={image} onClick={() => setSelectedImage(index)}><img src={image} alt={`${product.title} view ${index + 1}`} /></button>)}</div>}
        </div>

        <div className="detail-copy">
          <p className="eyebrow dark">{product.category || 'Furniture'} collection</p>
          <div className="detail-title-row"><h1>{product.title}</h1><button type="button" aria-label={`Save ${product.title}`}><Heart size={21} /></button></div>
          <p className="detail-location"><MapPin size={15} /> Available in {product.city || 'your city'}</p>
          <p className="detail-description">{description}</p>

          <div className="rental-price"><span>Starting at</span><strong>₹{Number(product.pricePerMonth || 0).toLocaleString('en-IN')}<small>/month</small></strong><p>Security deposit: ₹{Number(product.securityDeposit || 0).toLocaleString('en-IN')}</p></div>
          <a className="button button-dark reserve-button" href={`/bookings/new?furniture=${product._id}`}>Reserve this piece <ArrowRight size={17} /></a>
          <p className="reserve-note">No payment today. Choose your rental period in the next step.</p>

          <div className="detail-facts">
            <div><span>Condition</span><strong>{condition}</strong></div>
            <div><span>Quantity available</span><strong>{product.quantity || 1}</strong></div>
            <div><span>Pickup / delivery</span><strong>{product.pickupAddress || 'Confirmed after booking'}</strong></div>
          </div>
        </div>
      </section>

      <section className="detail-assurance"><div><Sparkles size={19} /><span><strong>Handpicked quality</strong>Every piece is inspected before delivery.</span></div><div><ShoppingBag size={19} /><span><strong>Flexible rentals</strong>Keep it for as long as your home needs it.</span></div><div><Heart size={19} /><span><strong>Here to help</strong>Thoughtful support from browse to return.</span></div></section>
      <footer><a className="brand footer-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a><p>Furniture that feels like home.</p><span>© 2026 FurniFlow</span></footer>
    </main>
  )
}

function BookingPage() {
  const furnitureId = new URLSearchParams(window.location.search).get('furniture')
  const [product, setProduct] = useState(() => fallbackProducts.find((item) => item._id === furnitureId) || fallbackProducts[0])
  const [rentalMonths, setRentalMonths] = useState(3)
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0])
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [isLoading, setIsLoading] = useState(Boolean(furnitureId))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!furnitureId) return undefined

    const controller = new AbortController()
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

    async function loadProduct() {
      try {
        const response = await fetch(`${apiUrl}/furniture/${furnitureId}`, { signal: controller.signal })
        if (!response.ok) throw new Error('Could not load furniture')
        const result = await response.json()
        if (result.data) setProduct(result.data)
      } catch (loadError) {
        if (loadError.name !== 'AbortError') setError('This piece could not be loaded. Please return to the collection and choose an available item.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
    return () => controller.abort()
  }, [furnitureId])

  const monthlyPrice = Number(product.pricePerMonth || 0)
  const deposit = Number(product.securityDeposit || 0)
  const total = monthlyPrice * Number(rentalMonths) + deposit

  const submitBooking = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    const token = localStorage.getItem('token')

    if (!token) {
      setError('Please sign in as a customer before reserving furniture.')
      return
    }

    if (!furnitureId || !/^[a-f\d]{24}$/i.test(furnitureId)) {
      setError('Choose a live furniture listing before submitting a reservation.')
      return
    }

    setIsSubmitting(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
      const response = await fetch(`${apiUrl}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ furnitureId, rentalMonths: Number(rentalMonths), deliveryAddress, startDate }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Your reservation could not be created.')
      setMessage('Reservation request received. The owner will confirm availability shortly.')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="booking-page">
      <header className="catalog-header"><a className="brand catalog-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a><a className="back-link" href={furnitureId ? `/furniture/${furnitureId}` : '/furniture'}>← Back to piece</a></header>
      <section className="booking-intro"><p className="eyebrow dark">Reserve your piece</p><h1>A few details, then<br /><em>it’s on its way.</em></h1><p>Your reservation is sent to the owner for confirmation. No payment is taken today.</p></section>
      <section className="booking-layout">
        <form className="booking-form" onSubmit={submitBooking}>
          <div className="form-heading"><span>01</span><div><h2>Rental details</h2><p>Choose a rental period that works for you.</p></div></div>
          <div className="field-group"><label htmlFor="months">Rental period</label><select id="months" value={rentalMonths} onChange={(event) => setRentalMonths(event.target.value)}><option value="1">1 month</option><option value="3">3 months</option><option value="6">6 months</option><option value="12">12 months</option></select></div>
          <div className="field-group"><label htmlFor="start-date">Preferred delivery date</label><input id="start-date" type="date" min={new Date().toISOString().split('T')[0]} value={startDate} onChange={(event) => setStartDate(event.target.value)} required /></div>
          <div className="form-heading address-heading"><span>02</span><div><h2>Delivery address</h2><p>We’ll use this to coordinate delivery after confirmation.</p></div></div>
          <div className="field-group"><label htmlFor="address">Full address</label><textarea id="address" value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} placeholder="House or flat number, street, area, city and PIN code" rows="4" required /></div>
          {error && <p className="form-message error-message">{error}</p>}{message && <p className="form-message success-message">{message}</p>}
          <button className="button button-dark booking-submit" type="submit" disabled={isSubmitting || isLoading}>{isSubmitting ? 'Sending request…' : 'Request reservation'} <ArrowRight size={17} /></button>
        </form>

        <aside className="booking-summary"><p className="eyebrow dark">Your selection</p><div className="booking-product"><img src={getImage(product)} alt="" /><div><h3>{product.title}</h3><p>{product.category} · {product.city || 'Available now'}</p></div></div><div className="summary-row"><span>₹{monthlyPrice.toLocaleString('en-IN')} × {rentalMonths} month{Number(rentalMonths) > 1 ? 's' : ''}</span><strong>₹{(monthlyPrice * Number(rentalMonths)).toLocaleString('en-IN')}</strong></div><div className="summary-row"><span>Refundable security deposit</span><strong>₹{deposit.toLocaleString('en-IN')}</strong></div><div className="summary-total"><span>Total before confirmation</span><strong>₹{total.toLocaleString('en-IN')}</strong></div><p className="summary-note">Your final total and delivery timing are confirmed by the owner before payment.</p></aside>
      </section>
      <footer><a className="brand footer-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a><p>Furniture that feels like home.</p><span>© 2026 FurniFlow</span></footer>
    </main>
  )
}

function BookingsDashboardPage() {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [cancellingId, setCancellingId] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const token = localStorage.getItem('token')

    async function loadBookings() {
      if (!token) {
        setError('Sign in as a customer to view and manage your reservations.')
        setIsLoading(false)
        return
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
        const response = await fetch(`${apiUrl}/bookings/my-bookings`, {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` },
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || 'Could not load your bookings.')
        setBookings(result.bookings || [])
      } catch (loadError) {
        if (loadError.name !== 'AbortError') setError(loadError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings()
    return () => controller.abort()
  }, [])

  const filteredBookings = activeTab === 'All' ? bookings : bookings.filter((booking) => booking.status === activeTab.toLowerCase())
  const activeBookings = bookings.filter((booking) => ['pending', 'confirmed', 'active'].includes(booking.status)).length
  const completedBookings = bookings.filter((booking) => booking.status === 'completed').length

  const cancelBooking = async (bookingId) => {
    const token = localStorage.getItem('token')
    setCancellingId(bookingId)
    setError('')

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
      const response = await fetch(`${apiUrl}/bookings/${bookingId}/cancel`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Could not cancel this booking.')
      setBookings((currentBookings) => currentBookings.map((booking) => booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking))
    } catch (cancelError) {
      setError(cancelError.message)
    } finally {
      setCancellingId('')
    }
  }

  const formatDate = (date) => date ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date)) : 'To be confirmed'

  return (
    <main className="dashboard-page">
      <header className="catalog-header"><a className="brand catalog-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a><nav aria-label="Customer navigation"><a href="/">Home</a><a href="/furniture">Shop</a><a className="active" href="/bookings">My rentals</a></nav><a className="catalog-bag" href="/furniture">Browse pieces <ArrowRight size={16} /></a></header>
      <section className="dashboard-intro"><p className="eyebrow dark">Customer space</p><h1>Welcome back to<br /><em>your home story.</em></h1><p>Follow your reservations, manage active rentals, and find your next favourite piece.</p></section>
      <section className="dashboard-content">
        <div className="dashboard-stats"><div><span>Active reservations</span><strong>{activeBookings}</strong><p>Awaiting or currently in your home</p></div><div><span>Completed rentals</span><strong>{completedBookings}</strong><p>Pieces you have enjoyed so far</p></div><div><span>Need a new piece?</span><strong>Explore</strong><a href="/furniture">Browse collection <ArrowRight size={15} /></a></div></div>
        <div className="dashboard-heading"><div><p className="eyebrow dark">Your reservations</p><h2>Rental history</h2></div><div className="booking-tabs">{['All', 'pending', 'confirmed', 'active', 'completed'].map((tab) => <button type="button" className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}</div></div>
        {error && <div className="dashboard-message">{error} {error.includes('Sign in') && <a href="/">Return home</a>}</div>}
        {isLoading ? <p className="dashboard-loading">Loading your rentals…</p> : filteredBookings.length ? <div className="booking-list">{filteredBookings.map((booking) => {
          const furniture = booking.furniture || {}
          const status = booking.status || 'pending'
          return <article className="booking-card" key={booking._id}><div className="booking-card-image"><img src={getImage(furniture)} alt={furniture.title || 'Furniture'} /></div><div className="booking-card-main"><div className="booking-card-title"><div><p className="booking-status" data-status={status}>{status}</p><h3>{furniture.title || 'Furniture reservation'}</h3><p>{furniture.category || 'Furniture'} · {furniture.city || 'Delivery address on file'}</p></div><strong>₹{Number(booking.totalAmount || 0).toLocaleString('en-IN')}</strong></div><div className="booking-dates"><div><span>Rental starts</span><strong>{formatDate(booking.startDate)}</strong></div><div><span>Rental ends</span><strong>{formatDate(booking.endDate)}</strong></div><div><span>Duration</span><strong>{booking.rentalMonths} month{booking.rentalMonths > 1 ? 's' : ''}</strong></div></div><div className="booking-card-actions">{status === 'pending' ? <button type="button" className="cancel-booking" disabled={cancellingId === booking._id} onClick={() => cancelBooking(booking._id)}>{cancellingId === booking._id ? 'Cancelling…' : 'Cancel request'}</button> : <span>{status === 'confirmed' ? 'Your owner is coordinating delivery.' : status === 'active' ? 'Enjoy your piece. We hope it feels at home.' : 'This rental is complete.'}</span>}</div></div></article>
        })}</div> : !error && <div className="empty-state booking-empty"><h2>No reservations here yet.</h2><p>When you find a piece you love, your rental details will live right here.</p><a className="button button-dark" href="/furniture">Explore furniture <ArrowRight size={17} /></a></div>}
      </section>
      <footer><a className="brand footer-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a><p>Furniture that feels like home.</p><span>© 2026 FurniFlow</span></footer>
    </main>
  )
}

function AuthPage({ mode }) {
  const isRegistering = mode === 'register'
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', role: 'customer' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const updateField = (event) => setFormData((currentData) => ({ ...currentData, [event.target.name]: event.target.value }))

  const submitAuth = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
      const response = await fetch(`${apiUrl}/auth/${isRegistering ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRegistering ? formData : { email: formData.email, password: formData.password }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Something went wrong. Please try again.')

      if (isRegistering) {
        setMessage('Your account is ready. Sign in to start reserving furniture.')
      } else {
        localStorage.setItem('token', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))
        window.location.assign(result.user.role === 'customer' ? '/bookings' : '/seller/listings')
      }
    } catch (authError) {
      setError(authError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase"><a className="brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a><div><p className="eyebrow"><Sparkles size={15} /> A more considered home</p><h1>Furniture that makes space for <em>living.</em></h1><p>Find pieces to love now, with the freedom to make them yours for as long as you need.</p></div><span className="auth-credit">FurniFlow · Modern furniture rental</span></section>
      <section className="auth-form-section"><a className="auth-mobile-brand brand catalog-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a><div className="auth-form-wrap"><p className="eyebrow dark">{isRegistering ? 'Create your account' : 'Welcome back'}</p><h2>{isRegistering ? 'Start making space.' : 'Good to see you.'}</h2><p className="auth-subtitle">{isRegistering ? 'Create an account to reserve the pieces that feel right for home.' : 'Sign in to manage your rentals and discover your next piece.'}</p><form onSubmit={submitAuth}>
        {isRegistering && <><div className="field-group"><label htmlFor="fullName">Full name</label><input id="fullName" name="fullName" value={formData.fullName} onChange={updateField} autoComplete="name" required /></div><div className="field-group"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" value={formData.phone} onChange={updateField} autoComplete="tel" required /></div></>}
        <div className="field-group"><label htmlFor="email">Email address</label><input id="email" type="email" name="email" value={formData.email} onChange={updateField} autoComplete="email" required /></div><div className="field-group"><label htmlFor="password">Password</label><input id="password" type="password" name="password" value={formData.password} onChange={updateField} autoComplete={isRegistering ? 'new-password' : 'current-password'} minLength="6" required /></div>
        {isRegistering && <div className="role-choice"><span>I want to</span><label><input type="radio" name="role" value="customer" checked={formData.role === 'customer'} onChange={updateField} /> Rent furniture</label><label><input type="radio" name="role" value="seller" checked={formData.role === 'seller'} onChange={updateField} /> List furniture</label></div>}
        {error && <p className="form-message error-message">{error}</p>}{message && <p className="form-message success-message">{message} <a href="/login">Sign in now</a></p>}
        <button className="button button-dark auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : isRegistering ? 'Create account' : 'Sign in'} <ArrowRight size={17} /></button>
      </form><p className="auth-switch">{isRegistering ? 'Already have an account?' : 'New to FurniFlow?'} <a href={isRegistering ? '/login' : '/register'}>{isRegistering ? 'Sign in' : 'Create an account'}</a></p></div></section>
    </main>
  )
}

function SellerListingsPage() {
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const token = localStorage.getItem('token')
    async function loadListings() {
      if (!token) { setError('Sign in as a seller to manage your furniture.'); setIsLoading(false); return }
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
        const response = await fetch(`${apiUrl}/furniture/my-listings`, { signal: controller.signal, headers: { Authorization: `Bearer ${token}` } })
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || 'Could not load your listings.')
        setListings(result.furniture || [])
      } catch (loadError) { if (loadError.name !== 'AbortError') setError(loadError.message) } finally { setIsLoading(false) }
    }
    loadListings(); return () => controller.abort()
  }, [])

  const updateStatus = async (listing) => {
    const token = localStorage.getItem('token')
    const nextStatus = listing.status === 'active' ? 'inactive' : 'active'
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
      const response = await fetch(`${apiUrl}/furniture/${listing._id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: nextStatus }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Could not update this listing.')
      setListings((current) => current.map((item) => item._id === listing._id ? { ...item, status: nextStatus } : item))
    } catch (statusError) { setError(statusError.message) }
  }

  const activeCount = listings.filter((listing) => listing.status === 'active').length
  return <main className="seller-page"><header className="catalog-header"><a className="brand catalog-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a><nav><a href="/">Home</a><a className="active" href="/seller/listings">Seller studio</a><a href="/seller/bookings">Requests</a></nav><a className="button button-dark header-button" href="/seller/listings/new">Add a piece <ArrowRight size={15} /></a></header><section className="seller-intro"><p className="eyebrow dark">Seller studio</p><h1>Your furniture,<br /><em>beautifully managed.</em></h1><p>Keep your listings current and make it easy for the right home to find them.</p></section><section className="seller-content"><div className="seller-stats"><div><span>Total listings</span><strong>{listings.length}</strong></div><div><span>Live right now</span><strong>{activeCount}</strong></div><div><span>Paused</span><strong>{listings.length - activeCount}</strong></div></div><div className="seller-list-heading"><div><p className="eyebrow dark">Your inventory</p><h2>Furniture listings</h2></div><a className="button button-dark" href="/seller/listings/new">Add furniture <ArrowRight size={16} /></a></div>{error && <p className="dashboard-message">{error}</p>}{isLoading ? <p className="dashboard-loading">Loading your inventory…</p> : listings.length ? <div className="seller-list">{listings.map((listing) => <article className="seller-card" key={listing._id}><img src={getImage(listing)} alt={listing.title} /><div><p className="booking-status" data-status={listing.status}>{listing.status}</p><h3>{listing.title}</h3><p>{listing.category} · {listing.city} · ₹{Number(listing.pricePerMonth).toLocaleString('en-IN')}/month</p></div><div className="seller-card-actions"><span>{listing.quantity} available</span><button type="button" onClick={() => updateStatus(listing)}>{listing.status === 'active' ? 'Pause listing' : 'Make live'}</button></div></article>)}</div> : !error && <div className="empty-state"><h2>Your studio is ready.</h2><p>Add your first piece and let customers discover it.</p><a className="button button-dark" href="/seller/listings/new">Add your first piece <ArrowRight size={17} /></a></div>}</section><footer><a className="brand footer-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a><p>Furniture that feels like home.</p><span>© 2026 FurniFlow</span></footer></main>
}

function SellerBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')
  useEffect(() => { const controller = new AbortController(); const token = localStorage.getItem('token'); async function loadBookings() { if (!token) { setError('Sign in as a seller to view booking requests.'); setIsLoading(false); return } try { const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'; const response = await fetch(`${apiUrl}/bookings/seller-bookings`, { signal: controller.signal, headers: { Authorization: `Bearer ${token}` } }); const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Could not load booking requests.'); setBookings(result.bookings || []) } catch (loadError) { if (loadError.name !== 'AbortError') setError(loadError.message) } finally { setIsLoading(false) } } loadBookings(); return () => controller.abort() }, [])
  const nextActions = { pending: [{ label: 'Confirm request', status: 'confirmed' }, { label: 'Cancel request', status: 'cancelled' }], confirmed: [{ label: 'Mark rental active', status: 'active' }, { label: 'Cancel request', status: 'cancelled' }], active: [{ label: 'Complete rental', status: 'completed' }] }
  const updateBooking = async (bookingId, status) => { setUpdatingId(bookingId); setError(''); try { const token = localStorage.getItem('token'); const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'; const response = await fetch(`${apiUrl}/bookings/${bookingId}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) }); const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Could not update booking status.'); setBookings((current) => current.map((booking) => booking._id === bookingId ? { ...booking, status } : booking)) } catch (updateError) { setError(updateError.message) } finally { setUpdatingId('') } }
  return <main className="seller-page"><header className="catalog-header"><a className="brand catalog-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a><nav><a href="/">Home</a><a href="/seller/listings">Seller studio</a><a className="active" href="/seller/bookings">Requests</a></nav><a className="button button-dark header-button" href="/seller/listings/new">Add a piece <ArrowRight size={15} /></a></header><section className="seller-intro seller-booking-intro"><p className="eyebrow dark">Rental requests</p><h1>Every request is a<br /><em>new home story.</em></h1><p>Review, confirm, and follow each piece from its first hello to a happy home.</p></section><section className="seller-content"><div className="seller-list-heading"><div><p className="eyebrow dark">Booking management</p><h2>Customer requests</h2></div><span className="request-count">{bookings.filter((booking) => booking.status === 'pending').length} awaiting review</span></div>{error && <p className="dashboard-message">{error}</p>}{isLoading ? <p className="dashboard-loading">Loading booking requests…</p> : bookings.length ? <div className="seller-booking-list">{bookings.map((booking) => { const furniture = booking.furniture || {}; const customer = booking.customer || {}; const actions = nextActions[booking.status] || []; return <article className="seller-booking-card" key={booking._id}><img src={getImage(furniture)} alt={furniture.title || 'Furniture'} /><div className="seller-booking-info"><p className="booking-status" data-status={booking.status}>{booking.status}</p><h3>{furniture.title || 'Furniture reservation'}</h3><p>Requested by {customer.fullName || 'Customer'} · {customer.email || 'Email unavailable'}</p><div className="seller-booking-meta"><span>{booking.rentalMonths} month rental</span><span>Starts {booking.startDate ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(booking.startDate)) : 'TBC'}</span><strong>₹{Number(booking.totalAmount || 0).toLocaleString('en-IN')}</strong></div></div><div className="seller-request-actions">{actions.length ? actions.map((action) => <button type="button" className={action.status === 'cancelled' ? 'danger-action' : ''} disabled={updatingId === booking._id} onClick={() => updateBooking(booking._id, action.status)} key={action.status}>{updatingId === booking._id ? 'Updating…' : action.label}</button>) : <span>{booking.status === 'completed' ? 'Rental complete' : 'Request cancelled'}</span>}</div></article> })}</div> : !error && <div className="empty-state"><h2>No requests just yet.</h2><p>Once customers discover your pieces, their rental requests will appear here.</p><a className="button button-dark" href="/seller/listings/new">Add furniture <ArrowRight size={17} /></a></div>}</section><footer><a className="brand footer-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a><p>Furniture that feels like home.</p><span>© 2026 FurniFlow</span></footer></main>
}

function SellerListingFormPage() {
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Chairs', pricePerMonth: '', securityDeposit: '', quantity: '1', condition: 'like_new', city: '', pickupAddress: '', imageUrl: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const updateField = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submitListing = async (event) => { event.preventDefault(); setError(''); setIsSubmitting(true); try { const token = localStorage.getItem('token'); const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'; const { imageUrl, ...listingData } = formData; const response = await fetch(`${apiUrl}/furniture`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...listingData, pricePerMonth: Number(listingData.pricePerMonth), securityDeposit: Number(listingData.securityDeposit), quantity: Number(listingData.quantity), images: imageUrl ? [{ url: imageUrl }] : [] }) }); const result = await response.json(); if (!response.ok) throw new Error(result.message || result.errors?.[0]?.msg || 'Could not create listing.'); window.location.assign('/seller/listings') } catch (submitError) { setError(submitError.message); setIsSubmitting(false) } }
  return <main className="seller-page"><header className="catalog-header"><a className="brand catalog-brand" href="/"><span className="brand-mark">F</span> Furni<span>Flow</span></a><a className="back-link" href="/seller/listings">← Back to inventory</a></header><section className="seller-form-wrap"><p className="eyebrow dark">New furniture listing</p><h1>Share a piece<br />worth <em>living with.</em></h1><form className="seller-form" onSubmit={submitListing}><div className="field-group"><label>Piece name</label><input name="title" value={formData.title} onChange={updateField} required /></div><div className="field-group"><label>Description</label><textarea name="description" value={formData.description} onChange={updateField} rows="4" required /></div><div className="form-grid"><div className="field-group"><label>Category</label><select name="category" value={formData.category} onChange={updateField}><option>Chairs</option><option>Tables</option><option>Beds</option><option>Storage</option></select></div><div className="field-group"><label>Condition</label><select name="condition" value={formData.condition} onChange={updateField}><option value="new">New</option><option value="like_new">Like new</option><option value="used">Used</option></select></div></div><div className="form-grid"><div className="field-group"><label>Monthly rental price (₹)</label><input type="number" min="1" name="pricePerMonth" value={formData.pricePerMonth} onChange={updateField} required /></div><div className="field-group"><label>Security deposit (₹)</label><input type="number" min="0" name="securityDeposit" value={formData.securityDeposit} onChange={updateField} required /></div></div><div className="form-grid"><div className="field-group"><label>Quantity</label><input type="number" min="1" name="quantity" value={formData.quantity} onChange={updateField} required /></div><div className="field-group"><label>City</label><input name="city" value={formData.city} onChange={updateField} required /></div></div><div className="field-group"><label>Pickup address</label><textarea name="pickupAddress" value={formData.pickupAddress} onChange={updateField} rows="2" required /></div><div className="field-group"><label>Image URL (optional)</label><input type="url" name="imageUrl" value={formData.imageUrl} onChange={updateField} placeholder="https://..." /></div>{error && <p className="form-message error-message">{error}</p>}<button className="button button-dark booking-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Publishing…' : 'Publish listing'} <ArrowRight size={17} /></button></form></section></main>
}

export default App
