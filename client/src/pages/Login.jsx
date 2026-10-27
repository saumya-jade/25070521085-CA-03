import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from?.pathname || "/";

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (user) return <Navigate to="/" replace />;

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.email || !form.password) return setError("Enter email and password");

        setLoading(true);
        try {
            await login(form.email.trim(), form.password);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page auth-login">
            <form className="auth-card" onSubmit={onSubmit}>
                <h1 className="logo">Blush<span>Box</span></h1>
                <h2>Welcome back</h2>
                <p className="auth-sub">Login to continue</p>   

                {error && <div className="error-box">{error}</div>}

                <label>Email</label>
                <input className="input" type="email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" />

                <label>Password</label>
                <input className="input" type="password" name="password" value={form.password} onChange={onChange} placeholder="Your password" />

                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="auth-foot">
                    New here? <Link to="/signup">Create an account</Link>
                </p>
            </form>
        </div>
    );
}