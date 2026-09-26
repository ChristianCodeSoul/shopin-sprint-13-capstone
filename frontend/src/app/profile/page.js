"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
    useGetMyProfileQuery,
    useUpdateMyProfileMutation,
    useChangePasswordMutation,
} from "../../store/api/api";

export default function ProfilePage() {
    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    const [darkMode, setDarkMode] = useState(false);

    const { data, isLoading, error } = useGetMyProfileQuery(
        undefined,
        {
            skip: !isAuthenticated,
        }
    );

    const [updateProfile, { isLoading: updating }] =
        useUpdateMyProfileMutation();

    const [changePassword, { isLoading: changingPassword }] =
        useChangePasswordMutation();

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
    });

    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setDarkMode(
            localStorage.getItem("shopin-theme") === "dark"
        );
    }, []);

    useEffect(() => {
        if (data?.data) {
            setProfile({
                firstName: data.data.firstName || "",
                lastName: data.data.lastName || "",
                username: data.data.username || "",
                email: data.data.email || "",
            });
        }
    }, [data]);

    const handleProfileChange = (field, value) => {
        setProfile((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswords((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleUpdateProfile = async (event) => {
        event.preventDefault();

        setMessage("");
        setErrorMessage("");

        try {
            await updateProfile({
                firstName: profile.firstName,
                lastName: profile.lastName,
            }).unwrap();

            setMessage("Profile updated successfully.");
        } catch (error) {
            setErrorMessage(
                error?.data?.message ||
                    "Failed to update profile."
            );
        }
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();

        setMessage("");
        setErrorMessage("");

        if (
            !passwords.currentPassword ||
            !passwords.newPassword
        ) {
            setErrorMessage(
                "Please enter both password fields."
            );
            return;
        }

        try {
            await changePassword(passwords).unwrap();

            setPasswords({
                currentPassword: "",
                newPassword: "",
            });

            setMessage("Password changed successfully.");
        } catch (error) {
            setErrorMessage(
                error?.data?.message ||
                    "Failed to change password."
            );
        }
    };

    if (!isAuthenticated) {
        return (
            <main
                className={`flex min-h-screen items-center justify-center px-5 ${
                    darkMode
                        ? "bg-slate-950 text-white"
                        : "bg-[#faf7f8] text-slate-900"
                }`}
            >
                <div className="text-center">
                    <h1 className="text-3xl font-bold">
                        Please log in
                    </h1>

                    <p className="mt-3 text-slate-500">
                        You need to be logged in to view your
                        profile.
                    </p>

                    <Link
                        href="/"
                        className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
                    >
                        Back to Shop
                    </Link>
                </div>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main
                className={`flex min-h-screen items-center justify-center ${
                    darkMode
                        ? "bg-slate-950 text-white"
                        : "bg-[#faf7f8] text-slate-900"
                }`}
            >
                Loading profile...
            </main>
        );
    }

    if (error) {
        return (
            <main
                className={`flex min-h-screen items-center justify-center px-5 ${
                    darkMode
                        ? "bg-slate-950 text-white"
                        : "bg-[#faf7f8] text-slate-900"
                }`}
            >
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        Unable to load profile
                    </h1>

                    <p className="mt-3 text-slate-500">
                        Please try again after logging in.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main
            className={`min-h-screen transition-colors duration-300 ${
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
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 lg:px-8">
                    <Link
                        href="/"
                        className="text-2xl font-bold"
                    >
                        ShopIn
                        <span className="text-pink-500">
                            .
                        </span>
                    </Link>

                    <div className="flex gap-3">
                        <Link
                            href="/orders"
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                                darkMode
                                    ? "border-white/10 hover:bg-white/5"
                                    : "border-slate-200 hover:border-pink-400"
                            }`}
                        >
                            Orders
                        </Link>

                        <Link
                            href="/cart"
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                                darkMode
                                    ? "border-white/10 hover:bg-white/5"
                                    : "border-slate-200 hover:border-pink-400"
                            }`}
                        >
                            Cart
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                        Account
                    </p>

                    <h1 className="mt-2 text-4xl font-bold">
                        My Profile
                    </h1>

                    <p
                        className={`mt-2 ${
                            darkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                        }`}
                    >
                        Manage your account information and
                        password.
                    </p>
                </div>

                {message && (
                    <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
                        {message}
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                        {errorMessage}
                    </div>
                )}

                <div className="grid gap-7 lg:grid-cols-2">
                    <section
                        className={`rounded-3xl border p-6 shadow-sm ${
                            darkMode
                                ? "border-white/10 bg-slate-900"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        <h2 className="text-xl font-bold">
                            Personal Information
                        </h2>

                        <form
                            onSubmit={handleUpdateProfile}
                            className="mt-6 space-y-4"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <input
                                    value={profile.firstName}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "firstName",
                                            event.target.value
                                        )
                                    }
                                    placeholder="First name"
                                    className={`rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                        darkMode
                                            ? "border-white/10 bg-slate-800 text-white"
                                            : "border-slate-200 bg-white"
                                    }`}
                                />

                                <input
                                    value={profile.lastName}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "lastName",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Last name"
                                    className={`rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                        darkMode
                                            ? "border-white/10 bg-slate-800 text-white"
                                            : "border-slate-200 bg-white"
                                    }`}
                                />
                            </div>

                            <input
                                value={profile.username}
                                disabled
                                className={`w-full rounded-xl border px-4 py-3 ${
                                    darkMode
                                        ? "border-white/10 bg-slate-800 text-slate-500"
                                        : "border-slate-200 bg-slate-100 text-slate-500"
                                }`}
                            />

                            <input
                                value={profile.email}
                                disabled
                                className={`w-full rounded-xl border px-4 py-3 ${
                                    darkMode
                                        ? "border-white/10 bg-slate-800 text-slate-500"
                                        : "border-slate-200 bg-slate-100 text-slate-500"
                                }`}
                            />

                            <button
                                type="submit"
                                disabled={updating}
                                className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:opacity-60"
                            >
                                {updating
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>
                        </form>
                    </section>

                    <section
                        className={`rounded-3xl border p-6 shadow-sm ${
                            darkMode
                                ? "border-white/10 bg-slate-900"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        <h2 className="text-xl font-bold">
                            Change Password
                        </h2>

                        <form
                            onSubmit={handleChangePassword}
                            className="mt-6 space-y-4"
                        >
                            <input
                                type="password"
                                value={
                                    passwords.currentPassword
                                }
                                onChange={(event) =>
                                    handlePasswordChange(
                                        "currentPassword",
                                        event.target.value
                                    )
                                }
                                placeholder="Current password"
                                className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                    darkMode
                                        ? "border-white/10 bg-slate-800 text-white"
                                        : "border-slate-200 bg-white"
                                }`}
                            />

                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={(event) =>
                                    handlePasswordChange(
                                        "newPassword",
                                        event.target.value
                                    )
                                }
                                placeholder="New password"
                                className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                    darkMode
                                        ? "border-white/10 bg-slate-800 text-white"
                                        : "border-slate-200 bg-white"
                                }`}
                            />

                            <button
                                type="submit"
                                disabled={changingPassword}
                                className="w-full rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:opacity-60"
                            >
                                {changingPassword
                                    ? "Updating..."
                                    : "Change Password"}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}