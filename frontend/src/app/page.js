"use client";

import { useEffect, useState } from "react";
import { useGetProductsQuery } from "@/store/api/api";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { loginUser, logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

const heroWords = [
    "SHOP",
    "DISCOVER",
    "EXPLORE",
    "CHOOSE",
    "ENJOY",
];

export default function Home() {
    const dispatch = useDispatch();
    const router = useRouter();

    const cartItems = useSelector((state) => state.cart.items);
    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );
    const user = useSelector((state) => state.auth.user);

    const { data, isLoading, isError } = useGetProductsQuery();

    const [darkMode, setDarkMode] = useState(false);
    const [heroIndex, setHeroIndex] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [authModal, setAuthModal] = useState(null);

    const [loginForm, setLoginForm] = useState({
        username: "",
        password: "",
    });

    const [registerForm, setRegisterForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
    });

    const [authError, setAuthError] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] =
        useState(false);

    const [chatMessage, setChatMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([
        {
            role: "assistant",
            content:
                "Hi! I'm ShopIn AI. Ask me about products, prices, features, or availability.",
        },
    ]);
    const [chatLoading, setChatLoading] = useState(false);

    const [notification, setNotification] = useState(null);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("shopin-theme");

        if (savedTheme === "dark") {
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "shopin-theme",
            darkMode ? "dark" : "light"
        );
    }, [darkMode]);

    useEffect(() => {
        if (!notification) return;

        const timer = setTimeout(() => {
            setNotification(null);
        }, 4500);

        return () => clearTimeout(timer);
    }, [notification]);

    useEffect(() => {
        const interval = setInterval(() => {
            setHeroIndex(
                (current) => (current + 1) % heroWords.length
            );
        }, 2800);

        return () => clearInterval(interval);
    }, []);

    const products =
        data?.data ||
        data?.products ||
        (Array.isArray(data) ? data : []);

    const showNotification = (type, title, message) => {
        setNotification({
            type,
            title,
            message,
        });
    };

    const handleRegister = async () => {
        setAuthError("");

        if (
            !registerForm.firstName ||
            !registerForm.lastName ||
            !registerForm.username ||
            !registerForm.email ||
            !registerForm.password
        ) {
            setAuthError("Please fill in all fields.");
            return;
        }

        if (registerForm.password.length < 8) {
            setAuthError(
                "Password must contain at least 8 characters."
            );
            return;
        }

        setAuthLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            if (!apiUrl) {
                setAuthError(
                    "API configuration is missing. Please restart the frontend server."
                );
                return;
            }

            const response = await fetch(
                `${apiUrl}/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(registerForm),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setAuthError(
                    data.message || "Registration failed."
                );
                return;
            }

            setRegisterForm({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password: "",
            });

            setAuthError("");
            setAuthModal("login");

            showNotification(
                "success",
                "Registration successful",
                "Your ShopIn account has been created. You can now log in and start shopping."
            );
        } catch (error) {
            setAuthError(
                "Unable to connect to the server. Please make sure the backend is running."
            );
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogin = async () => {
        setAuthError("");
        setAuthLoading(true);

        const result = await dispatch(loginUser(loginForm));

        if (loginUser.fulfilled.match(result)) {
            setLoginForm({
                username: "",
                password: "",
            });

            setAuthModal(null);

            showNotification(
                "success",
                "Welcome back",
                "You have successfully logged in to ShopIn."
            );
        } else {
            setAuthError(
                result.payload || "Invalid username or password."
            );
        }

        setAuthLoading(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        setLogoutModalOpen(false);
        setAuthModal(null);

        showNotification(
            "success",
            "Logged out",
            "You have been safely logged out of ShopIn."
        );
    };

    const handleChat = async () => {
        const message = chatMessage.trim();

        if (!message || chatLoading) return;

        const userMessage = {
            role: "user",
            content: message,
        };

        setChatMessages((current) => [...current, userMessage]);
        setChatMessage("");
        setChatLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/ai/chat`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message,
                        products,
                        conversation: chatMessages,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "AI request failed"
                );
            }

            setChatMessages((current) => [
                ...current,
                {
                    role: "assistant",
                    content:
                        data.message ||
                        "Sorry, I couldn't process that request.",
                },
            ]);
        } catch (error) {
            setChatMessages((current) => [
                ...current,
                {
                    role: "assistant",
                    content:
                        "Sorry, ShopIn AI is temporarily unavailable. Please try again.",
                },
            ]);
        } finally {
            setChatLoading(false);
        }
    };

    const openAuthModal = (mode = "login") => {
        setAuthError("");
        setAuthModal(mode);
        setMobileMenuOpen(false);
    };

    const scrollToProducts = () => {
        document
            .getElementById("products")
            ?.scrollIntoView({ behavior: "smooth" });

        setMobileMenuOpen(false);
    };

    const openCart = () => {
        setMobileMenuOpen(false);
        router.push("/cart");
    };

    return (
        <main
            className={`min-h-screen transition-colors duration-300 ${
                darkMode
                    ? "bg-slate-950 text-white"
                    : "bg-[#faf7f8] text-slate-900"
            }`}
        >
            {/* SUCCESS / INFO NOTIFICATION */}
            {notification && (
                <div className="fixed right-5 top-5 z-[200] w-[calc(100%-2.5rem)] max-w-md">
                    <div
                        className={`rounded-2xl border p-5 shadow-2xl backdrop-blur-xl ${
                            darkMode
                                ? "border-white/10 bg-slate-900 text-white"
                                : "border-slate-200 bg-white text-slate-900"
                        }`}
                    >
                        <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
                                ✓
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-bold">
                                            {notification.title}
                                        </h3>

                                        <p
                                            className={`mt-1 text-sm leading-5 ${
                                                darkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {notification.message}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            setNotification(null)
                                        }
                                        className={`text-lg ${
                                            darkMode
                                                ? "text-slate-400 hover:text-white"
                                                : "text-slate-400 hover:text-slate-900"
                                        }`}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* NAVBAR */}
            <nav
                className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
                    darkMode
                        ? "border-white/10 bg-slate-950/85"
                        : "border-slate-200/70 bg-white/85"
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
                    <button
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            })
                        }
                        className="text-2xl font-bold tracking-tight"
                    >
                        ShopIn<span className="text-pink-500">.</span>
                    </button>

                    {/* DESKTOP NAV */}
                    <div className="hidden items-center gap-8 md:flex">
                        <button
                            onClick={scrollToProducts}
                            className="text-sm font-medium transition hover:text-pink-500"
                        >
                            Products
                        </button>

                        <button
                            onClick={() =>
                                document
                                    .getElementById("ai-assistant")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                            className="text-sm font-medium transition hover:text-pink-500"
                        >
                            Assistant
                        </button>

                        <button
                            onClick={openCart}
                            className="relative text-sm font-medium transition hover:text-pink-500"
                        >
                            Cart

                            {cartItems.length > 0 && (
                                <span className="ml-1 rounded-full bg-pink-500 px-2 py-0.5 text-xs text-white">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>

                        {isAuthenticated ? (
                            <button
                                onClick={() =>
                                    openAuthModal("profile")
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-blue-500 text-sm font-bold text-white shadow-md"
                            >
                                {user?.firstName
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    openAuthModal("login")
                                }
                                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600"
                            >
                                Login
                            </button>
                        )}

                        <button
                            onClick={() =>
                                setDarkMode((value) => !value)
                            }
                            className={`rounded-full border px-4 py-2 text-sm transition ${
                                darkMode
                                    ? "border-white/20 hover:bg-white/10"
                                    : "border-slate-300 hover:bg-slate-100"
                            }`}
                        >
                            {darkMode ? "Light" : "Dark"}
                        </button>
                    </div>

                    <button
                        onClick={() =>
                            setMobileMenuOpen((value) => !value)
                        }
                        className={`rounded-lg border px-3 py-2 md:hidden ${
                            darkMode
                                ? "border-white/20"
                                : "border-slate-300"
                        }`}
                    >
                        ☰
                    </button>
                </div>

                {/* MOBILE MENU */}
                {mobileMenuOpen && (
                    <div
                        className={`border-t px-5 py-5 md:hidden ${
                            darkMode
                                ? "border-white/10 bg-slate-950"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={scrollToProducts}
                                className="text-left font-medium"
                            >
                                Products
                            </button>

                            <button
                                onClick={() => {
                                    document
                                        .getElementById("ai-assistant")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });

                                    setMobileMenuOpen(false);
                                }}
                                className="text-left font-medium"
                            >
                                Assistant
                            </button>

                            <button
                                onClick={openCart}
                                className="flex items-center justify-between rounded-xl border px-4 py-3 text-left font-medium"
                            >
                                <span>Cart</span>

                                {cartItems.length > 0 && (
                                    <span className="rounded-full bg-pink-500 px-2 py-0.5 text-xs text-white">
                                        {cartItems.length}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() =>
                                    isAuthenticated
                                        ? openAuthModal("profile")
                                        : openAuthModal("login")
                                }
                                className="rounded-xl bg-slate-900 px-4 py-3 text-left font-semibold text-white"
                            >
                                {isAuthenticated
                                    ? "Profile"
                                    : "Login"}
                            </button>

                            <button
                                onClick={() =>
                                    setDarkMode((value) => !value)
                                }
                                className={`rounded-xl border px-4 py-3 text-left font-medium ${
                                    darkMode
                                        ? "border-white/20"
                                        : "border-slate-300"
                                }`}
                            >
                                {darkMode
                                    ? "Switch to Light Mode"
                                    : "Switch to Dark Mode"}
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* HERO */}
            <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#071a3d] via-[#102b59] to-[#172f55] px-5 py-20 text-center text-white sm:min-h-[580px]">
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl" />

                <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center">
                    <p className="mb-5 text-sm font-medium uppercase tracking-[0.28em] text-slate-300">
                        Shop what you love
                    </p>

                    <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                        Welcome to ShopIn.
                    </h1>

                    <div className="mt-7 min-h-[75px] sm:min-h-[100px]">
                        <span
                            key={heroWords[heroIndex]}
                            className="block bg-gradient-to-r from-pink-300 via-fuchsia-300 to-blue-300 bg-clip-text text-5xl font-extrabold tracking-[0.08em] text-transparent transition-all duration-500 sm:text-7xl lg:text-8xl"
                        >
                            {heroWords[heroIndex]}
                        </span>
                    </div>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                        Find products you need, discover something new,
                        and enjoy a simpler shopping experience.
                    </p>

                    <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <button
                            onClick={scrollToProducts}
                            className="rounded-full bg-white px-7 py-3.5 font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
                        >
                            Explore Products
                        </button>

                        <button
                            onClick={() =>
                                openAuthModal("register")
                            }
                            className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                        >
                            Login to get started
                        </button>
                    </div>
                </div>
            </section>

            {/* PRODUCTS */}
            <section
                id="products"
                className={`mx-auto max-w-7xl px-5 py-20 lg:px-8 ${
                    darkMode
                        ? "text-white"
                        : "text-slate-900"
                }`}
            >
                <div className="mb-10 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                        Shop
                    </p>

                    <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                        Featured Products
                    </h2>

                    <p
                        className={`mx-auto mt-3 max-w-xl ${
                            darkMode
                                ? "text-slate-400"
                                : "text-slate-600"
                        }`}
                    >
                        Browse our current collection and add
                        anything you like to your cart.
                    </p>
                </div>

                {isLoading && (
                    <div
                        className={`py-20 text-center ${
                            darkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                        }`}
                    >
                        Loading products...
                    </div>
                )}

                {isError && (
                    <div className="py-20 text-center text-red-500">
                        Unable to load products.
                    </div>
                )}

                {!isLoading && !isError && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <article
                                key={product._id}
                                className={`overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                    darkMode
                                        ? "border-white/10 bg-slate-900"
                                        : "border-slate-200 bg-white"
                                }`}
                            >
                                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                    />
                                </div>

                                <div className="p-5">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-pink-500">
                                        {product.category}
                                    </p>

                                    <h3 className="text-lg font-bold">
                                        {product.title}
                                    </h3>

                                    <p
                                        className={`mt-2 line-clamp-2 text-sm ${
                                            darkMode
                                                ? "text-slate-400"
                                                : "text-slate-600"
                                        }`}
                                    >
                                        {product.description ||
                                            "A practical product selected for your everyday needs."}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between">
                                        <span className="text-xl font-bold">
                                            ₹
                                            {product.price.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>

                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    addToCart(product)
                                                )
                                            }
                                            className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* AI ASSISTANT */}
            <section
                id="ai-assistant"
                className={`px-5 py-20 ${
                    darkMode
                        ? "bg-slate-900"
                        : "bg-[#f1edf0]"
                }`}
            >
                <div className="mx-auto max-w-5xl">
                    <div className="text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                            Need help?
                        </p>

                        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                            ShopIn AI Assistant
                        </h2>

                        <p
                            className={`mx-auto mt-3 max-w-xl ${
                                darkMode
                                    ? "text-slate-400"
                                    : "text-slate-600"
                            }`}
                        >
                            Ask about products, pricing, features,
                            availability, or recommendations.
                        </p>
                    </div>

                    <div
                        className={`mx-auto mt-8 overflow-hidden rounded-3xl border shadow-xl ${
                            darkMode
                                ? "border-white/10 bg-slate-950"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        <div className="flex items-center justify-between border-b px-5 py-4">
                            <div>
                                <p className="font-bold">
                                    ShopIn AI
                                </p>
                                <p
                                    className={`text-xs ${
                                        darkMode
                                            ? "text-slate-500"
                                            : "text-slate-500"
                                    }`}
                                >
                                    Product assistant
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                <span className="text-xs text-slate-500">
                                    Online
                                </span>
                            </div>
                        </div>

                        <div className="h-[420px] space-y-4 overflow-y-auto p-5">
                            {chatMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        message.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                                            message.role === "user"
                                                ? "rounded-br-md bg-slate-900 text-white"
                                                : darkMode
                                                  ? "rounded-bl-md bg-slate-800 text-slate-200"
                                                  : "rounded-bl-md bg-slate-100 text-slate-700"
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}

                            {chatLoading && (
                                <div className="flex justify-start">
                                    <div
                                        className={`rounded-2xl rounded-bl-md px-4 py-3 text-sm ${
                                            darkMode
                                                ? "bg-slate-800 text-slate-300"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        ShopIn AI is typing...
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t p-4">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={chatMessage}
                                    onChange={(event) =>
                                        setChatMessage(
                                            event.target.value
                                        )
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter"
                                        ) {
                                            handleChat();
                                        }
                                    }}
                                    placeholder="Ask about a product..."
                                    className={`min-w-0 flex-1 rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                        darkMode
                                            ? "border-white/10 bg-slate-900 text-white placeholder:text-slate-500"
                                            : "border-slate-200 bg-white text-slate-900"
                                    }`}
                                />

                                <button
                                    onClick={handleChat}
                                    disabled={
                                        chatLoading ||
                                        !chatMessage.trim()
                                    }
                                    className="rounded-xl bg-slate-900 px-6 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {chatLoading ? "..." : "Ask"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CONTACT LINKS */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <a
                            href="https://wa.me/15551234567"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                                darkMode
                                    ? "border-white/10 bg-slate-900 text-slate-200 hover:border-green-500 hover:text-green-400"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-green-500 hover:text-green-600"
                            }`}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="h-5 w-5"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M20.5 3.5A11.8 11.8 0 0 0 12.08 0C5.55 0 .24 5.31.24 11.84c0 2.09.55 4.13 1.59 5.93L.13 24l6.37-1.67a11.82 11.82 0 0 0 5.57 1.41h.01c6.52 0 11.83-5.31 11.83-11.84 0-3.17-1.23-6.14-3.41-8.4ZM12.08 21.7h-.01a9.8 9.8 0 0 1-5-1.36l-.36-.21-3.78.99 1.01-3.69-.23-.38a9.82 9.82 0 1 1 8.37 4.65Zm5.39-7.35c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                            </svg>
                            WhatsApp
                        </a>

                        <a
                            href="https://www.linkedin.com/company/example/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                                darkMode
                                    ? "border-white/10 bg-slate-900 text-slate-200 hover:border-blue-500 hover:text-blue-400"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600"
                            }`}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="h-5 w-5"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM3.54 20.45H7.1V8.99H3.54v11.46ZM22.22 0H1.78C.8 0 .01.77.01 1.73v20.54C.01 23.23.8 24 1.78 24h20.44c.98 0 1.77-.77 1.77-1.73V1.73C23.99.77 23.2 0 22.22 0Z" />
                            </svg>
                            LinkedIn
                        </a>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer
                className={`border-t px-5 py-8 text-center text-sm ${
                    darkMode
                        ? "border-white/10 bg-slate-950 text-slate-400"
                        : "border-slate-200 bg-white text-slate-500"
                }`}
            >
                <p>
                    © {new Date().getFullYear()} ShopIn. Built
                    for a simpler shopping experience.
                </p>
            </footer>

            {/* AUTH MODAL */}
            {authModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-5 backdrop-blur-sm"
                    onClick={() => setAuthModal(null)}
                >
                    <div
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        className={`relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl p-7 shadow-2xl ${
                            darkMode
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-900"
                        }`}
                    >
                        <button
                            onClick={() => setAuthModal(null)}
                            className={`absolute right-5 top-5 text-xl ${
                                darkMode
                                    ? "text-slate-400 hover:text-white"
                                    : "text-slate-400 hover:text-slate-900"
                            }`}
                        >
                            ×
                        </button>

                        {/* LOGIN */}
                        {authModal === "login" && (
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Welcome back
                                </h2>

                                <p
                                    className={`mt-2 text-sm ${
                                        darkMode
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                    }`}
                                >
                                    Login to continue shopping.
                                </p>

                                <div className="mt-6 space-y-4">
                                    <input
                                        placeholder="Username"
                                        value={loginForm.username}
                                        onChange={(event) =>
                                            setLoginForm({
                                                ...loginForm,
                                                username:
                                                    event.target.value,
                                            })
                                        }
                                        className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                            darkMode
                                                ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                                                : "border-slate-200 bg-white text-slate-900"
                                        }`}
                                    />

                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={loginForm.password}
                                        onChange={(event) =>
                                            setLoginForm({
                                                ...loginForm,
                                                password:
                                                    event.target.value,
                                            })
                                        }
                                        className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                            darkMode
                                                ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                                                : "border-slate-200 bg-white text-slate-900"
                                        }`}
                                    />

                                    {authError && (
                                        <p className="text-sm text-red-500">
                                            {authError}
                                        </p>
                                    )}

                                    <button
                                        onClick={handleLogin}
                                        disabled={authLoading}
                                        className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:opacity-60"
                                    >
                                        {authLoading
                                            ? "Logging in..."
                                            : "Login"}
                                    </button>
                                </div>

                                <button
                                    onClick={() =>
                                        setAuthModal("register")
                                    }
                                    className="mt-5 text-sm font-medium text-pink-500 hover:underline"
                                >
                                    Don't have an account? Create one
                                </button>
                            </div>
                        )}

                        {/* REGISTER */}
                        {authModal === "register" && (
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Create your account
                                </h2>

                                <p
                                    className={`mt-2 text-sm ${
                                        darkMode
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                    }`}
                                >
                                    Join ShopIn and start shopping.
                                </p>

                                <div className="mt-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            placeholder="First name"
                                            value={
                                                registerForm.firstName
                                            }
                                            onChange={(event) =>
                                                setRegisterForm({
                                                    ...registerForm,
                                                    firstName:
                                                        event.target.value,
                                                })
                                            }
                                            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                                darkMode
                                                    ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                                                    : "border-slate-200 bg-white text-slate-900"
                                            }`}
                                        />

                                        <input
                                            placeholder="Last name"
                                            value={
                                                registerForm.lastName
                                            }
                                            onChange={(event) =>
                                                setRegisterForm({
                                                    ...registerForm,
                                                    lastName:
                                                        event.target.value,
                                                })
                                            }
                                            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                                darkMode
                                                    ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                                                    : "border-slate-200 bg-white text-slate-900"
                                            }`}
                                        />
                                    </div>

                                    <input
                                        placeholder="Username"
                                        value={registerForm.username}
                                        onChange={(event) =>
                                            setRegisterForm({
                                                ...registerForm,
                                                username:
                                                    event.target.value,
                                            })
                                        }
                                        className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                            darkMode
                                                ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                                                : "border-slate-200 bg-white text-slate-900"
                                        }`}
                                    />

                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        value={registerForm.email}
                                        onChange={(event) =>
                                            setRegisterForm({
                                                ...registerForm,
                                                email: event.target.value,
                                            })
                                        }
                                        className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                            darkMode
                                                ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                                                : "border-slate-200 bg-white text-slate-900"
                                        }`}
                                    />

                                    <div className="relative">
                                        <input
                                            type={
                                                showRegisterPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Password"
                                            value={
                                                registerForm.password
                                            }
                                            onChange={(event) =>
                                                setRegisterForm({
                                                    ...registerForm,
                                                    password:
                                                        event.target.value,
                                                })
                                            }
                                            className={`w-full rounded-xl border px-4 py-3 pr-20 outline-none focus:border-pink-400 ${
                                                darkMode
                                                    ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                                                    : "border-slate-200 bg-white text-slate-900"
                                            }`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowRegisterPassword(
                                                    (value) => !value
                                                )
                                            }
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm ${
                                                darkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {showRegisterPassword
                                                ? "Hide"
                                                : "Show"}
                                        </button>
                                    </div>

                                    <div
                                        className={`rounded-xl p-4 text-xs ${
                                            darkMode
                                                ? "bg-slate-800 text-slate-400"
                                                : "bg-slate-50 text-slate-500"
                                        }`}
                                    >
                                        <p
                                            className={`font-semibold ${
                                                darkMode
                                                    ? "text-slate-200"
                                                    : "text-slate-700"
                                            }`}
                                        >
                                            Password requirements
                                        </p>

                                        <p className="mt-1">
                                            At least 8 characters
                                        </p>
                                        <p>
                                            Use a combination of
                                            letters and numbers
                                        </p>
                                    </div>

                                    {authError && (
                                        <p className="text-sm text-red-500">
                                            {authError}
                                        </p>
                                    )}

                                    <button
                                        onClick={handleRegister}
                                        disabled={authLoading}
                                        className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:opacity-60"
                                    >
                                        {authLoading
                                            ? "Creating Account..."
                                            : "Create Account"}
                                    </button>
                                </div>

                                <button
                                    onClick={() =>
                                        setAuthModal("login")
                                    }
                                    className="mt-5 text-sm font-medium text-pink-500 hover:underline"
                                >
                                    Already have an account? Login
                                </button>
                            </div>
                        )}

                        {/* PROFILE */}
                        {authModal === "profile" && (
                            <div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-blue-500 text-xl font-bold text-white">
                                        {user?.firstName
                                            ?.charAt(0)
                                            ?.toUpperCase() ||
                                            "U"}
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {user?.firstName ||
                                                "Your"}{" "}
                                            {user?.lastName ||
                                                "Profile"}
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            @
                                            {user?.username ||
                                                "username"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                                    <div
                                        className={`rounded-2xl border p-5 shadow-sm ${
                                            darkMode
                                                ? "border-white/10 bg-slate-800"
                                                : "border-slate-200 bg-white"
                                        }`}
                                    >
                                        <p className="text-sm font-semibold text-slate-500">
                                            Profile Details
                                        </p>

                                        <p className="mt-2 break-words text-lg font-bold">
                                            {user?.email ||
                                                "No email available"}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            @
                                            {user?.username ||
                                                "username"}
                                        </p>
                                    </div>

                                    <div
                                        className={`rounded-2xl border p-5 shadow-sm ${
                                            darkMode
                                                ? "border-white/10 bg-slate-800"
                                                : "border-slate-200 bg-white"
                                        }`}
                                    >
                                        <p className="text-sm font-semibold text-slate-500">
                                            Cart History
                                        </p>

                                        <p className="mt-2 text-lg font-bold">
                                            {cartItems.length} item
                                            {cartItems.length ===
                                            1
                                                ? ""
                                                : "s"}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Current shopping cart
                                        </p>
                                    </div>

                                    <div
                                        className={`rounded-2xl border p-5 shadow-sm ${
                                            darkMode
                                                ? "border-white/10 bg-slate-800"
                                                : "border-slate-200 bg-white"
                                        }`}
                                    >
                                        <p className="text-sm font-semibold text-slate-500">
                                            Payment History
                                        </p>

                                        <p className="mt-2 text-lg font-bold">
                                            No payments yet
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Payment records will
                                            appear here.
                                        </p>
                                    </div>

                                    <div
                                        className={`rounded-2xl border p-5 shadow-sm ${
                                            darkMode
                                                ? "border-white/10 bg-slate-800"
                                                : "border-slate-200 bg-white"
                                        }`}
                                    >
                                        <p className="text-sm font-semibold text-slate-500">
                                            Receipts
                                        </p>

                                        <p className="mt-2 text-lg font-bold">
                                            No receipts yet
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Your purchase receipts
                                            will appear here.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        setLogoutModalOpen(true)
                                    }
                                    className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* LOGOUT CONFIRMATION */}
            {logoutModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/60 px-5 backdrop-blur-sm">
                    <div
                        className={`w-full max-w-sm rounded-3xl p-7 shadow-2xl ${
                            darkMode
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-900"
                        }`}
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
                            !
                        </div>

                        <h2 className="mt-5 text-2xl font-bold">
                            Confirm Logout
                        </h2>

                        <p
                            className={`mt-2 text-sm leading-6 ${
                                darkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                            }`}
                        >
                            Are you sure you want to log out of
                            your ShopIn account?
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() =>
                                    setLogoutModalOpen(false)
                                }
                                className={`flex-1 rounded-xl border px-4 py-3 font-semibold ${
                                    darkMode
                                        ? "border-white/10 hover:bg-white/5"
                                        : "border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}