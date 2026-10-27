import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

const OCCASIONS = [
  { name: "Birthday", slug: "birthday", img: "/images/birthday.jpg" },
  { name: "Anniversary", slug: "anniversary", img: "/images/anniversary.jpg" },
  { name: "Graduation", slug: "graduation", img: "/images/graduation.jpg" },
  { name: "Best Friend", slug: "best-friend", img: "/images/bestfriends.jpg" },
  { name: "Personalized", slug: "personalized-gifts", img: "/images/mug.jpg" },
  { name: "Handmade", slug: "handmade-gifts", img: "/images/handmade.jpg" },
];

const TESTIMONIALS = [
  { text: "The mystery jar was such a cute surprise. My bestie loved every single item!", name: "Ananya, Mumbai" },
  { text: "Personalized mug arrived beautifully packed. Perfect birthday gift.", name: "Riya, Pune" },
  { text: "Lovely packaging and quick delivery. Will order again for sure.", name: "Meera, Delhi" },
];

function Section({ title, sub, state, products }) {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <p className="section-sub">{sub}</p>
        {state.loading && (
          <div className="state-box"><div className="spinner" />Loading gifts...</div>
        )}
        {state.error && <div className="error-box">{state.error}</div>}
        {!state.loading && !state.error && products.length === 0 && (
          <div className="state-box">No products found.</div>
        )}
        <div className="grid">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getProducts("featured=true&mystery=false&limit=4"),
      api.getProducts("bestseller=true&mystery=false&limit=4"),
    ])
      .then(([f, b]) => {
        setFeatured(f.products);
        setBestsellers(b.products);
        setState({ loading: false, error: "" });
      })
      .catch((err) => setState({ loading: false, error: err.message }));
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <h1>Gifts that feel like a warm hug 🎀</h1>
            <p>Personalized gifts, handmade surprises and mystery jars, made to make someone smile.</p>
            <div className="hero-actions">
              <Link to="/shop" className="btn">Shop Gifts</Link>
              <Link to="/mystery-jars" className="btn btn-outline">Explore Mystery Jars</Link>
            </div>
          </div>
          <div className="hero-img">
            <img
              src="/images/hero.jpg"
              alt="Beautifully wrapped gifts"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Occasion</h2>
          <p className="section-sub">Find the perfect gift for every moment</p>
          <div className="occasion-grid">
            {OCCASIONS.map((o) => (
              <Link key={o.slug} to={`/shop?category=${o.slug}`} className="occasion-tile">
                <img
                  src={o.img}
                  alt={o.name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="occasion-overlay">
                  <h3>{o.name}</h3>
                  <span>Shop now →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Section title="Featured Gifts" sub="Hand-picked favourites" state={state} products={featured} />
      <Section title="Bestsellers" sub="Loved by our customers" state={state} products={bestsellers} />

      <section className="section">
        <div className="container">
          <div className="promo">
            <div>
              <h2>Mystery Jars 🫙</h2>
              <p>Pick a theme, colour, size and budget. We pick the surprises. Exact contents stay a secret until you open it!</p>
              <Link to="/mystery-jars" className="btn btn-lavender">Shop Mystery Jars</Link>
            </div>
            <div className="promo-img">
              <img
                src="/images/jar.jpg"
                alt="Mystery jar"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Personalized Gifting</h2>
          <p className="section-sub">Add a name, a note or a memory to make it truly theirs</p>
          <div style={{ textAlign: "center" }}>
            <Link to="/shop?category=personalized-gifts" className="btn">Browse Personalized Gifts</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Sweet Words</h2>
          <p className="section-sub">What our happy gifters say</p>
          <div className="grid">
            {TESTIMONIALS.map((t) => (
              <div className="testimonial" key={t.name}>
                <p>"{t.text}"</p>
                <strong>{t.name}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="newsletter">
            <h2>Join the BlushBox Club</h2>
            <p style={{ color: "var(--brown-light)" }}>Get gift ideas and early access to new mystery jars.</p>
            {subscribed ? (
              <div className="success-box" style={{ maxWidth: 420, margin: "20px auto 0" }}>
                Thanks! (Demo only: your email is not saved.)
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  className="input"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="btn" type="submit">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}