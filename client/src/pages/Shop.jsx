import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

// Response kisi bhi shape mein aaye, array nikaal lo
const toArray = (res) => {
  if (Array.isArray(res)) return res;
  if (!res || typeof res !== "object") return [];
  const keys = ["products", "categories", "data", "items", "results"];
  for (const k of keys) if (Array.isArray(res[k])) return res[k];
  for (const v of Object.values(res)) if (Array.isArray(v)) return v;
  return [];
};

const LIMIT = 12;

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [categories, setCategories] = useState([]);
  const [colours, setColours] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchText, setSearchText] = useState(params.get("search") || "");
  const [minP, setMinP] = useState(params.get("minPrice") || "");
  const [maxP, setMaxP] = useState(params.get("maxPrice") || "");

  const query = params.toString();
  const page = Number(params.get("page") || 1);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === "" || value === null || value === undefined) next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page");
    setParams(next);
  };

  // Filter options (ek baar)
  useEffect(() => {
    api.getCategories().then((r) => setCategories(toArray(r))).catch(() => {});
    api
      .getFilterOptions()
      .then((r) => {
        const o = r?.data || r?.options || r || {};
        setColours(o.colours || o.colors || []);
        setOccasions(o.occasions || []);
      })
      .catch(() => {});
  }, []);

  // Products fetch (jab bhi URL badle)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    api
      .getProducts(`${query ? query + "&" : ""}limit=${LIMIT}`)
      .then((res) => {
        if (cancelled) return;
        setProducts(toArray(res));
        const total = res?.total ?? res?.count ?? res?.totalProducts ?? 0;
        const pages = res?.pages ?? res?.totalPages ?? Math.max(1, Math.ceil(total / LIMIT));
        setMeta({ total, pages });
      })
      .catch((err) => !cancelled && setError(err.message || "Something went wrong."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [query]);

  // Search debounce
  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get("search") || "") !== searchText.trim()) setParam("search", searchText.trim());
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  // URL badle (jaise Clear all) toh inputs sync karo
  useEffect(() => {
    setSearchText(params.get("search") || "");
    setMinP(params.get("minPrice") || "");
    setMaxP(params.get("maxPrice") || "");
  }, [params]);

  const applyPrice = () => {
    const next = new URLSearchParams(params);
    minP ? next.set("minPrice", minP) : next.delete("minPrice");
    maxP ? next.set("maxPrice", maxP) : next.delete("maxPrice");
    next.delete("page");
    setParams(next);
  };

  const filterKeys = ["search", "category", "minPrice", "maxPrice", "colour", "occasion", "availability"];
  const activeCount = filterKeys.filter((k) => params.get(k)).length;
  const clearAll = () => setParams(new URLSearchParams());

  return (
    <div className="container shop-page">
      <div className="shop-head">
        <h1>Shop Gifts</h1>
        <p>{loading ? "Loading..." : `${meta.total || products.length} gifts found`}</p>
      </div>

      <div className="shop-layout">
        <aside className="shop-filters">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search gifts..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select value={params.get("category") || ""} onChange={(e) => setParam("category", e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c._id || c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price (₹)</label>
            <div className="price-row">
              <input type="number" min="0" placeholder="Min" value={minP} onChange={(e) => setMinP(e.target.value)} />
              <input type="number" min="0" placeholder="Max" value={maxP} onChange={(e) => setMaxP(e.target.value)} />
            </div>
            <button type="button" className="btn-small" onClick={applyPrice}>
              Apply price
            </button>
          </div>

          {colours.length > 0 && (
            <div className="filter-group">
              <label>Colour</label>
              <select value={params.get("colour") || ""} onChange={(e) => setParam("colour", e.target.value)}>
                <option value="">All colours</option>
                {colours.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {occasions.length > 0 && (
            <div className="filter-group">
              <label>Occasion</label>
              <select value={params.get("occasion") || ""} onChange={(e) => setParam("occasion", e.target.value)}>
                <option value="">All occasions</option>
                {occasions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="filter-group check">
            <label>
              <input
                type="checkbox"
                checked={params.get("availability") === "in-stock"}
                onChange={(e) => setParam("availability", e.target.checked ? "in-stock" : "")}
              />
              In stock only
            </label>
          </div>

          <button type="button" className="btn-clear" onClick={clearAll} disabled={activeCount === 0}>
            Clear all {activeCount > 0 && `(${activeCount})`}
          </button>
        </aside>

        <section className="shop-results">
          <div className="shop-toolbar">
            <span>Sort by</span>
            <select value={params.get("sort") || ""} onChange={(e) => setParam("sort", e.target.value)}>
              <option value="">Default</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>

          {loading && <div className="state-box">Loading gifts...</div>}

          {!loading && error && (
            <div className="state-box error">
              <p>{error}</p>
              <button type="button" className="btn-small" onClick={() => setParams(new URLSearchParams(params))}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="state-box">
              <p>No gifts match your filters.</p>
              <button type="button" className="btn-small" onClick={clearAll}>
                Clear all filters
              </button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="shop-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {!loading && !error && meta.pages > 1 && (
            <div className="pagination">
              <button type="button" className="btn-small" disabled={page <= 1} onClick={() => setParam("page", page - 1)}>
                Previous
              </button>
              <span>
                Page {page} of {meta.pages}
              </span>
              <button
                type="button"
                className="btn-small"
                disabled={page >= meta.pages}
                onClick={() => setParam("page", page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}