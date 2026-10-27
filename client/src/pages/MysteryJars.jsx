import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";

const BUDGETS = [
  { label: "Any budget", max: Infinity },
  { label: "Under ₹299", max: 299 },
  { label: "Under ₹499", max: 499 },
  { label: "Under ₹999", max: 999 },
];

const unique = (list) => [...new Set(list.filter(Boolean))];

export default function MysteryJars() {
  const { addToCart } = useCart();
  const [jars, setJars] = useState(null);
  const [error, setError] = useState("");
  const [jarType, setJarType] = useState("");
  const [colour, setColour] = useState("");
  const [size, setSize] = useState("");
  const [budget, setBudget] = useState(0);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    api
      .getProducts("mystery=true&limit=100")
      .then((d) => {
        const list = d.products || d.data || [];
        setJars(list.filter((p) => p.isMysteryJar !== false));
      })
      .catch((e) => setError(e.message || "Could not load jars."));
  }, []);

  const types = useMemo(() => unique((jars || []).map((j) => j.jarType)), [jars]);
  const colours = useMemo(() => unique((jars || []).map((j) => j.colour)), [jars]);
  const sizes = useMemo(() => unique((jars || []).map((j) => j.jarSize)), [jars]);

  const visible = useMemo(() => {
    return (jars || []).filter(
      (j) =>
        (!jarType || j.jarType === jarType) &&
        (!colour || j.colour === colour) &&
        (!size || j.jarSize === size) &&
        j.price <= BUDGETS[budget].max
    );
  }, [jars, jarType, colour, size, budget]);

  const setNote = (id, text) => {
    setNotes((n) => ({ ...n, [id]: text }));
    setTimeout(() => setNotes((n) => ({ ...n, [id]: "" })), 3000);
  };

  const add = async (jar) => {
    try {
      await addToCart(jar._id, 1);
      setNote(jar._id, "Added to cart ✓");
    } catch (err) {
      setNote(jar._id, err.message || "Could not add.");
    }
  };

  const reset = () => {
    setJarType("");
    setColour("");
    setSize("");
    setBudget(0);
  };

  return (
    <div className="container jars-page">
      <section className="jars-hero">
        <h1>Mystery Jars</h1>
        <p>
          Pick a jar by type, colour, size and budget. We pack a surprise
          selection of gifts inside, and the contents stay a secret until you open it.
        </p>
      </section>

      <div className="jars-filters">
        <label>Jar type
          <select value={jarType} onChange={(e) => setJarType(e.target.value)}>
            <option value="">All types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label>Colour
          <select value={colour} onChange={(e) => setColour(e.target.value)}>
            <option value="">All colours</option>
            {colours.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>Size
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">All sizes</option>
            {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>Budget
          <select value={budget} onChange={(e) => setBudget(Number(e.target.value))}>
            {BUDGETS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
          </select>
        </label>
        <button type="button" className="btn-outline" onClick={reset}>Reset</button>
      </div>

      {error && <div className="state-box error">{error}</div>}
      {!error && !jars && <div className="state-box">Loading jars...</div>}

      {jars && visible.length === 0 && !error && (
        <div className="state-box">
          <p>No jars match these filters.</p>
          <button type="button" className="btn-small" onClick={reset}>Clear filters</button>
        </div>
      )}

      <div className="jars-grid">
        {visible.map((j) => {
          const inStock = j.stock > 0;
          return (
            <div className="jar-card" key={j._id}>
              <Link to={`/product/${j.slug || j._id}`}>
                <img src={j.images?.[0] || "/images/jar.jpg"} alt={j.name} />
              </Link>
              <div className="jar-body">
                <h3>{j.name}</h3>
                <div className="jar-tags">
                  {j.jarType && <span>{j.jarType}</span>}
                  {j.jarSize && <span>{j.jarSize}</span>}
                  {j.colour && <span>{j.colour}</span>}
                </div>
                <p className="jar-items">
                  About {j.approxItems || "several"} items · contents are a surprise 🎁
                </p>
                <div className="jar-price">₹{j.price}</div>
                <div className="jar-actions">
                  {inStock ? (
                    <button type="button" className="btn-primary" onClick={() => add(j)}>Add to Cart</button>
                  ) : (
                    <Link to={`/product/${j.slug || j._id}`} className="btn-outline">Out of stock · Remind me</Link>
                  )}
                </div>
                {notes[j._id] && <p className="jar-note">{notes[j._id]}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}