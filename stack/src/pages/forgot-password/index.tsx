  import { useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ForgotPassword = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // SEND OTP
  // =========================
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email && !phone) {
      toast.error(t("forgotEnterEmailPhone"));
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post(
        "/user/forgot-password",
        {
          email,
          phone,
        }
      );

      toast.success(
        res.data.message || t("otpSentSuccessfully")
      );

      setOtpSent(true);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        t("failedToSendOtp");

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.error(t("enterOtp"));
      return;
    }

    if (otp.length !== 6) {
      toast.error(t("otpSixDigits"));
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post(
        "/user/forgot-password/verify",
        {
          email,
          phone,
          otp,
        }
      );

      setGeneratedPassword(
        res.data.generatedPassword
      );

      toast.success(
        res.data.message ||
          t("passwordResetSuccessful")
      );
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        t("invalidOtp");

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PASSWORD GENERATED SCREEN
  // =========================
  if (generatedPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-6">
            <Link
              href="/"
              className="flex items-center justify-center"
            >
              <div className="w-8 h-8 bg-orange-500 rounded mr-2 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
                </div>
              </div>

              <span className="text-xl font-bold text-gray-800">
                stack
                <span className="font-normal">
                  overflow
                </span>
              </span>
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center">

              <CardTitle className="text-2xl">
                {t("passwordResetSuccessful")}
              </CardTitle>

              <CardDescription>
                {t("passwordResetDescription")}
              </CardDescription>

            </CardHeader>

            <CardContent className="space-y-5">

              <div className="rounded-lg bg-green-50 border border-green-200 p-4">

                <p className="text-sm text-gray-600 mb-2">
                  {t("yourNewPassword")}
                </p>

                <div className="text-center text-xl font-bold tracking-wider text-green-700">
                  {generatedPassword}
                </div>

              </div>

              <p className="text-sm text-gray-500 text-center">
                {t("savePassword")}
              </p>

              <Link href="/auth">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  {t("login")}
                </Button>
              </Link>

            </CardContent>
          </Card>

        </div>
      </div>
    );
  }

  // =========================
  // OTP SCREEN
  // =========================
  if (otpSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-6">
            <Link
              href="/"
              className="flex items-center justify-center"
            >
              <div className="w-8 h-8 bg-orange-500 rounded mr-2 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
                </div>
              </div>

              <span className="text-xl font-bold text-gray-800">
                stack
                <span className="font-normal">
                  overflow
                </span>
              </span>
            </Link>
          </div>

          <form onSubmit={handleVerifyOTP}>
            <Card>

              <CardHeader className="text-center">

                <CardTitle className="text-2xl">
                  {t("verifyOtp")}
                </CardTitle>

                <CardDescription>
                  {t("enterOtpDescription")}
                </CardDescription>

              </CardHeader>

              <CardContent className="space-y-5">

                {/* Email */}
                <div className="space-y-2">

                  <Label htmlFor="email">
                    {t("email")}
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                  />

                </div>

                {/* Phone */}
                <div className="space-y-2">

                  <Label htmlFor="phone">
                    {t("phoneNumber")}
                  </Label>

                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t(
                      "registeredPhonePlaceholder"
                    )}
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                  />

                </div>

                {/* OTP */}
                <div className="space-y-2">

                  <Label htmlFor="otp">
                    {t("otp")}
                  </Label>

                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder={t(
                      "otpPlaceholder"
                    )}
                    value={otp}
                    onChange={(e) => {
                      const value =
                        e.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setOtp(value);
                    }}
                    className="text-center text-lg tracking-widest"
                  />

                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading
                    ? t("verifying")
                    : t("verifyOtp")}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  {t("otpValidity")}
                </div>

                <div className="text-center text-sm">

                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    {t("changeEmail")}
                  </button>

                </div>

              </CardContent>
            </Card>
          </form>

        </div>
      </div>
    );
  }

  // =========================
  // SEND OTP SCREEN
  // =========================
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-6">

          <Link
            href="/"
            className="flex items-center justify-center"
          >
            <div className="w-8 h-8 bg-orange-500 rounded mr-2 flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
              </div>
            </div>

            <span className="text-xl font-bold text-gray-800">
              stack
              <span className="font-normal">
                overflow
              </span>
            </span>
          </Link>

        </div>

        <form onSubmit={handleSendOTP}>
          <Card>

            <CardHeader className="text-center">

              <CardTitle className="text-2xl">
                {t("forgotPassword")}
              </CardTitle>

              <CardDescription>
                {t("forgotPasswordDescription")}
              </CardDescription>

            </CardHeader>

            <CardContent className="space-y-5">

              {/* Email */}
              <div className="space-y-2">

                <Label htmlFor="email">
                  {t("email")}
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder={t(
                    "registeredEmailPlaceholder"
                  )}
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

              {/* Phone */}
              <div className="space-y-2">

                <Label htmlFor="phone">
                  {t("phoneNumber")}
                </Label>

                <Input
                  id="phone"
                  type="tel"
                  placeholder={t(
                    "registeredPhonePlaceholder"
                  )}
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />

              </div>

              {/* Send OTP */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading
                  ? t("sending")
                  : t("sendOtp")}
              </Button>

              {/* Login */}
              <div className="text-center text-sm text-gray-600">

                {t("rememberPassword")}{" "}

                <Link
                  href="/auth"
                  className="text-blue-600 hover:underline"
                >
                  {t("login")}
                </Link>

              </div>

            </CardContent>
          </Card>
        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;