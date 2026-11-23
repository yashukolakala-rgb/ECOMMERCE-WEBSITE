import { useMemo, useState } from 'react'
import './App.css'

const initialProducts = [
  { id: 1, name: 'Cloud Knit Sweater', category: 'Clothing', price: 89, oldPrice: 120, rating: 4.9, reviews: 128, color: 'Oatmeal', badge: 'BESTSELLER', stock: 18, image: 'photo-1576566588028-4147f3842f27' },
  { id: 2, name: 'Everyday Leather Tote', category: 'Accessories', price: 148, rating: 4.8, reviews: 86, color: 'Cognac', badge: 'NEW', stock: 12, image: 'photo-1548036328-c9fa89d128fa' },
  { id: 3, name: 'Studio Ceramic Set', category: 'Home', price: 64, oldPrice: 80, rating: 4.7, reviews: 54, color: 'Sand / White', badge: '−20%', stock: 25, image: 'photo-1578749556568-bc2c40e68b61' },
  { id: 4, name: 'Linen Weekend Shirt', category: 'Clothing', price: 76, rating: 4.9, reviews: 92, color: 'Sage', badge: '', stock: 9, image: 'photo-1598033129183-c4f50c736f10' },
  { id: 5, name: 'Sculpted Brass Lamp', category: 'Home', price: 189, rating: 4.8, reviews: 41, color: 'Brushed brass', badge: 'LOW STOCK', stock: 5, image: 'photo-1507473885765-e6ed057f782c' },
  { id: 6, name: 'Weekend Canvas Sneaker', category: 'Shoes', price: 92, oldPrice: 115, rating: 4.6, reviews: 73, color: 'Natural', badge: '−20%', stock: 14, image: 'photo-1542291026-7eec264c27ff' },
  { id: 7, name: 'Ribbed Everyday Tank', category: 'Clothing', price: 38, rating: 4.7, reviews: 116, color: 'Cloud white', badge: '', stock: 31, image: 'photo-1551488831-00ddcb6c6bd3' },
  { id: 8, name: 'Arc Pendant Necklace', category: 'Accessories', price: 58, rating: 4.9, reviews: 64, color: 'Gold vermeil', badge: 'POPULAR', stock: 17, image: 'photo-1611652022419-a9419f74343d' },
]

const categories = ['All pieces', 'Clothing', 'Accessories', 'Home', 'Shoes']
const imageUrl = (id, width = 720) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
const createRecordId = () => Date.now()
const readStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function Icon({ name, size = 20 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    box: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="M3 8v9l9 5 9-5V8M12 13v9" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function App() {
  const [products, setProducts] = useState(() => readStorage('atelier-products', initialProducts))
  const [cart, setCart] = useState(() => readStorage('atelier-cart', []))
  const [orders, setOrders] = useState(() => readStorage('atelier-orders', []))
  const [users, setUsers] = useState(() => readStorage('atelier-users', []))
  const [user, setUser] = useState(() => readStorage('atelier-user', null))
  const [category, setCategory] = useState('All pieces')
  const [sort, setSort] = useState('Featured')
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [panel, setPanel] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [adminTab, setAdminTab] = useState('Products')
  const [notice, setNotice] = useState('')
  const [liked, setLiked] = useState([])
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Clothing', price: '', stock: '' })
  const [checkoutAddress, setCheckoutAddress] = useState('')

  const persist = (key, value, setter) => {
    setter(value)
    localStorage.setItem(key, JSON.stringify(value))
  }
  const filteredProducts = useMemo(() => {
    const matches = products.filter((product) => (
      (category === 'All pieces' || product.category === category)
      && `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(search.toLowerCase())
    ))
    if (sort === 'Price: low to high') matches.sort((a, b) => a.price - b.price)
    if (sort === 'Price: high to low') matches.sort((a, b) => b.price - a.price)
    if (sort === 'Top rated') matches.sort((a, b) => b.rating - a.rating)
    return matches
  }, [products, category, search, sort])
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const notify = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  const addToCart = (product) => {
    if (product.stock < 1) return notify('This piece is currently out of stock.')
    const found = cart.find((item) => item.id === product.id)
    if (found && found.quantity >= product.stock) return notify('You have added all available stock.')
    const next = found
      ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...product, quantity: 1 }]
    persist('atelier-cart', next, setCart)
    notify('Added to your bag')
  }
  const updateQuantity = (id, delta) => {
    const next = cart.map((item) => item.id === id
      ? { ...item, quantity: Math.min(products.find((product) => product.id === id)?.stock ?? item.quantity, item.quantity + delta) }
      : item).filter((item) => item.quantity > 0)
    persist('atelier-cart', next, setCart)
  }
  const completeOrder = (event) => {
    event.preventDefault()
    const unavailableItem = cart.find((item) => {
      const product = products.find((entry) => entry.id === item.id)
      return !product || product.stock < item.quantity
    })
    if (unavailableItem) return notify(`${unavailableItem.name} is no longer available in that quantity.`)
    if (!user) {
      setAuthMode('login')
      setPanel('auth')
      return
    }
    if (!cart.length) return
    const order = {
      id: `AT-${createRecordId().toString().slice(-6)}`,
      customer: user.name,
      email: user.email,
      date: new Date().toISOString(),
      status: 'Processing',
      address: checkoutAddress,
      items: cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
      total: subtotal,
    }
    persist('atelier-orders', [order, ...orders], setOrders)
    persist('atelier-products', products.map((product) => {
      const purchased = cart.find((item) => item.id === product.id)
      return purchased ? { ...product, stock: product.stock - purchased.quantity } : product
    }), setProducts)
    persist('atelier-cart', [], setCart)
    setPanel('')
    setCheckoutAddress('')
    notify('Order placed — thank you!')
  }
  const submitAuth = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email')).trim().toLowerCase()
    const password = String(data.get('password'))
    if (authMode === 'register') {
      if (users.some((entry) => entry.email === email)) return notify('An account with that email already exists.')
      const account = { name: String(data.get('name')).trim(), email, role: 'customer', joined: new Date().toISOString() }
      persist('atelier-users', [account, ...users], setUsers)
      persist('atelier-user', account, setUser)
      setPanel('')
      notify(`Welcome, ${account.name.split(' ')[0]}!`)
      return
    }
    if (email === 'admin@atelier.com' && password === 'admin123') {
      const admin = { name: 'Alex Morgan', email, role: 'admin' }
      persist('atelier-user', admin, setUser)
      setPanel('')
      notify('Welcome to your admin workspace.')
      return
    }
    const account = users.find((entry) => entry.email === email)
    if (!account || password.length < 1) return notify('We couldn’t find that account. Please register first.')
    persist('atelier-user', account, setUser)
    setPanel('')
    notify(`Welcome back, ${account.name.split(' ')[0]}!`)
  }
  const addProduct = (event) => {
    event.preventDefault()
    const product = {
      id: createRecordId(),
      name: newProduct.name.trim(),
      category: newProduct.category,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      rating: 5,
      reviews: 0,
      color: 'New arrival',
      badge: 'NEW',
      image: 'photo-1523275335684-37898b6baf30',
    }
    if (!product.name || !Number.isFinite(product.price) || product.price <= 0 || !Number.isInteger(product.stock) || product.stock < 0) return notify('Enter a name, a price above zero, and valid stock.')
    persist('atelier-products', [product, ...products], setProducts)
    setNewProduct({ name: '', category: 'Clothing', price: '', stock: '' })
    notify('Product added to your collection')
  }
  const setStock = (id, value) => persist('atelier-products', products.map((product) => product.id === id ? { ...product, stock: Math.max(0, Number(value)) } : product), setProducts)
  const updateOrder = (id, status) => persist('atelier-orders', orders.map((order) => order.id === id ? { ...order, status } : order), setOrders)
  const removeCustomer = (customer) => {
    if (!window.confirm(`Remove ${customer.name}'s account? Their order history will be kept.`)) return
    persist('atelier-users', users.filter((entry) => entry.email !== customer.email), setUsers)
    notify('Customer account removed.')
  }

  return (
    <div className="app-shell">
      <div className="announcement">A little something for your first order — enjoy 10% off with <strong>WELCOME10</strong></div>
      <header className="site-header">
        <button className="mobile-menu icon-button" aria-label="Open categories" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}><Icon name="menu" /></button>
        <a className="wordmark" href="#" onClick={(event) => { event.preventDefault(); setPanel(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>maison<span>.</span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#collection" onClick={() => setCategory('All pieces')}>Shop all</a>
          <a href="#collection" onClick={() => setCategory('Clothing')}>Clothing</a>
          <a href="#collection" onClick={() => setCategory('Home')}>Home & living</a>
          <a href="#story">Our story</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search products" onClick={() => { setShowSearch((value) => !value); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}><Icon name="search" /></button>
          <button className="icon-button account-button" aria-label={user ? `Account: ${user.name}` : 'Sign in'} onClick={() => user?.role === 'admin' ? setPanel('admin') : user ? setPanel('account') : (setAuthMode('login'), setPanel('auth'))}><Icon name="user" /><span className="account-label">{user ? user.name.split(' ')[0] : 'Account'}</span></button>
          <button className="icon-button bag-button" aria-label={`Shopping bag, ${cartCount} items`} onClick={() => setPanel('cart')}><Icon name="bag" /><span className="account-label">Bag</span>{cartCount > 0 && <span className="bag-count">{cartCount}</span>}</button>
        </div>
      </header>

      <main>
        {user?.role === 'admin' && <button className="admin-shortcut" onClick={() => setPanel('admin')}>Admin workspace <Icon name="arrow" size={16} /></button>}
        <section className="hero">
          <img className="hero-image" src={imageUrl('photo-1490481651871-ab68de25d43d', 1800)} alt="A thoughtfully curated wardrobe in natural light" />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow light-eyebrow">THE SLOW LIVING EDIT · NO. 04</p>
            <h1>Make room<br />for <em>the good</em> things.</h1>
            <p>Considered pieces for the everyday.<br />Made to be kept, loved, and lived in.</p>
            <a className="button button-light" href="#collection">Shop the collection <Icon name="arrow" size={17} /></a>
          </div>
          <span className="hero-index">01 — 04</span>
        </section>

        <section className="benefits" aria-label="Shopping benefits">
          <div><span className="benefit-icon">✳</span><span>Thoughtfully made<br /><small>Better materials, always</small></span></div>
          <div><span className="benefit-icon">↗</span><span>Free shipping<br /><small>On orders over $100</small></span></div>
          <div><span className="benefit-icon">♡</span><span>Easy returns<br /><small>30 days to find your fit</small></span></div>
          <div><span className="benefit-icon">◷</span><span>Made to last<br /><small>Quality over everything</small></span></div>
        </section>

        <section className="collection section-wrap" id="collection">
          <div className="section-heading">
            <div><p className="eyebrow">A FEW GOOD THINGS</p><h2>Find your new <em>everyday.</em></h2></div>
            <a className="text-link" href="#collection" onClick={() => { setCategory('All pieces'); setSearch('') }}>View all pieces <Icon name="arrow" size={16} /></a>
          </div>
          <div className="shop-tools">
            <div className="category-list" role="tablist" aria-label="Filter by category">
              {categories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'category-tab active' : 'category-tab'} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            <div className="filter-actions">
              {showSearch && <label className="search-field"><Icon name="search" size={16} /><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search pieces..." aria-label="Search pieces" /></label>}
              <label className="sort-field"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option>Featured</option><option>Top rated</option><option>Price: low to high</option><option>Price: high to low</option></select></label>
            </div>
          </div>
          <div className="product-grid">
            {filteredProducts.map((product, index) => (
              <article className="product-card" key={product.id}>
                <div className={`product-image image-tone-${index % 4}`}>
                  <img src={imageUrl(product.image)} alt={product.name} loading="lazy" />
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <button className={liked.includes(product.id) ? 'favorite-button favorited' : 'favorite-button'} aria-label={`${liked.includes(product.id) ? 'Remove' : 'Add'} ${product.name} ${liked.includes(product.id) ? 'from' : 'to'} favorites`} onClick={() => setLiked((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])}><Icon name="heart" size={18} /></button>
                  <button className="quick-add" onClick={() => addToCart(product)} disabled={product.stock === 0}>{product.stock === 0 ? 'Sold out' : 'Add to bag'} <Icon name="plus" size={16} /></button>
                </div>
                <div className="product-info">
                  <div><h3>{product.name}</h3><span className="product-color">{product.color}</span></div>
                  <div className="product-prices"><span>${product.price.toFixed(2)}</span>{product.oldPrice && <del>${product.oldPrice.toFixed(2)}</del>}</div>
                </div>
                <div className="product-rating"><span>★</span> {product.rating} <span className="review-count">({product.reviews})</span></div>
              </article>
            ))}
            {filteredProducts.length === 0 && <div className="empty-products"><p>No pieces found just yet.</p><button className="text-link" onClick={() => { setSearch(''); setCategory('All pieces') }}>Clear filters <Icon name="arrow" size={16} /></button></div>}
          </div>
        </section>

        <section className="story-banner" id="story">
          <img src={imageUrl('photo-1441986300917-64674bd600d8', 1600)} alt="A bright, welcoming independent shop" loading="lazy" />
          <div className="story-overlay" />
          <div className="story-content"><p className="eyebrow light-eyebrow">A NOTE FROM US</p><h2>Less, but<br /><em>so much better.</em></h2><p>We believe the things you live with should bring you joy. That’s why we work with small makers, choose natural materials, and never make more than we need.</p><a className="button button-light" href="#collection">Get to know us <Icon name="arrow" size={17} /></a></div>
        </section>
        <section className="newsletter"><p className="eyebrow">A GOOD THING IN YOUR INBOX</p><h2>A little more <em>lovely.</em></h2><p>New arrivals, thoughtful notes, and 10% off your first order.</p><form onSubmit={(event) => { event.preventDefault(); notify('You’re on the list — see you in your inbox!'); event.currentTarget.reset() }}><input type="email" placeholder="Your email address" required aria-label="Your email address" /><button aria-label="Subscribe"><Icon name="arrow" /></button></form></section>
      </main>
      <footer className="site-footer"><a className="wordmark" href="#">maison<span>.</span></a><p>Good things, made to stay.</p><span>© 2025 Maison Goods · Made with intention</span></footer>

      {panel === 'cart' && <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && setPanel('')}><aside className="side-panel cart-panel"><div className="panel-heading"><div><p className="eyebrow">YOUR LITTLE COLLECTION</p><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-button" aria-label="Close bag" onClick={() => setPanel('')}><Icon name="close" /></button></div>
        {cart.length === 0 ? <div className="cart-empty"><div className="empty-bag"><Icon name="bag" size={28} /></div><h3>Nothing in your bag, yet.</h3><p>Good things are just around the corner.</p><button className="button button-dark" onClick={() => { setPanel(''); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore the collection <Icon name="arrow" size={16} /></button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={imageUrl(item.image, 240)} alt="" /><div className="cart-item-info"><h3>{item.name}</h3><span>${item.price.toFixed(2)}</span><div className="quantity-control"><button aria-label={`Remove one ${item.name}`} onClick={() => updateQuantity(item.id, -1)}><Icon name="minus" size={13} /></button><span>{item.quantity}</span><button aria-label={`Add one ${item.name}`} onClick={() => updateQuantity(item.id, 1)}><Icon name="plus" size={13} /></button></div></div><strong>${(item.price * item.quantity).toFixed(2)}</strong></div>)}</div><div className="cart-bottom"><p className="shipping-note">You’re {Math.max(0, 100 - subtotal) > 0 ? `$${(100 - subtotal).toFixed(2)} away from` : 'enjoying'} free shipping</p><div className="cart-subtotal"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><small>Shipping and taxes calculated at checkout.</small><button className="button button-dark checkout-button" onClick={() => setPanel('checkout')}>Continue to checkout <Icon name="arrow" size={16} /></button></div></>}
      </aside></div>}

      {panel === 'checkout' && <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && setPanel('cart')}><section className="modal checkout-modal"><button className="icon-button modal-close" aria-label="Close checkout" onClick={() => setPanel('cart')}><Icon name="close" /></button><p className="eyebrow">ALMOST YOURS</p><h2>Checkout</h2>{!user && <div className="checkout-login">Have an account? <button onClick={() => { setAuthMode('login'); setPanel('auth') }}>Sign in</button> to save your order.</div>}<form onSubmit={completeOrder} className="checkout-form"><label>Email address<input type="email" value={user?.email || ''} readOnly={Boolean(user)} required placeholder="you@example.com" /></label><label>Shipping address<textarea value={checkoutAddress} onChange={(event) => setCheckoutAddress(event.target.value)} required rows="3" placeholder="Street address, city, postal code" /></label><div className="checkout-total"><span>Order total</span><strong>${subtotal.toFixed(2)}</strong></div><button className="button button-dark" type="submit">Place order <Icon name="arrow" size={16} /></button><p className="demo-caption">Demo checkout · no payment will be collected</p></form></section></div>}

      {panel === 'auth' && <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && setPanel('')}><section className="modal auth-modal"><button className="icon-button modal-close" aria-label="Close sign in" onClick={() => setPanel('')}><Icon name="close" /></button><p className="eyebrow">WELCOME TO MAISON</p><h2>{authMode === 'login' ? 'Lovely to see you.' : 'Make yourself at home.'}</h2><p className="modal-copy">{authMode === 'login' ? 'Sign in to find your orders and favorites.' : 'Create an account to keep all your good things together.'}</p><form className="auth-form" onSubmit={submitAuth}>{authMode === 'register' && <label>Your name<input name="name" autoComplete="name" required placeholder="First and last name" /></label>}<label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Password<input name="password" type="password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} required minLength="4" placeholder="At least 4 characters" /></label><button className="button button-dark" type="submit">{authMode === 'login' ? 'Sign in' : 'Create account'} <Icon name="arrow" size={16} /></button></form><p className="auth-switch">{authMode === 'login' ? 'New around here?' : 'Already have an account?'} <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>{authMode === 'login' ? 'Create an account' : 'Sign in'}</button></p><div className="admin-demo"><strong>Admin demo access</strong><span>admin@atelier.com · admin123</span></div></section></div>}

      {panel === 'account' && user && <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && setPanel('')}><section className="modal account-modal"><button className="icon-button modal-close" aria-label="Close account" onClick={() => setPanel('')}><Icon name="close" /></button><p className="eyebrow">YOUR MAISON ACCOUNT</p><h2>Hello, {user.name.split(' ')[0]}.</h2><p className="modal-copy">{user.email}</p><button className="account-option" onClick={() => setPanel('orders')}><Icon name="box" /> My orders <span>{orders.filter((order) => order.email === user.email).length}</span></button><button className="account-option logout-option" onClick={() => { persist('atelier-user', null, setUser); setPanel(''); notify('You’ve been signed out.') }}><Icon name="logout" /> Sign out</button></section></div>}

      {panel === 'orders' && <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && setPanel('')}><section className="modal orders-modal"><div className="panel-heading"><div><p className="eyebrow">THE GOOD THINGS YOU CHOSE</p><h2>Your orders</h2></div><button className="icon-button" aria-label="Close orders" onClick={() => setPanel('')}><Icon name="close" /></button></div>{orders.filter((order) => user?.role === 'admin' || order.email === user?.email).length === 0 ? <div className="no-orders"><Icon name="box" size={28} /><h3>Your next favorite is out there.</h3><p>Once you place an order, you can follow it here.</p><button className="text-link" onClick={() => { setPanel(''); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}>Start exploring <Icon name="arrow" size={16} /></button></div> : <div className="order-list">{orders.filter((order) => user?.role === 'admin' || order.email === user?.email).map((order) => <article className="order-card" key={order.id}><div className="order-card-top"><div><span className="order-id">{order.id}</span><small>{new Date(order.date).toLocaleDateString()}</small></div><span className={`status-pill status-${order.status.toLowerCase()}`}>{order.status}</span></div><div className="order-card-items">{order.items.map((item) => <div key={item.id}><span>{item.name} <small>× {item.quantity}</small></span><span>${(item.price * item.quantity).toFixed(2)}</span></div>)}</div><div className="order-card-total"><span>Total</span><strong>${order.total.toFixed(2)}</strong></div>{order.address && <p className="order-address">Delivering to: {order.address}</p>}</article>)}</div>}</section></div>}

      {panel === 'admin' && user?.role === 'admin' && <div className="overlay admin-overlay" onMouseDown={(event) => event.target === event.currentTarget && setPanel('')}><section className="admin-modal"><div className="admin-header"><div><p className="eyebrow">MAISON · BACK OFFICE</p><h2>Good morning, Alex.</h2></div><div className="admin-header-actions"><button className="text-link" onClick={() => setPanel('orders')}>View storefront <Icon name="arrow" size={16} /></button><button className="icon-button" aria-label="Close admin" onClick={() => setPanel('')}><Icon name="close" /></button></div></div><div className="admin-stats"><div><span>Active products</span><strong>{products.length}</strong><small>Across {new Set(products.map((product) => product.category)).size} collections</small></div><div><span>Orders</span><strong>{orders.length}</strong><small>{orders.filter((order) => order.status === 'Processing').length} to fulfill</small></div><div><span>Customers</span><strong>{users.length}</strong><small>Registered accounts</small></div><div><span>Inventory value</span><strong>${products.reduce((sum, product) => sum + product.price * product.stock, 0).toLocaleString()}</strong><small>At retail price</small></div></div><div className="admin-tabs">{['Products', 'Orders', 'Customers'].map((tab) => <button key={tab} onClick={() => setAdminTab(tab)} className={adminTab === tab ? 'admin-tab active' : 'admin-tab'}>{tab}{tab === 'Orders' && orders.length > 0 ? ` (${orders.length})` : ''}</button>)}</div>
        {adminTab === 'Products' && <div className="admin-content"><form className="add-product-form" onSubmit={addProduct}><h3>Add a piece</h3><div className="add-product-fields"><input value={newProduct.name} onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })} placeholder="Product name" aria-label="Product name" required /><select value={newProduct.category} onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })} aria-label="Product category">{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select><input type="number" min="0.01" step="0.01" value={newProduct.price} onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })} placeholder="Price ($)" aria-label="Price" required /><input type="number" min="0" value={newProduct.stock} onChange={(event) => setNewProduct({ ...newProduct, stock: event.target.value })} placeholder="Stock" aria-label="Stock" required /><button className="button button-dark" type="submit"><Icon name="plus" size={16} /> Add product</button></div></form><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Inventory</th><th /></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td className="admin-product-cell"><img src={imageUrl(product.image, 100)} alt="" /><span>{product.name}</span></td><td>{product.category}</td><td>${product.price.toFixed(2)}</td><td><input className={`stock-input ${product.stock < 7 ? 'stock-low' : ''}`} aria-label={`${product.name} inventory`} type="number" min="0" value={product.stock} onChange={(event) => setStock(product.id, event.target.value)} /></td><td><button className="delete-product" aria-label={`Remove ${product.name}`} onClick={() => persist('atelier-products', products.filter((item) => item.id !== product.id), setProducts)}><Icon name="close" size={17} /></button></td></tr>)}</tbody></table></div></div>}
        {adminTab === 'Orders' && <div className="admin-content"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Fulfillment</th></tr></thead><tbody>{orders.length === 0 ? <tr><td colSpan="5" className="table-empty">No orders yet. They’ll show up here as soon as someone checks out.</td></tr> : orders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong><small className="table-subtext">{order.items.reduce((total, item) => total + item.quantity, 0)} pieces</small></td><td>{order.customer}<small className="table-subtext">{order.email}</small></td><td>{new Date(order.date).toLocaleDateString()}</td><td>${order.total.toFixed(2)}</td><td><select className="order-status-select" value={order.status} onChange={(event) => updateOrder(order.id, event.target.value)}><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></td></tr>)}</tbody></table></div></div>}
        {adminTab === 'Customers' && <div className="admin-content"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Customer</th><th>Email</th><th>Joined</th><th>Orders</th><th /></tr></thead><tbody>{users.length === 0 ? <tr><td colSpan="5" className="table-empty">Customer accounts will appear here when shoppers join.</td></tr> : users.map((entry) => <tr key={entry.email}><td><strong>{entry.name}</strong></td><td>{entry.email}</td><td>{entry.joined ? new Date(entry.joined).toLocaleDateString() : '—'}</td><td>{orders.filter((order) => order.email === entry.email).length}</td><td><button className="delete-product" aria-label={`Remove ${entry.name}`} onClick={() => removeCustomer(entry)}><Icon name="close" size={17} /></button></td></tr>)}</tbody></table></div></div>}
        <div className="admin-footer"><span>Signed in as {user.email}</span><button onClick={() => { persist('atelier-user', null, setUser); setPanel(''); notify('You’ve been signed out.') }}>Sign out <Icon name="logout" size={15} /></button></div>
      </section></div>}

      {notice && <div className="toast" role="status"><span className="toast-check"><Icon name="check" size={15} /></span>{notice}</div>}
    </div>
  )
}

export default App