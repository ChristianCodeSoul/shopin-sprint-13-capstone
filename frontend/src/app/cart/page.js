"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
} from "@/store/slices/cartSlice";

export default function CartPage() {
    const dispatch = useDispatch();

    const cartItems = useSelector((state) => state.cart.items);

    const [darkMode, setDarkMode] = useState(false);

    // Load the same theme used by the homepage
    useEffect(() => {
        const savedTheme = localStorage.getItem("shopin-theme");

        if (savedTheme === "dark") {
            setDarkMode(true);
        }
    }, []);

    // Keep cart page synced with the saved theme
    useEffect(() => {
        const handleStorageChange = () => {
            const savedTheme = localStorage.getItem("shopin-theme");
            setDarkMode(savedTheme === "dark");
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shipping = subtotal > 0 ? 0 : 0;
    const total = subtotal + shipping;

    return (
        <main
            className={`min-h-screen px-4 py-10 transition-colors duration-300 ${
                darkMode
                    ? "bg-slate-950 text-white"
                    : "bg-slate-50 text-slate-900"
            }`}
        >
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p
                            className={`text-sm font-semibold uppercase tracking-wider ${
                                darkMode
                                    ? "text-pink-400"
                                    : "text-pink-500"
                            }`}
                        >
                            ShopIn
                        </p>

                        <h1 className="mt-1 text-3xl font-bold">
                            Your Cart
                        </h1>
                    </div>

                    <Link
                        href="/"
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                            darkMode
                                ? "border-slate-700 bg-slate-900 text-white hover:border-pink-400 hover:text-pink-400"
                                : "border-slate-200 bg-white hover:border-pink-500 hover:text-pink-500"
                        }`}
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Empty Cart */}
                {cartItems.length === 0 ? (
                    <div
                        className={`rounded-3xl border p-12 text-center shadow-sm transition-colors duration-300 ${
                            darkMode
                                ? "border-slate-800 bg-slate-900"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        <div
                            className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-2xl ${
                                darkMode
                                    ? "bg-pink-950/40"
                                    : "bg-pink-50"
                            }`}
                        >
                            🛒
                        </div>

                        <h2 className="text-2xl font-bold">
                            Your cart is empty
                        </h2>

                        <p
                            className={`mt-2 ${
                                darkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                            }`}
                        >
                            Add some products and they will appear here.
                        </p>

                        <Link
                            href="/"
                            className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-pink-500"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

                        {/* Cart Items */}
                        <section className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.productId}
                                    className={`flex flex-col gap-5 rounded-2xl border p-5 shadow-sm transition-colors duration-300 sm:flex-row sm:items-center ${
                                        darkMode
                                            ? "border-slate-800 bg-slate-900"
                                            : "border-slate-200 bg-white"
                                    }`}
                                >
                                    {/* Product Image */}
                                    <div
                                        className={`flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl ${
                                            darkMode
                                                ? "bg-slate-800"
                                                : "bg-slate-100"
                                        }`}
                                    >
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span
                                                className={`text-sm ${
                                                    darkMode
                                                        ? "text-slate-500"
                                                        : "text-slate-400"
                                                }`}
                                            >
                                                No image
                                            </span>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="min-w-0 flex-1">
                                        <h2 className="truncate text-lg font-bold">
                                            {item.title}
                                        </h2>

                                        <p
                                            className={`mt-1 text-sm ${
                                                darkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            ₹{Number(item.price).toFixed(2)} each
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="mt-4 flex flex-wrap items-center gap-3">
                                            <div
                                                className={`flex items-center rounded-xl border ${
                                                    darkMode
                                                        ? "border-slate-700 bg-slate-800"
                                                        : "border-slate-200"
                                                }`}
                                            >
                                                <button
                                                    onClick={() =>
                                                        dispatch(
                                                            decreaseQuantity(
                                                                item.productId
                                                            )
                                                        )
                                                    }
                                                    className={`px-3 py-2 font-bold transition ${
                                                        darkMode
                                                            ? "hover:text-pink-400"
                                                            : "hover:text-pink-500"
                                                    }`}
                                                >
                                                    −
                                                </button>

                                                <span className="min-w-10 text-center text-sm font-semibold">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        dispatch(
                                                            increaseQuantity(
                                                                item.productId
                                                            )
                                                        )
                                                    }
                                                    className={`px-3 py-2 font-bold transition ${
                                                        darkMode
                                                            ? "hover:text-pink-400"
                                                            : "hover:text-pink-500"
                                                    }`}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    dispatch(
                                                        removeFromCart(
                                                            item.productId
                                                        )
                                                    )
                                                }
                                                className="text-sm font-semibold text-red-500 transition hover:text-red-400"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Item Total */}
                                    <p className="text-lg font-bold">
                                        ₹
                                        {(
                                            item.price * item.quantity
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            ))}

                            {/* Clear Cart */}
                            <button
                                onClick={() => dispatch(clearCart())}
                                className="text-sm font-semibold text-red-500 transition hover:text-red-400"
                            >
                                Clear Cart
                            </button>
                        </section>

                        {/* Order Summary */}
                        <aside
                            className={`h-fit rounded-2xl border p-6 shadow-sm transition-colors duration-300 ${
                                darkMode
                                    ? "border-slate-800 bg-slate-900"
                                    : "border-slate-200 bg-white"
                            }`}
                        >
                            <h2 className="text-xl font-bold">
                                Order Summary
                            </h2>

                            <div className="mt-6 space-y-4 text-sm">

                                {/* Subtotal */}
                                <div className="flex justify-between">
                                    <span
                                        className={
                                            darkMode
                                                ? "text-slate-400"
                                                : "text-slate-500"
                                        }
                                    >
                                        Subtotal
                                    </span>

                                    <span className="font-semibold">
                                        ₹{subtotal.toFixed(2)}
                                    </span>
                                </div>

                                {/* Shipping */}
                                <div className="flex justify-between">
                                    <span
                                        className={
                                            darkMode
                                                ? "text-slate-400"
                                                : "text-slate-500"
                                        }
                                    >
                                        Shipping
                                    </span>

                                    <span className="font-semibold text-green-500">
                                        Free
                                    </span>
                                </div>

                                {/* Total */}
                                <div
                                    className={`border-t pt-4 ${
                                        darkMode
                                            ? "border-slate-700"
                                            : "border-slate-200"
                                    }`}
                                >
                                    <div className="flex justify-between text-lg">
                                        <span className="font-bold">
                                            Total
                                        </span>

                                        <span className="font-bold">
                                            ₹{total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout */}
                            <Link
                                href="/checkout"
                                className="mt-6 block rounded-xl bg-slate-900 px-5 py-3 text-center font-semibold text-white transition hover:bg-pink-500"
                            >
                                Proceed to Checkout
                            </Link>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}