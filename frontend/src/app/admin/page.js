"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    useGetProductsQuery,
    useGetUsersQuery,
    useGetOrdersQuery,
} from "../../store/api/api";

export default function AdminPage() {
    const [darkMode, setDarkMode] = useState(false);

    const {
        data: productsData,
        isLoading: productsLoading,
    } = useGetProductsQuery();

    const {
        data: usersData,
        isLoading: usersLoading,
    } = useGetUsersQuery();

    const {
        data: ordersData,
        isLoading: ordersLoading,
    } = useGetOrdersQuery();

    useEffect(() => {
        setDarkMode(
            localStorage.getItem("shopin-theme") === "dark"
        );
    }, []);

    const products = productsData?.data || [];
    const users = usersData?.data || [];
    const orders = ordersData?.data || [];

    const totalRevenue = orders.reduce(
        (sum, order) => sum + Number(order.totalAmount || 0),
        0
    );

    const stats = [
        {
            label: "Products",
            value: products.length,
        },
        {
            label: "Users",
            value: users.length,
        },
        {
            label: "Orders",
            value: orders.length,
        },
        {
            label: "Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
        },
    ];

    const loading =
        productsLoading || usersLoading || ordersLoading;

    return (
        <main
            className={`min-h-screen ${
                darkMode
                    ? "bg-slate-950 text-white"
                    : "bg-[#faf7f8] text-slate-900"
            }`}
        >
            <header
                className={`border-b ${
                    darkMode
                        ? "border-white/10 bg-slate-950"
                        : "border-slate-200 bg-white"
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
                    <div>
                        <Link
                            href="/"
                            className="text-2xl font-bold"
                        >
                            ShopIn
                            <span className="text-pink-500">
                                .
                            </span>
                        </Link>

                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-pink-500">
                            Admin Dashboard
                        </p>
                    </div>

                    <Link
                        href="/"
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                            darkMode
                                ? "border-white/10 hover:bg-white/5"
                                : "border-slate-200 hover:border-pink-400"
                        }`}
                    >
                        Back to Shop
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">
                        Dashboard
                    </h1>

                    <p
                        className={`mt-2 ${
                            darkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                        }`}
                    >
                        Overview of ShopIn platform activity.
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 text-center">
                        Loading dashboard...
                    </div>
                ) : (
                    <>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className={`rounded-3xl border p-6 shadow-sm ${
                                        darkMode
                                            ? "border-white/10 bg-slate-900"
                                            : "border-slate-200 bg-white"
                                    }`}
                                >
                                    <p
                                        className={`text-sm font-medium ${
                                            darkMode
                                                ? "text-slate-400"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        {stat.label}
                                    </p>

                                    <p className="mt-3 text-3xl font-bold">
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 grid gap-7 lg:grid-cols-2">
                            <section
                                className={`rounded-3xl border p-6 shadow-sm ${
                                    darkMode
                                        ? "border-white/10 bg-slate-900"
                                        : "border-slate-200 bg-white"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">
                                        Recent Orders
                                    </h2>

                                    <Link
                                        href="/orders"
                                        className="text-sm font-semibold text-pink-500"
                                    >
                                        View Orders
                                    </Link>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {orders
                                        .slice(0, 5)
                                        .map((order) => (
                                            <div
                                                key={order._id}
                                                className={`rounded-2xl border p-4 ${
                                                    darkMode
                                                        ? "border-white/10 bg-slate-800"
                                                        : "border-slate-100 bg-slate-50"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <p className="font-semibold">
                                                            Order #
                                                            {order._id.slice(
                                                                -8
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-sm text-slate-500">
                                                            {new Date(
                                                                order.createdAt
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    <p className="font-bold">
                                                        ₹
                                                        {Number(
                                                            order.totalAmount ||
                                                                0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                    {orders.length === 0 && (
                                        <p className="py-8 text-center text-slate-500">
                                            No orders yet.
                                        </p>
                                    )}
                                </div>
                            </section>

                            <section
                                className={`rounded-3xl border p-6 shadow-sm ${
                                    darkMode
                                        ? "border-white/10 bg-slate-900"
                                        : "border-slate-200 bg-white"
                                }`}
                            >
                                <h2 className="text-xl font-bold">
                                    Product Inventory
                                </h2>

                                <div className="mt-5 space-y-3">
                                    {products
                                        .slice(0, 5)
                                        .map((product) => (
                                            <div
                                                key={product._id}
                                                className={`flex items-center justify-between rounded-2xl border p-4 ${
                                                    darkMode
                                                        ? "border-white/10 bg-slate-800"
                                                        : "border-slate-100 bg-slate-50"
                                                }`}
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold">
                                                        {
                                                            product.title
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {
                                                            product.category
                                                        }
                                                    </p>
                                                </div>

                                                <p className="ml-4 font-bold">
                                                    ₹
                                                    {Number(
                                                        product.price ||
                                                            0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </p>
                                            </div>
                                        ))}

                                    {products.length === 0 && (
                                        <p className="py-8 text-center text-slate-500">
                                            No products found.
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}