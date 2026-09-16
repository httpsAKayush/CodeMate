"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { getToken, setAuthData } from "@/lib/auth";

const emailRegex = /^\S+@\S+\.\S+$/;

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const data = await authApi.register(formData);
      setAuthData({ token: data.token, user: data.user });
      setSuccess("Registration successful. Redirecting to dashboard...");
      setTimeout(() => router.push("/dashboard"), 1000);
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
              Create an account
            </h1>
            <p
              style={{
                marginTop: "8px",
                fontSize: "14px",
                color: "#88888F",
                letterSpacing: "-0.01em"
              }}
            >
              Register to start matching with peers.
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
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                onFocus={() => setFocusField("name")}
                onBlur={() => setFocusField("")}
                style={inputStyle("name")}
                placeholder="Your name"
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
                placeholder="Minimum 6 characters"
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

          {success ? (
            <div
              style={{
                marginTop: "20px",
                fontSize: "13px",
                color: "#10B981",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.16)",
                borderRadius: "8px",
                padding: "12px",
                lineHeight: "1.4"
              }}
            >
              {success}
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
            {loading ? "Creating..." : "Register"}
          </button>

          <p
            style={{
              marginTop: "32px",
              textAlign: "center",
              fontSize: "13px",
              color: "#88888F"
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                fontWeight: "500",
                color: "#ffffff",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                transition: "color 0.15s ease"
              }}
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
