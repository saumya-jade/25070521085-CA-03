import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.name.trim().length < 2) return setError("Name must be at least 2 characters");
        if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email");
        if (form.password.length < 6) return setError("Password must be at least 6 characters");
        if (form.password !== form.confirm) return setError("Passwords do not match");

        setLoading(true);
        try {
            await register(form.name.trim(), form.email.trim(), form.password);
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page auth-signup">
            <form className="auth-card" onSubmit={onSubmit}>
                <h1 className="logo">Blush<span>Box</span></h1>
                <h2>Create your account</h2>
                <p className="auth-sub">Join BlushBox and start gifting</p>

                {error && <div className="error-box">{error}</div>}

                <label>Full name</label>
                <input className="input" name="name" value={form.name} onChange={onChange} placeholder="Your name" />

                <label>Email</label>
                <input className="input" type="email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" />

                <label>Password</label>
                <input className="input" type="password" name="password" value={form.password} onChange={onChange} placeholder="At least 6 characters" />

                <label>Confirm password</label>
                <input className="input" type="password" name="confirm" value={form.confirm} onChange={onChange} placeholder="Re-enter password" />

                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </button>

                <p className="auth-foot">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}