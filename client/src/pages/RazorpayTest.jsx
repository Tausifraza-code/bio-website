import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchActivePlans,
  createPlanOrder,
  verifyPlanPayment,
  clearPlanPurchaseMessages,
} from "../redux/slice/planPurchaseSlice";

export default function RazorpayTest() {
  const dispatch = useDispatch();

  const {
    plans,
    currentOrder,
    purchase,
    loadingPlans,
    creatingOrder,
    verifyingPayment,
    error,
    successMessage,
  } = useSelector((state) => state.planPurchase);

  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    dispatch(fetchActivePlans());
  }, [dispatch]);

  const handlePurchase = async (plan) => {
    setCheckoutError("");
    dispatch(clearPlanPurchaseMessages());

    if (!window.Razorpay) {
      setCheckoutError("Razorpay Checkout script load nahi hua.");
      return;
    }

    try {
      // Backend se order create karo
      const order = await dispatch(createPlanOrder(plan._id)).unwrap();

      const options = {
        key: order.razorpayKeyId,
        amount: order.orderAmount,
        currency: order.orderCurrency,
        name: "BIO Website",
        description: order.planName,
        order_id: order.orderId,

        handler: async (paymentResponse) => {
          try {
            // Backend signature verification
            await dispatch(verifyPlanPayment(paymentResponse)).unwrap();
          } catch (err) {
            setCheckoutError(
              typeof err === "string"
                ? err
                : "Verification failed. Server par payment status check karo.",
            );
          }
        },

        modal: {
          ondismiss: () => {
            setCheckoutError(
              "Checkout close hua. Payment status pending ho sakta hai.",
            );
          },
        },
      };

      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", (response) => {
        setCheckoutError(response.error?.description || "Test payment failed.");
      });

      checkout.open();
    } catch (err) {
      setCheckoutError(
        typeof err === "string" ? err : "Unable to create order.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Razorpay Test Checkout</h1>

        <p className="mt-2 text-slate-400">
          Temporary testing page — Test Mode only.
        </p>

        {loadingPlans && <p className="mt-5">Loading plans...</p>}

        {(error || checkoutError) && (
          <p className="mt-5 rounded-lg bg-red-950 p-4 text-red-200">
            {checkoutError || error}
          </p>
        )}

        {successMessage && purchase && (
          <div className="mt-5 rounded-lg bg-emerald-950 p-4 text-emerald-200">
            <p>{successMessage}</p>
            <p>Plan: {purchase.planName}</p>
            <p>Status: {purchase.status}</p>
            <p>
              Expiry:{" "}
              {purchase.expiryDate
                ? new Date(purchase.expiryDate).toLocaleString()
                : "Not returned"}
            </p>
          </div>
        )}

        {!loadingPlans && plans.length === 0 && !error && (
          <p className="mt-5">No active plans available.</p>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan._id}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
            >
              <h2 className="text-xl font-semibold">{plan.name}</h2>

              <p className="mt-3 text-3xl font-bold">₹{plan.price}</p>

              <p className="mt-2 text-slate-300">
                Valid for {plan.durationValue} {plan.durationUnit}
              </p>

              <p className="mt-3 text-slate-400">{plan.description}</p>

              <button
                type="button"
                onClick={() => handlePurchase(plan)}
                disabled={
                  creatingOrder || verifyingPayment || currentOrder !== null
                }
                className="mt-6 w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50"
              >
                {creatingOrder
                  ? "Creating order..."
                  : verifyingPayment
                    ? "Verifying payment..."
                    : "Buy Now — Test Mode"}
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
