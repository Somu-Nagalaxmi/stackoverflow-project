 import Mainlayout from "@/layout/Mainlayout";
import axiosInstance from "@/lib/axiosinstance";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Security() {
  const { t } = useTranslation();

  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [deviceName, setDeviceName] = useState("");

  const [message, setMessage] = useState("");

  // =========================
  // LOGIN HISTORY
  // =========================

  const getLoginHistory = async () => {
    try {
      const res = await axiosInstance.get(
        "/user/login-history"
      );

      setLoginHistory(res.data.data || []);

      setMessage(t("loginHistoryLoaded"));
    } catch (error: any) {
      console.log(
        "LOGIN HISTORY ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          t("failedToLoadLoginHistory")
      );
    }
  };

  // =========================
  // ACTIVE SESSIONS
  // =========================

  const getSessions = async () => {
    try {
      const res = await axiosInstance.get(
        "/user/sessions"
      );

      setSessions(res.data.data || []);

      setMessage(t("activeSessionsLoaded"));
    } catch (error: any) {
      console.log(
        "SESSION ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          t("failedToLoadSessions")
      );
    }
  };

  // =========================
  // REVOKE SESSION
  // =========================

  const revokeSession = async (
    sessionId: string
  ) => {
    try {
      const res = await axiosInstance.patch(
        `/user/sessions/${sessionId}/revoke`
      );

      setMessage(res.data.message);

      setSessions((previous) =>
        previous.filter(
          (session) =>
            session._id !== sessionId
        )
      );
    } catch (error: any) {
      console.log(
        "REVOKE ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          t("failedToRevokeSession")
      );
    }
  };

  // =========================
  // GENERATE OTP
  // =========================

  const generateOTP = async () => {
    if (!email.trim()) {
      setMessage(
        t("pleaseEnterEmail")
      );
      return;
    }

    try {
      const res =
        await axiosInstance.post(
          "/user/generate-otp",
          {
            email,
          }
        );

      setMessage(
        `${res.data.message}. ${t(
          "checkBackendTerminal"
        )}`
      );
    } catch (error: any) {
      console.log(
        "OTP ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          t("failedToGenerateOtp")
      );
    }
  };

  // =========================
  // VERIFY OTP
  // =========================

  const verifyOTP = async () => {
    if (
      !email.trim() ||
      !otp.trim()
    ) {
      setMessage(
        t("enterEmailAndOtp")
      );
      return;
    }

    try {
      const res =
        await axiosInstance.post(
          "/user/verify-otp",
          {
            email,
            otp,
          }
        );

      setMessage(
        res.data.message
      );

      setOtp("");
    } catch (error: any) {
      console.log(
        "VERIFY OTP ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          t("otpVerificationFailed")
      );
    }
  };

  // =========================
  // GET TRUSTED DEVICES
  // =========================

  const getTrustedDevices =
    async () => {
      try {
        const res =
          await axiosInstance.get(
            "/user/trusted-devices"
          );

        setDevices(
          res.data.data || []
        );

        setMessage(
          t("trustedDevicesLoaded")
        );
      } catch (error: any) {
        console.log(
          "TRUSTED DEVICE ERROR:",
          error
        );

        setMessage(
          error.response?.data
            ?.message ||
            t(
              "failedToLoadTrustedDevices"
            )
        );
      }
    };

  // =========================
  // ADD TRUSTED DEVICE
  // =========================

  const addTrustedDevice =
    async () => {
      try {
        const res =
          await axiosInstance.post(
            "/user/trusted-device",
            {
              deviceName:
                deviceName ||
                "My Device",
            }
          );

        setMessage(
          res.data.message
        );

        setDeviceName("");

        getTrustedDevices();
      } catch (error: any) {
        console.log(
          "ADD DEVICE ERROR:",
          error
        );

        setMessage(
          error.response?.data
            ?.message ||
            t(
              "failedToAddTrustedDevice"
            )
        );
      }
    };

  // =========================
  // REMOVE TRUSTED DEVICE
  // =========================

  const removeTrustedDevice =
    async (
      deviceId: string
    ) => {
      try {
        const res =
          await axiosInstance.delete(
            `/user/trusted-devices/${deviceId}`
          );

        setMessage(
          res.data.message
        );

        setDevices(
          (previous) =>
            previous.filter(
              (device) =>
                device._id !==
                deviceId
            )
        );
      } catch (error: any) {
        console.log(
          "REMOVE DEVICE ERROR:",
          error
        );

        setMessage(
          error.response?.data
            ?.message ||
            t(
              "failedToRemoveTrustedDevice"
            )
        );
      }
    };

  // =========================
  // UI
  // =========================

  return (
    <Mainlayout>
      <main className="p-6 max-w-5xl mx-auto">

        {/* HEADER */}

        <h1 className="text-3xl font-semibold mb-2">
          {t("securityDeviceManagement")}
        </h1>

        <p className="text-gray-500 mb-6">
          {t("securityDescription")}
        </p>

        {/* MESSAGE */}

        {message && (
          <div className="mb-6 border rounded-lg bg-blue-50 text-blue-700 p-3">
            {message}
          </div>
        )}

        {/* =========================
            LOGIN HISTORY
        ========================= */}

        <section className="bg-white border rounded-xl p-5 mb-6">

          <div className="flex justify-between items-center mb-4">

            <div>

              <h2 className="text-xl font-semibold">
                {t("loginHistory")}
              </h2>

              <p className="text-sm text-gray-500">
                {t("loginHistoryDescription")}
              </p>

            </div>

            <button
              onClick={
                getLoginHistory
              }
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {t("viewHistory")}
            </button>

          </div>

          {loginHistory.length ===
          0 ? (
            <p className="text-gray-500">
              {t(
                "clickViewHistory"
              )}
            </p>
          ) : (
            <div className="space-y-3">

              {loginHistory.map(
                (login) => (
                  <div
                    key={login._id}
                    className="border rounded-lg p-4"
                  >

                    <div className="flex justify-between">

                      <p className="font-medium">

                        {login.status ===
                        "success"
                          ? t(
                              "successfulLogin"
                            )
                          : t(
                              "failedLogin"
                            )}

                      </p>

                      <span className="text-sm text-gray-500">

                        {login.loginTime
                          ? new Date(
                              login.loginTime
                            ).toLocaleString()
                          : ""}

                      </span>

                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                      {t("ipAddress")}:{" "}
                      {login.ipAddress ||
                        t("unknown")}
                    </p>

                    <p className="text-sm text-gray-600">
                      {t("device")}:{" "}
                      {login.userAgent ||
                        t("unknown")}
                    </p>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* =========================
            ACTIVE SESSIONS
        ========================= */}

        <section className="bg-white border rounded-xl p-5 mb-6">

          <div className="flex justify-between items-center mb-4">

            <div>

              <h2 className="text-xl font-semibold">
                {t("activeSessions")}
              </h2>

              <p className="text-sm text-gray-500">
                {t(
                  "activeSessionsDescription"
                )}
              </p>

            </div>

            <button
              onClick={getSessions}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {t("viewSessions")}
            </button>

          </div>

          {sessions.length ===
          0 ? (
            <p className="text-gray-500">
              {t("noActiveSessions")}
            </p>
          ) : (
            <div className="space-y-3">

              {sessions.map(
                (session) => (
                  <div
                    key={session._id}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >

                    <div>

                      <p className="font-medium">
                        💻{" "}
                        {t("activeDevice")}
                      </p>

                      <p className="text-sm text-gray-600">
                        {t("ip")}:{" "}
                        {session.ipAddress ||
                          t("unknown")}
                      </p>

                      <p className="text-sm text-gray-600">
                        {t("login")}:{" "}
                        {session.loginTime
                          ? new Date(
                              session.loginTime
                            ).toLocaleString()
                          : ""}
                      </p>

                      <p className="text-sm text-gray-500">
                        {session.userAgent ||
                          t("unknownDevice")}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        revokeSession(
                          session._id
                        )
                      }
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                    >
                      {t("revoke")}
                    </button>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* =========================
            OTP VERIFICATION
        ========================= */}

        <section className="bg-white border rounded-xl p-5 mb-6">

          <h2 className="text-xl font-semibold mb-1">
            {t("otpVerification")}
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            {t(
              "otpVerificationDescription"
            )}
          </p>

          {/* EMAIL */}

          <div className="flex gap-3 flex-wrap">

            <input
              type="email"
              placeholder={t(
                "enterYourEmail"
              )}
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="border rounded-lg px-3 py-2 flex-1 min-w-[220px]"
            />

            <button
              onClick={generateOTP}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {t("generateOtp")}
            </button>

          </div>

          {/* OTP */}

          <div className="flex gap-3 mt-3 flex-wrap">

            <input
              type="text"
              placeholder={t(
                "enterOtp"
              )}
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                )
              }
              className="border rounded-lg px-3 py-2 flex-1 min-w-[220px]"
            />

            <button
              onClick={verifyOTP}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {t("verifyOtp")}
            </button>

          </div>

        </section>

        {/* =========================
            TRUSTED DEVICES
        ========================= */}

        <section className="bg-white border rounded-xl p-5 mb-6">

          <div className="flex justify-between items-center mb-4">

            <div>

              <h2 className="text-xl font-semibold">
                {t("trustedDevices")}
              </h2>

              <p className="text-sm text-gray-500">
                {t(
                  "trustedDevicesDescription"
                )}
              </p>

            </div>

            <button
              onClick={
                getTrustedDevices
              }
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {t("viewDevices")}
            </button>

          </div>

          {/* ADD DEVICE */}

          <div className="flex gap-3 mb-5 flex-wrap">

            <input
              type="text"
              placeholder={t(
                "deviceNamePlaceholder"
              )}
              value={deviceName}
              onChange={(e) =>
                setDeviceName(
                  e.target.value
                )
              }
              className="border rounded-lg px-3 py-2 flex-1 min-w-[220px]"
            />

            <button
              onClick={
                addTrustedDevice
              }
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {t(
                "trustThisDevice"
              )}
            </button>

          </div>

          {devices.length ===
          0 ? (
            <p className="text-gray-500">
              {t(
                "noTrustedDevices"
              )}
            </p>
          ) : (
            <div className="space-y-3">

              {devices.map(
                (device) => (
                  <div
                    key={device._id}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >

                    <div>

                      <p className="font-medium">
                        💻{" "}
                        {
                          device.deviceName
                        }
                      </p>

                      <p className="text-sm text-gray-600">
                        {t("ip")}:{" "}
                        {device.ipAddress ||
                          t("unknown")}
                      </p>

                      <p className="text-sm text-gray-500">

                        {t("trusted")}:{" "}

                        {device.trustedAt
                          ? new Date(
                              device.trustedAt
                            ).toLocaleString()
                          : ""}

                      </p>

                    </div>

                    <button
                      onClick={() =>
                        removeTrustedDevice(
                          device._id
                        )
                      }
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                    >
                      {t("remove")}
                    </button>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </main>
    </Mainlayout>
  );
}