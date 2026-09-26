"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { clearCart } from "../../store/slices/cartSlice";
import { useCreateOrderMutation } from "../../store/api/api";

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const cartItems = useSelector((state) => state.cart.items);
    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    const [createOrder, { isLoading }] = useCreateOrderMutation();

    const [darkMode, setDarkMode] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [showCardDetails, setShowCardDetails] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderError, setOrderError] = useState("");

    const [cardDetails, setCardDetails] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: "",
    });

    const [upiId, setUpiId] = useState("");

    const [shippingDetails, setShippingDetails] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
    });

    useEffect(() => {
        const savedTheme = localStorage.getItem("shopin-theme");

        if (savedTheme === "dark") {
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        const handleStorage = () => {
            setDarkMode(
                localStorage.getItem("shopin-theme") === "dark"
            );
        };

        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const subtotal = cartItems.reduce(
        (total, item) =>
            total + Number(item.price) * item.quantity,
        0
    );

    const shipping = 0;
    const total = subtotal + shipping;

    const updateShippingField = (field, value) => {
        setShippingDetails((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handlePaymentMethod = (method) => {
        setPaymentMethod(method);

        if (method === "card") {
            setShowCardDetails(true);
        } else {
            setShowCardDetails(false);
        }
    };

    const formatCardNumber = (value) => {
        const digits = value
            .replace(/\D/g, "")
            .slice(0, 16);

        return digits.replace(/(.{4})/g, "$1 ").trim();
    };

    const formatExpiry = (value) => {
        const digits = value
            .replace(/\D/g, "")
            .slice(0, 4);

        if (digits.length <= 2) {
            return digits;
        }

        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    };

    const handlePlaceOrder = async () => {
        setOrderError("");

        if (!isAuthenticated) {
            router.push("/");
            return;
        }

        if (cartItems.length === 0) {
            return;
        }

        if (
            !shippingDetails.name ||
            !shippingDetails.phone ||
            !shippingDetails.address ||
            !shippingDetails.city ||
            !shippingDetails.pincode
        ) {
            window.alert(
                "Please complete your delivery details."
            );
            return;
        }

        if (paymentMethod === "upi" && !upiId.trim()) {
            window.alert("Please enter your UPI ID.");
            return;
        }

        if (
            paymentMethod === "card" &&
            (!cardDetails.number ||
                !cardDetails.name ||
                !cardDetails.expiry ||
                !cardDetails.cvv)
        ) {
            window.alert(
                "Please complete your card details."
            );
            return;
        }

        try {
            const orderItems = cartItems.map((item) => ({
                product: item.productId,
                quantity: item.quantity,
            }));

            await createOrder({
                items: orderItems,
                totalAmount: total,
            }).unwrap();

            dispatch(clearCart());
            setOrderPlaced(true);
        } catch (error) {
            console.error("Place order error:", error);

            setOrderError(
                error?.data?.message ||
                    "Failed to place order. Please try again."
            );
        }
    };

    if (orderPlaced) {
        return (
            <main
                className={`flex min-h-screen items-center justify-center px-5 transition-colors duration-300 ${
                    darkMode
                        ? "bg-slate-950 text-white"
                        : "bg-[#faf7f8] text-slate-900"
                }`}
            >
                <div
                    className={`w-full max-w-lg rounded-3xl border p-10 text-center shadow-xl ${
                        darkMode
                            ? "border-white/10 bg-slate-900"
                            : "border-slate-200 bg-white"
                    }`}
                >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
                        ✓
                    </div>

                    <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                        ShopIn
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Order placed successfully
                    </h1>

                    <p
                        className={`mt-4 leading-7 ${
                            darkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                        }`}
                    >
                        Thank you for shopping with ShopIn.
                        Your order has been saved and is being
                        prepared.
                    </p>

                    <div
                        className={`mt-6 rounded-2xl p-5 text-left ${
                            darkMode
                                ? "bg-slate-800"
                                : "bg-slate-50"
                        }`}
                    >
                        <div className="flex justify-between">
                            <span className="text-slate-500">
                                Payment
                            </span>

                            <span className="font-semibold">
                                {paymentMethod === "cod"
                                    ? "Cash on Delivery"
                                    : paymentMethod === "upi"
                                    ? "UPI"
                                    : "Credit / Debit Card"}
                            </span>
                        </div>

                        <div className="mt-3 flex justify-between">
                            <span className="text-slate-500">
                                Total
                            </span>

                            <span className="font-bold">
                                ₹{total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <Link
                        href="/orders"
                        className="mt-7 block rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-600"
                    >
                        View My Orders
                    </Link>

                    <Link
                        href="/"
                        className={`mt-3 block rounded-xl border px-5 py-3 font-semibold transition ${
                            darkMode
                                ? "border-white/10 hover:bg-white/5"
                                : "border-slate-200 hover:border-pink-400"
                        }`}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    if (cartItems.length === 0) {
        return (
            <main
                className={`flex min-h-screen items-center justify-center px-5 ${
                    darkMode
                        ? "bg-slate-950 text-white"
                        : "bg-[#faf7f8] text-slate-900"
                }`}
            >
                <div className="text-center">
                    <div className="text-5xl">🛒</div>

                    <h1 className="mt-5 text-3xl font-bold">
                        Your cart is empty
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Add products before proceeding to
                        checkout.
                    </p>

                    <Link
                        href="/"
                        className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
                    >
                        Browse Products
                    </Link>
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
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
                    <Link
                        href="/"
                        className="text-2xl font-bold"
                    >
                        ShopIn
                        <span className="text-pink-500">
                            .
                        </span>
                    </Link>

                    <Link
                        href="/cart"
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                            darkMode
                                ? "border-white/10 hover:bg-white/5"
                                : "border-slate-200 hover:border-pink-400 hover:text-pink-500"
                        }`}
                    >
                        Back to Cart
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                        Checkout
                    </p>

                    <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                        Complete your order
                    </h1>

                    <p
                        className={`mt-2 ${
                            darkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                        }`}
                    >
                        Enter your delivery details and choose
                        how you would like to pay.
                    </p>
                </div>

                {orderError && (
                    <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                        {orderError}
                    </div>
                )}

                <div className="grid gap-7 lg:grid-cols-[1fr_380px]">
                    <div className="space-y-7">
                        <section
                            className={`rounded-3xl border p-6 shadow-sm ${
                                darkMode
                                    ? "border-white/10 bg-slate-900"
                                    : "border-slate-200 bg-white"
                            }`}
                        >
                            <h2 className="text-xl font-bold">
                                Delivery Details
                            </h2>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <input
                                    placeholder="Full name"
                                    value={shippingDetails.name}
                                    onChange={(event) =>
                                        updateShippingField(
                                            "name",
                                            event.target.value
                                        )
                                    }
                                    className={`rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                        darkMode
                                            ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                                            : "border-slate-200 bg-white"
                                    }`}
                                />

                                <input
                                    placeholder="Phone number"
                                    value={shippingDetails.phone}
                                    onChange={(event) =>
                                        updateShippingField(
                                            "phone",
                                            event.target.value
                                        )
                                    }
                                    className={`rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                        darkMode
                                            ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                                            : "border-slate-200 bg-white"
                                    }`}
                                />

                                <textarea
                                    placeholder="Delivery address"
                                    rows="3"
                                    value={shippingDetails.address}
                                    onChange={(event) =>
                                        updateShippingField(
                                            "address",
                                            event.target.value
                                        )
                                    }
                                    className={`sm:col-span-2 rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                        darkMode
                                            ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                                            : "border-slate-200 bg-white"
                                    }`}
                                />

                                <input
                                    placeholder="City"
                                    value={shippingDetails.city}
                                    onChange={(event) =>
                                        updateShippingField(
                                            "city",
                                            event.target.value
                                        )
                                    }
                                    className={`rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                        darkMode
                                            ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                                            : "border-slate-200 bg-white"
                                    }`}
                                />

                                <input
                                    placeholder="PIN code"
                                    inputMode="numeric"
                                    value={shippingDetails.pincode}
                                    onChange={(event) =>
                                        updateShippingField(
                                            "pincode",
                                            event.target.value
                                        )
                                    }
                                    className={`rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                        darkMode
                                            ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                                            : "border-slate-200 bg-white"
                                    }`}
                                />
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
                                Payment Method
                            </h2>

                            <div className="mt-5 space-y-3">
                                {[
                                    {
                                        id: "cod",
                                        title: "Cash on Delivery",
                                        description:
                                            "Pay when your order arrives.",
                                        icon: "₹",
                                    },
                                    {
                                        id: "upi",
                                        title: "UPI",
                                        description:
                                            "Pay securely using your UPI ID.",
                                        icon: "UPI",
                                    },
                                    {
                                        id: "card",
                                        title: "Credit / Debit Card",
                                        description:
                                            "Pay using your bank card.",
                                        icon: "▣",
                                    },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() =>
                                            handlePaymentMethod(
                                                method.id
                                            )
                                        }
                                        className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                                            paymentMethod ===
                                            method.id
                                                ? "border-pink-500 bg-pink-50 dark:bg-pink-500/10"
                                                : darkMode
                                                ? "border-white/10 bg-slate-800 hover:border-white/20"
                                                : "border-slate-200 hover:border-pink-300"
                                        }`}
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-sm font-bold text-pink-600">
                                            {method.icon}
                                        </div>

                                        <div className="flex-1">
                                            <p className="font-bold">
                                                {method.title}
                                            </p>

                                            <p
                                                className={`mt-1 text-sm ${
                                                    darkMode
                                                        ? "text-slate-400"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                {method.description}
                                            </p>
                                        </div>

                                        <div
                                            className={`h-5 w-5 rounded-full border-2 ${
                                                paymentMethod ===
                                                method.id
                                                    ? "border-pink-500 bg-pink-500"
                                                    : darkMode
                                                    ? "border-slate-600"
                                                    : "border-slate-300"
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>

                            {paymentMethod === "upi" && (
                                <div className="mt-5 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
                                    <label className="text-sm font-semibold">
                                        UPI ID
                                    </label>

                                    <input
                                        value={upiId}
                                        onChange={(event) =>
                                            setUpiId(
                                                event.target.value
                                            )
                                        }
                                        placeholder="example@upi"
                                        className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                            darkMode
                                                ? "border-white/10 bg-slate-900 text-white placeholder:text-slate-500"
                                                : "border-slate-200 bg-white"
                                        }`}
                                    />

                                    <p className="mt-2 text-xs text-slate-500">
                                        Demo checkout only. No
                                        real payment is processed.
                                    </p>
                                </div>
                            )}

                            {paymentMethod === "card" &&
                                showCardDetails && (
                                    <div className="mt-5 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
                                        <div className="grid gap-4">
                                            <div>
                                                <label className="text-sm font-semibold">
                                                    Card Number
                                                </label>

                                                <input
                                                    inputMode="numeric"
                                                    value={
                                                        cardDetails.number
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setCardDetails(
                                                            (
                                                                current
                                                            ) => ({
                                                                ...current,
                                                                number: formatCardNumber(
                                                                    event
                                                                        .target
                                                                        .value
                                                                ),
                                                            })
                                                        )
                                                    }
                                                    placeholder="1234 5678 9012 3456"
                                                    className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                                        darkMode
                                                            ? "border-white/10 bg-slate-900 text-white placeholder:text-slate-500"
                                                            : "border-slate-200 bg-white"
                                                    }`}
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm font-semibold">
                                                    Name on Card
                                                </label>

                                                <input
                                                    value={
                                                        cardDetails.name
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setCardDetails(
                                                            (
                                                                current
                                                            ) => ({
                                                                ...current,
                                                                name: event
                                                                    .target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                    placeholder="Your name"
                                                    className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                                        darkMode
                                                            ? "border-white/10 bg-slate-900 text-white placeholder:text-slate-500"
                                                            : "border-slate-200 bg-white"
                                                    }`}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-semibold">
                                                        Expiry
                                                    </label>

                                                    <input
                                                        inputMode="numeric"
                                                        value={
                                                            cardDetails.expiry
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setCardDetails(
                                                                (
                                                                    current
                                                                ) => ({
                                                                    ...current,
                                                                    expiry: formatExpiry(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    ),
                                                                })
                                                            )
                                                        }
                                                        placeholder="MM/YY"
                                                        className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                                            darkMode
                                                                ? "border-white/10 bg-slate-900 text-white placeholder:text-slate-500"
                                                                : "border-slate-200 bg-white"
                                                        }`}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm font-semibold">
                                                        CVV
                                                    </label>

                                                    <input
                                                        type="password"
                                                        inputMode="numeric"
                                                        maxLength="3"
                                                        value={
                                                            cardDetails.cvv
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setCardDetails(
                                                                (
                                                                    current
                                                                ) => ({
                                                                    ...current,
                                                                    cvv: event.target.value
                                                                        .replace(
                                                                            /\D/g,
                                                                            ""
                                                                        )
                                                                        .slice(
                                                                            0,
                                                                            3
                                                                        ),
                                                                })
                                                            )
                                                        }
                                                        placeholder="123"
                                                        className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-400 ${
                                                            darkMode
                                                                ? "border-white/10 bg-slate-900 text-white placeholder:text-slate-500"
                                                                : "border-slate-200 bg-white"
                                                        }`}
                                                    />
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-500">
                                                Demo checkout only.
                                                Do not enter real
                                                card information.
                                            </p>
                                        </div>
                                    </div>
                                )}
                        </section>
                    </div>

                    <aside className="h-fit lg:sticky lg:top-6">
                        <div
                            className={`rounded-3xl border p-6 shadow-sm ${
                                darkMode
                                    ? "border-white/10 bg-slate-900"
                                    : "border-slate-200 bg-white"
                            }`}
                        >
                            <h2 className="text-xl font-bold">
                                Order Summary
                            </h2>

                            <div className="mt-5 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex gap-3"
                                    >
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold">
                                                {item.title}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Qty:{" "}
                                                {item.quantity}
                                            </p>
                                        </div>

                                        <p className="text-sm font-bold">
                                            ₹
                                            {(
                                                Number(
                                                    item.price
                                                ) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-3 border-t pt-5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Subtotal
                                    </span>

                                    <span className="font-semibold">
                                        ₹{subtotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Shipping
                                    </span>

                                    <span className="font-semibold text-green-600">
                                        Free
                                    </span>
                                </div>

                                <div className="flex justify-between border-t pt-4 text-lg">
                                    <span className="font-bold">
                                        Total
                                    </span>

                                    <span className="font-bold">
                                        ₹{total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                disabled={isLoading}
                                className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading
                                    ? "Placing Order..."
                                    : `Place Order · ₹${total.toFixed(
                                          2
                                      )}`}
                            </button>

                            <p className="mt-4 text-center text-xs text-slate-500">
                                Secure demo checkout • Free
                                shipping
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}