   import { useAuth } from "@/lib/AuthContext";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/config";
import axiosInstance from "@/lib/axiosinstance";

const Navbar = ({ handleslidein }: any) => {
  const { user, Logout } = useAuth();
  const { t } = useTranslation();

  const [hasMounted, setHasMounted] = useState(false);

  // ================= LANGUAGE OTP STATES =================

  const [showOtp, setShowOtp] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // ================= LOGOUT =================

  const handlelogout = () => {
    Logout();
  };

  // ================= LANGUAGE CHANGE =================

  const handleLanguageChange = async (language: string) => {
    // English can be changed directly
    if (language === "en") {
      i18n.changeLanguage("en");
      localStorage.setItem("language", "en");
      return;
    }

    // User must be logged in for secure language switching
    if (!user) {
      alert("Please login to change language.");
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        "/user/language/send-otp",
        {
          language,
        }
      );

      setSelectedLanguage(language);
      setVerificationMethod(response.data.verificationMethod);
      setShowOtp(true);
      setOtp("");

      alert(response.data.message);

    } catch (error: any) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY LANGUAGE OTP =================

  const verifyLanguageOTP = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        "/user/language/verify-otp",
        {
          language: selectedLanguage,
          otp: otp,
        }
      );

      // Change language only after successful verification
      i18n.changeLanguage(selectedLanguage);

      localStorage.setItem(
        "language",
        selectedLanguage
      );

      alert(
        response.data.message ||
          "Language changed successfully"
      );

      // Close OTP popup
      setShowOtp(false);
      setOtp("");
      setSelectedLanguage("");
      setVerificationMethod("");

    } catch (error: any) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <div className="top-0 z-50 w-full min-h-[53px] bg-white border-t-[3px] border-[#ef8236] shadow-[0_1px_5px_#00000033] flex items-center justify-center">

        <div className="w-[90%] max-w-[1440px] flex items-center justify-between mx-auto py-1">

          {/* ================= MOBILE MENU ================= */}

          <button
            aria-label="Toggle sidebar"
            className="sm:block md:hidden p-2 rounded hover:bg-gray-100 transition"
            onClick={handleslidein}
          >
            <Menu className="w-5 h-5 text-gray-800" />
          </button>

          {/* ================= LEFT SIDE ================= */}

          <div className="flex items-center gap-2 flex-grow">

            {/* LOGO */}

            <Link
              href="/"
              className="px-3 py-1"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="h-6 w-auto"
              />
            </Link>

            {/* ================= NAVIGATION ================= */}

            <div className="hidden sm:flex gap-1">

              <Link
                href="/"
                className="text-sm text-[#454545] font-medium px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                {t("about")}
              </Link>

              <Link
                href="/"
                className="text-sm text-[#454545] font-medium px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                {t("products")}
              </Link>

              <Link
                href="/"
                className="text-sm text-[#454545] font-medium px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                {t("forTeams")}
              </Link>

            </div>

            {/* ================= SEARCH ================= */}

            <form className="hidden lg:block flex-grow relative px-3">

              <input
                type="text"
                placeholder={t("search")}
                className="w-full max-w-[600px] pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
              />

              <Search className="absolute left-4 top-2.5 h-4 w-4 text-gray-600" />

            </form>

          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="flex items-center gap-2 flex-shrink-0">

            {/* ================= LANGUAGE ================= */}

            <select
              value={i18n.language}
              onChange={(e) =>
                handleLanguageChange(e.target.value)
              }
              disabled={loading}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm bg-white cursor-pointer flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-300"
              aria-label={t("language")}
            >

              <option value="en">
                English
              </option>

              <option value="es">
                Español
              </option>

              <option value="hi">
                हिन्दी
              </option>

              <option value="pt">
                Português
              </option>

              <option value="zh">
                中文
              </option>

              <option value="fr">
                Français
              </option>

            </select>

            {/* ================= LOGIN / USER ================= */}

            {!hasMounted ? null : !user ? (

              <Link
                href="/auth"
                className="text-sm font-medium text-[#454545] bg-[#e7f8fe] hover:bg-[#d3e4eb] border border-blue-500 px-4 py-1.5 rounded transition"
              >
                {t("login")}
              </Link>

            ) : (

              <>

                {/* PROFILE */}

                <Link
                  href={`/users/${user._id}`}
                  className="flex items-center justify-center bg-orange-600 text-white text-sm font-semibold w-9 h-9 rounded-full"
                >
                  {user.name
                    ?.charAt(0)
                    .toUpperCase()}
                </Link>

                {/* LOGOUT */}

                <button
                  onClick={handlelogout}
                  className="text-sm font-medium text-[#454545] bg-[#e7f8fe] hover:bg-[#d3e4eb] border border-blue-500 px-4 py-1.5 rounded transition"
                >
                  {t("logout")}
                </button>

              </>

            )}

          </div>

        </div>

      </div>

      {/* ================= OTP POPUP ================= */}

      {showOtp && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">

          <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-[400px] p-6">

            <h2 className="text-lg font-semibold mb-2">
              Verify Language Change
            </h2>

            <p className="text-sm text-gray-600 mb-4">

              OTP has been sent to your registered{" "}

              <span className="font-semibold">
                {verificationMethod === "email"
                  ? "email"
                  : "mobile number"}
              </span>
              .

            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />

            <div className="flex gap-2">

              <button
                onClick={verifyLanguageOTP}
                disabled={loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-medium"
              >
                {loading
                  ? "Verifying..."
                  : "Verify"}
              </button>

              <button
                onClick={() => {
                  setShowOtp(false);
                  setOtp("");
                  setSelectedLanguage("");
                  setVerificationMethod("");
                }}
                disabled={loading}
                className="flex-1 border border-gray-300 py-2 rounded font-medium hover:bg-gray-100"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default Navbar;