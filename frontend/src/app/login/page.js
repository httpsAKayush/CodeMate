"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { getToken, setAuthData } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Premium UI Interactive States
  const [focusField, setFocusField] = useState("");
  const [btnHover, setBtnHover] = useState(false);
  const [btnActive, setBtnActive] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const data = await authApi.login(formData);
      setAuthData({ token: data.token, user: data.user });
      router.replace("/dashboard");
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (fieldName) => ({
    width: "100%",
    background: "#050506",
    border: focusField === fieldName 
      ? "1px solid rgba(255, 255, 255, 0.24)" 
      : "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
    padding: "12px 14px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.15s ease",
    boxShadow: focusField === fieldName 
      ? "0 0 0 2px rgba(255, 255, 255, 0.04)" 
      : "none"
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#080909",
        padding: "24px",
        fontFamily: "var(--font-geist-sans), -apple-system, sans-serif"
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <form
          onSubmit={onSubmit}
          style={{
            width: "100%",
            background: "#0C0C0E",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.8)",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: "1.2"
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                marginTop: "8px",
                fontSize: "14px",
                color: "#88888F",
                letterSpacing: "-0.01em"
              }}
            >
              Log in to your codeMate account.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#A1A1AA",
                  marginBottom: "8px"
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                onFocus={() => setFocusField("email")}
                onBlur={() => setFocusField("")}
                style={inputStyle("email")}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#A1A1AA",
                  marginBottom: "8px"
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                onFocus={() => setFocusField("password")}
                onBlur={() => setFocusField("")}
                style={inputStyle("password")}
                placeholder="Enter password"
              />
            </div>
          </div>

          {error ? (
            <div
              style={{
                marginTop: "20px",
                fontSize: "13px",
                color: "#EF4444",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.16)",
                borderRadius: "8px",
                padding: "12px",
                lineHeight: "1.4"
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => {
              setBtnHover(false);
              setBtnActive(false);
            }}
            onMouseDown={() => setBtnActive(true)}
            onMouseUp={() => setBtnActive(false)}
            style={{
              marginTop: "32px",
              width: "100%",
              background: btnHover ? "#e4e4e7" : "#ffffff",
              color: "#000000",
              fontWeight: "500",
              fontSize: "14px",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: btnActive ? "scale(0.98)" : "scale(1)",
              opacity: loading ? 0.6 : 1,
              pointerEvents: loading ? "none" : "auto"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p
            style={{
              marginTop: "32px",
              textAlign: "center",
              fontSize: "13px",
              color: "#88888F"
            }}
          >
            New here?{" "}
            <Link
              href="/register"
              style={{
                fontWeight: "500",
                color: "#ffffff",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                transition: "color 0.15s ease"
              }}
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
