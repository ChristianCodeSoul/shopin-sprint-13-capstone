"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGetOrdersQuery } from "@/store/api/api";

export default function OrdersPage() {
    const { data, isLoading, isError, error } = useGetOrdersQuery();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("shopin-theme");
        setDarkMode(savedTheme === "dark");
    }, []);

    const orders = data?.data || [];

    if (isLoading) {
        return (
            <main
                className={`min-h-screen px-4 py-10 ${
                    darkMode
                        ? "bg-slate-950 text-white"
                        : "bg-slate-50 text-slate-900"
                }`}
            >
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-wider text-pink-500">
                            ShopIn
                        </p>
                        <h1 className="mt-1 text-3xl font-bold">
                            Your Orders
                        </h1>
                    </div>

                    <div
                        className={`rounded-2xl border p-10 text-center ${
                            darkMode
                                ? "border-slate-800 bg-slate-900"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        <p className="font-semibold">Loading your orders...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main
                className={`min-h-screen px-4 py-10 ${
                    darkMode
                        ? "bg-slate-950 text-white"
                        : "bg-slate-50 text-slate-900"
                }`}
            >
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-pink-500">
                                ShopIn
                            </p>
                            <h1 className="mt-1 text-3xl font-bold">
                                Your Orders
                            </h1>
                        </div>

                        <Link
                            href="/"
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                                darkMode
                                    ? "border-slate-700 bg-slate-900 hover:border-pink-400 hover:text-pink-400"
                                    : "border-slate-200 bg-white hover:border-pink-500 hover:text-pink-500"
                            }`}
                        >
                            Back to Shop
                        </Link>
                    </div>

                    <div
                        className={`rounded-2xl border p-10 text-center ${
                            darkMode
                                ? "border-red-900/50 bg-slate-900"
                                : "border-red-200 bg-white"
                        }`}
                    >
                        <h2 className="text-xl font-bold text-red-500">
                            Unable to load orders
                        </h2>

                        <p
                            className={`mt-2 text-sm ${
                                darkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                            }`}
                        >
                            Please make sure you are logged in and try again.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

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
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-pink-500">
                            ShopIn
                        </p>

                        <h1 className="mt-1 text-3xl font-bold">
                            Your Orders
                        </h1>

                        <p
                            className={`mt-2 text-sm ${
                                darkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                            }`}
                        >
                            View your recent purchases and order details.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/cart"
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                                darkMode
                                    ? "border-slate-700 bg-slate-900 hover:border-pink-400 hover:text-pink-400"
                                    : "border-slate-200 bg-white hover:border-pink-500 hover:text-pink-500"
                            }`}
                        >
                            Cart
                        </Link>

                        <Link
                            href="/"
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-500"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* No Orders */}
                {orders.length === 0 ? (
                    <div
                        className={`rounded-3xl border p-12 text-center shadow-sm ${
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
                            📦
                        </div>

                        <h2 className="text-2xl font-bold">
                            No orders yet
                        </h2>

                        <p
                            className={`mt-2 ${
                                darkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                            }`}
                        >
                            Your completed purchases will appear here.
                        </p>

                        <Link
                            href="/"
                            className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-pink-500"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className={`rounded-2xl border p-6 shadow-sm transition-colors ${
                                    darkMode
                                        ? "border-slate-800 bg-slate-900"
                                        : "border-slate-200 bg-white"
                                }`}
                            >
                                {/* Order Header */}
                                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p
                                            className={`text-xs font-semibold uppercase tracking-wider ${
                                                darkMode
                                                    ? "text-slate-500"
                                                    : "text-slate-400"
                                            }`}
                                        >
                                            Order ID
                                        </p>

                                        <p className="mt-1 break-all font-semibold">
                                            #{order._id}
                                        </p>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <p
                                            className={`text-xs ${
                                                darkMode
                                                    ? "text-slate-500"
                                                    : "text-slate-400"
                                            }`}
                                        >
                                            Ordered on
                                        </p>

                                        <p className="mt-1 text-sm font-semibold">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="mt-5 space-y-4">
                                    {order.items?.map((item, index) => (
                                        <div
                                            key={
                                                item._id ||
                                                `${order._id}-${index}`
                                            }
                                            className={`flex items-center gap-4 rounded-xl p-3 ${
                                                darkMode
                                                    ? "bg-slate-800"
                                                    : "bg-slate-50"
                                            }`}
                                        >
                                            <div
                                                className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg ${
                                                    darkMode
                                                        ? "bg-slate-700"
                                                        : "bg-white"
                                                }`}
                                            >
                                                {item.product?.image ? (
                                                    <img
                                                        src={
                                                            item.product.image
                                                        }
                                                        alt={
                                                            item.product.title ||
                                                            "Product"
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xl">
                                                        📦
                                                    </span>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate font-semibold">
                                                    {item.product?.title ||
                                                        "Product"}
                                                </h3>

                                                <p
                                                    className={`mt-1 text-sm ${
                                                        darkMode
                                                            ? "text-slate-400"
                                                            : "text-slate-500"
                                                    }`}
                                                >
                                                    Quantity:{" "}
                                                    {item.quantity || 1}
                                                </p>
                                            </div>

                                            <p className="font-semibold">
                                                ₹
                                                {Number(
                                                    item.product?.price ||
                                                        item.price ||
                                                        0
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div
                                    className={`mt-5 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between ${
                                        darkMode
                                            ? "border-slate-800"
                                            : "border-slate-200"
                                    }`}
                                >
                                    <span
                                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                            darkMode
                                                ? "bg-green-950/50 text-green-400"
                                                : "bg-green-50 text-green-700"
                                        }`}
                                    >
                                        Order Placed
                                    </span>

                                    <div className="text-left sm:text-right">
                                        <p
                                            className={`text-sm ${
                                                darkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            Total Amount
                                        </p>

                                        <p className="text-xl font-bold">
                                            ₹
                                            {Number(
                                                order.totalAmount || 0
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}