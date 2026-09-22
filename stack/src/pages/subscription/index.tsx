 import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const plans = [
  {
    name: "Free",
    amount: 0,
    questions: "1 question/day",
    badge: "No badge",
    features: [
      "1 question per day",
      "Basic search",
    ],
  },
  {
    name: "Bronze",
    amount: 99,
    questions: "5 questions/day",
    badge: "Bronze",
    features: [
      "5 questions per day",
      "Bronze profile badge",
      "Advanced search filters",
    ],
  },
  {
    name: "Silver",
    amount: 299,
    questions: "15 questions/day",
    badge: "Silver",
    features: [
      "15 questions per day",
      "Silver profile badge",
      "Priority support",
      "Enhanced profile visibility",
      "Unlimited bookmarks",
    ],
  },
  {
    name: "Gold",
    amount: 999,
    questions: "Unlimited",
    badge: "Gold",
    features: [
      "Unlimited questions",
      "Gold profile badge",
      "Highest search priority",
      "Featured profile",
      "Priority customer support",
      "Exclusive community features",
    ],
  },
];

export default function Subscription() {
  const router = useRouter();

  const [currentPlan, setCurrentPlan] =
    useState("Free");

  const [loadingPlan, setLoadingPlan] =
    useState("");

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:5000";

  useEffect(() => {
    loadCurrentSubscription();
  }, []);

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    if (typeof window === "undefined") {
      return "";
    }

    return (
      localStorage.getItem("token") || ""
    );
  };

  // =====================================================
  // LOAD CURRENT SUBSCRIPTION
  // =====================================================

  const loadCurrentSubscription =
    async () => {
      try {
        const token = getToken();

        if (!token) {
          return;
        }

        const response =
          await axios.get(
            `${backendUrl}/subscription/my`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setCurrentPlan(
          response.data
            ?.userSubscription
            ?.plan || "Free"
        );
      } catch (error) {
        console.log(
          "Subscription loading error:",
          error
        );
      }
    };

  // =====================================================
  // SUBSCRIBE
  // =====================================================

  const handleSubscribe = async (
    planName: string
  ) => {
    try {
      // Free plan
      if (planName === "Free") {
        return;
      }

      setLoadingPlan(planName);

      const token = getToken();

      if (!token) {
        alert("Please login first.");
        setLoadingPlan("");
        return;
      }

      // =================================================
      // STEP 1: CREATE SUBSCRIPTION
      // =================================================

      const createResponse =
        await axios.post(
          `${backendUrl}/subscription/create`,
          {
            plan: planName,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const {
        subscriptionId,
        demoPayment,
      } = createResponse.data;

      // =================================================
      // DEMO PAYMENT
      // =================================================

      if (demoPayment === true) {
        const confirmPayment =
          window.confirm(
            `Demo Payment\n\n` +
              `Plan: ${planName}\n\n` +
              `Click OK to simulate successful payment.`
          );

        if (!confirmPayment) {
          setLoadingPlan("");
          return;
        }

        // ===============================================
        // STEP 2: VERIFY DEMO PAYMENT
        // ===============================================

        const verifyResponse =
          await axios.post(
            `${backendUrl}/subscription/verify`,
            {
              razorpay_subscription_id:
                subscriptionId,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        alert(
          `Demo payment successful!\n\n` +
            `${planName} plan activated.\n\n` +
            `Invoice: ${
              verifyResponse.data
                ?.invoiceNumber || ""
            }`
        );

        await loadCurrentSubscription();

        setLoadingPlan("");

        router.push("/profile");

        return;
      }

      // =================================================
      // REAL PAYMENT MODE
      // =================================================

      alert(
        "Real Razorpay payment mode is enabled."
      );

      setLoadingPlan("");

    } catch (error: any) {
      console.log(
        "Subscription error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to create subscription."
      );

      setLoadingPlan("");
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10 text-center">

          <h1 className="text-3xl font-bold">
            Subscription & Premium Membership
          </h1>

          <p className="mt-2 text-gray-600">
            Choose a plan that fits your needs
          </p>

          <p className="mt-3 font-semibold">
            Current Plan:{" "}

            <span className="text-blue-600">
              {currentPlan}
            </span>
          </p>

          {/* DEMO MODE */}

          <p className="mt-2 text-sm font-medium text-orange-600">
            Demo Payment Mode
          </p>

        </div>

        {/* PLANS */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {plans.map((plan) => {

            const isCurrent =
              currentPlan ===
              plan.name;

            return (
              <div
                key={plan.name}
                className={`rounded-xl border bg-white p-6 shadow-sm ${
                  isCurrent
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-gray-200"
                }`}
              >

                {/* PLAN NAME */}

                <h2 className="text-2xl font-bold">
                  {plan.name}
                </h2>

                {/* PRICE */}

                <div className="mt-4">

                  <span className="text-3xl font-bold">
                    ₹{plan.amount}
                  </span>

                  {plan.amount > 0 && (
                    <span className="text-gray-500">
                      /month
                    </span>
                  )}

                </div>

                {/* BASIC DETAILS */}

                <div className="mt-4 space-y-2">

                  <p className="font-medium">
                    {plan.questions}
                  </p>

                  <p className="text-sm text-gray-600">
                    Badge: {plan.badge}
                  </p>

                </div>

                {/* FEATURES */}

                <ul className="mt-5 space-y-2">

                  {plan.features.map(
                    (feature) => (
                      <li
                        key={feature}
                        className="text-sm text-gray-700"
                      >
                        ✓ {feature}
                      </li>
                    )
                  )}

                </ul>

                {/* BUTTON */}

                <button
                  disabled={
                    isCurrent ||
                    loadingPlan ===
                      plan.name
                  }
                  onClick={() =>
                    handleSubscribe(
                      plan.name
                    )
                  }
                  className={`mt-6 w-full rounded-lg px-4 py-3 font-semibold ${
                    isCurrent
                      ? "cursor-not-allowed bg-gray-300 text-gray-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >

                  {isCurrent
                    ? "Current Plan"
                    : loadingPlan ===
                      plan.name
                    ? "Processing..."
                    : plan.name ===
                      "Free"
                    ? "Free Plan"
                    : `Subscribe ₹${plan.amount}`}

                </button>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}