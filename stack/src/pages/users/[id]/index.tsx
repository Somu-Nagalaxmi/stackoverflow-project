  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Mainlayout from "@/layout/Mainlayout";
import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import {
  Calendar,
  Edit,
  Plus,
  X,
  CreditCard,
  Download,
  Crown,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const getUserData = (id: string) => {
  const users = {
    "1": {
      id: 1,
      name: "John Doe",
      joinDate: "2019-03-15",
      about:
        "Full-stack developer with 8+ years of experience in JavaScript, React, and Node.js. Passionate about clean code and helping others learn programming. I enjoy working on open-source projects and contributing to the developer community.",
      tags: [
        "javascript",
        "react",
        "node.js",
        "typescript",
        "python",
        "mongodb",
      ],
    },
  };

  return users[id as keyof typeof users] || users["1"];
};

const index = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [users, setusers] = useState<any>(null);
  const [loading, setloading] = useState(true);

  const [isEditing, setIsEditing] =
    useState(false);

  const [editForm, setEditForm] = useState({
    name: users?.name || "",
    about: users?.about || "",
    tags: users?.tags || [],
  });

  const [newTag, setNewTag] = useState("");

  // =====================================================
  // TASK 5 - SUBSCRIPTION STATES
  // =====================================================

  const [subscription, setSubscription] =
    useState<any>(null);

  const [payments, setPayments] =
    useState<any[]>([]);

  const [subscriptionLoading, setSubscriptionLoading] =
    useState(false);

  // =====================================================
  // FETCH USER + SUBSCRIPTION
  // =====================================================

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const res =
          await axiosInstance.get(
            "/user/getalluser"
          );

        const matcheduser =
          res.data.data.find(
            (u: any) => u._id === id
          );

        setusers(matcheduser);

        // Load subscription only for own profile
        if (
          matcheduser &&
          user?._id &&
          matcheduser._id === user._id
        ) {
          setSubscriptionLoading(true);

          try {
            // Current subscription
            const subscriptionRes =
              await axiosInstance.get(
                "/subscription/my"
              );

            setSubscription(
              subscriptionRes.data
                ?.userSubscription || null
            );

            // Payment history
            const paymentRes =
              await axiosInstance.get(
                "/subscription/payments"
              );

            setPayments(
              paymentRes.data?.payments || []
            );
          } catch (subscriptionError) {
            console.log(
              "Subscription loading error:",
              subscriptionError
            );
          } finally {
            setSubscriptionLoading(false);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    if (id) {
      fetchuser();
    }
  }, [id, user?._id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Mainlayout>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </Mainlayout>
    );
  }

  // =====================================================
  // USER NOT FOUND
  // =====================================================

  if (!users || users.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">
        No user found.
      </div>
    );
  }

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSaveProfile = async () => {
    try {
      const res =
        await axiosInstance.patch(
          `/user/update/${user?._id}`,
          {
            editForm,
          }
        );

      if (res.data.data) {
        const updatedUser = {
          ...users,
          name: editForm.name,
          about: editForm.about,
          tags: editForm.tags,
        };

        setusers(updatedUser);
        setIsEditing(false);

        toast.success(
          "Profile updated successfully!"
        );
      }
    } catch (error) {
      console.log(error);

      toast.error(
        "Something went wrong"
      );
    }
  };

  // =====================================================
  // ADD TAG
  // =====================================================

  const handleAddTag = () => {
    const trimmedTag =
      newTag.trim();

    if (
      trimmedTag &&
      !editForm.tags.includes(trimmedTag)
    ) {
      setEditForm({
        ...editForm,
        tags: [
          ...editForm.tags,
          trimmedTag,
        ],
      });

      setNewTag("");
    }
  };

  // =====================================================
  // REMOVE TAG
  // =====================================================

  const handleRemoveTag = (
    tagToRemove: string
  ) => {
    setEditForm({
      ...editForm,
      tags: editForm.tags.filter(
        (tag: any) =>
          tag !== tagToRemove
      ),
    });
  };

  // =====================================================
  // DOWNLOAD INVOICE
  // =====================================================

  const handleDownloadInvoice = async (
    paymentId: string
  ) => {
    try {
      const response =
        await axiosInstance.get(
          `/subscription/invoice/${paymentId}`,
          {
            responseType: "blob",
          }
        );

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "subscription-invoice.pdf"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(
        "Invoice download error:",
        error
      );

      toast.error(
        "Unable to download invoice"
      );
    }
  };

  // =====================================================
  // PROFILE CHECK
  // =====================================================

  const currentUserId =
    user?._id;

  const isOwnProfile =
    id === currentUserId;

  // =====================================================
  // PLAN BADGE
  // =====================================================

  const getPlanBadgeClass = () => {
    if (
      subscription?.plan === "Gold"
    ) {
      return "bg-yellow-500 text-white";
    }

    if (
      subscription?.plan === "Silver"
    ) {
      return "bg-gray-500 text-white";
    }

    if (
      subscription?.plan === "Bronze"
    ) {
      return "bg-orange-600 text-white";
    }

    return "";
  };

  return (
    <Mainlayout>
      <div className="max-w-6xl">

        {/* =====================================================
            USER HEADER
        ===================================================== */}

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-8">

          <Avatar className="w-24 h-24 lg:w-32 lg:h-32">
            <AvatarFallback className="text-2xl lg:text-3xl">
              {users.name
                .split(" ")
                .map((n: any) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">

              <div>

                {/* NAME + PLAN BADGE */}

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
                    {users.name}
                  </h1>

                  {isOwnProfile &&
                    subscription &&
                    subscription.plan !==
                      "Free" && (
                      <Badge
                        className={`flex items-center gap-1 ${getPlanBadgeClass()}`}
                      >
                        <Crown className="w-3 h-3" />

                        {subscription.plan}
                      </Badge>
                    )}

                </div>

              </div>

              {/* EDIT PROFILE */}

              {isOwnProfile && (
                <Dialog
                  open={isEditing}
                  onOpenChange={
                    setIsEditing
                  }
                >

                  <DialogTrigger asChild>

                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Edit className="w-4 h-4" />

                      Edit Profile
                    </Button>

                  </DialogTrigger>

                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-gray-900">

                    <DialogHeader>
                      <DialogTitle>
                        Edit Profile
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">

                      {/* BASIC INFORMATION */}

                      <div className="space-y-4">

                        <h3 className="text-lg font-semibold">
                          Basic Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                          <div>

                            <Label htmlFor="name">
                              Display Name
                            </Label>

                            <Input
                              id="name"
                              value={
                                editForm.name
                              }
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  name: e.target
                                    .value,
                                })
                              }
                              placeholder="Your display name"
                            />

                          </div>

                        </div>

                      </div>

                      {/* ABOUT */}

                      <div className="space-y-4">

                        <h3 className="text-lg font-semibold">
                          About
                        </h3>

                        <div>

                          <Label htmlFor="about">
                            About Me
                          </Label>

                          <Textarea
                            id="about"
                            value={
                              editForm.about
                            }
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                about:
                                  e.target.value,
                              })
                            }
                            placeholder="Tell us about yourself, your experience, and interests..."
                            className="min-h-32"
                          />

                        </div>

                      </div>

                      {/* TAGS */}

                      <div className="space-y-4">

                        <h3 className="text-lg font-semibold">
                          Skills & Technologies
                        </h3>

                        <div className="space-y-3">

                          <div className="flex gap-2">

                            <Input
                              value={newTag}
                              onChange={(e) =>
                                setNewTag(
                                  e.target.value
                                )
                              }
                              placeholder="Add a skill or technology"
                              onKeyPress={(e) =>
                                e.key ===
                                  "Enter" &&
                                handleAddTag()
                              }
                            />

                            <Button
                              onClick={
                                handleAddTag
                              }
                              variant="outline"
                              size="sm"
                              className="bg-orange-600 text-white"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>

                          </div>

                          <div className="flex flex-wrap gap-2">

                            {editForm.tags.map(
                              (tag: any) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-orange-100 text-orange-800 flex items-center gap-1"
                                >
                                  {tag}

                                  <button
                                    onClick={() =>
                                      handleRemoveTag(
                                        tag
                                      )
                                    }
                                    className="ml-1 hover:text-red-600"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>

                                </Badge>
                              )
                            )}

                          </div>

                        </div>

                      </div>

                      {/* ACTION BUTTONS */}

                      <div className="flex justify-end gap-3 pt-4 border-t">

                        <Button
                          variant="outline"
                          onClick={() =>
                            setIsEditing(false)
                          }
                          className="bg-white text-gray-800 hover:text-gray-900"
                        >
                          Cancel
                        </Button>

                        <Button
                          onClick={
                            handleSaveProfile
                          }
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Save Changes
                        </Button>

                      </div>

                    </div>

                  </DialogContent>

                </Dialog>
              )}

            </div>

            {/* MEMBER SINCE */}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">

              <div className="flex items-center">

                <Calendar className="w-4 h-4 mr-1" />

                Member since{" "}

                {new Date(
                  users.joinDate
                )
                  .toISOString()
                  .split("T")[0]}

              </div>

            </div>

            {/* BADGE COUNTS */}

            <div className="flex flex-wrap items-center space-x-6 text-sm">

              <div className="flex items-center">

                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>

                <span className="font-semibold">
                  5
                </span>

                <span className="text-gray-600 ml-1">
                  gold badges
                </span>

              </div>

              <div className="flex items-center">

                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>

                <span className="font-semibold">
                  23
                </span>

                <span className="text-gray-600 ml-1">
                  silver badges
                </span>

              </div>

              <div className="flex items-center">

                <div className="w-3 h-3 bg-amber-600 rounded-full mr-2"></div>

                <span className="font-semibold">
                  45
                </span>

                <span className="text-gray-600 ml-1">
                  bronze badges
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            TASK 5 - SUBSCRIPTION DASHBOARD
        ===================================================== */}

        {isOwnProfile && (
          <Card className="mb-6">

            <CardHeader>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                <CardTitle className="flex items-center gap-2">

                  <CreditCard className="w-5 h-5" />

                  Subscription & Premium Membership

                </CardTitle>

                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(
                      "/subscription"
                    )
                  }
                >
                  Manage Plan
                </Button>

              </div>

            </CardHeader>

            <CardContent>

              {subscriptionLoading ? (
                <p className="text-gray-500">
                  Loading subscription details...
                </p>
              ) : (
                <>

                  {/* SUBSCRIPTION SUMMARY */}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* PLAN */}

                    <div className="rounded-lg border p-4">

                      <p className="text-sm text-gray-500">
                        Current Plan
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {subscription?.plan ||
                          "Free"}
                      </p>

                    </div>

                    {/* STATUS */}

                    <div className="rounded-lg border p-4">

                      <p className="text-sm text-gray-500">
                        Status
                      </p>

                      <p className="mt-1 text-xl font-bold capitalize">
                        {subscription?.status ||
                          "inactive"}
                      </p>

                    </div>

                    {/* RENEWAL DATE */}

                    <div className="rounded-lg border p-4">

                      <p className="text-sm text-gray-500">
                        Renewal Date
                      </p>

                      <p className="mt-1 font-semibold">

                        {subscription?.renewalDate
                          ? new Date(
                              subscription.renewalDate
                            ).toLocaleDateString()
                          : "Not available"}

                      </p>

                    </div>

                    {/* BILLING EMAIL */}

                    <div className="rounded-lg border p-4">

                      <p className="text-sm text-gray-500">
                        Billing Email
                      </p>

                      <p className="mt-1 font-semibold break-all">

                        {subscription?.billingEmail ||
                          users.email ||
                          "Not available"}

                      </p>

                    </div>

                  </div>

                  {/* BILLING DETAILS */}

                  <div className="mt-6 rounded-lg bg-gray-50 p-4">

                    <h3 className="font-semibold text-lg mb-3">
                      Billing Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

                      <div>

                        <p className="text-gray-500">
                          Name
                        </p>

                        <p className="font-medium">
                          {subscription?.billingName ||
                            users.name ||
                            "Not available"}
                        </p>

                      </div>

                      <div>

                        <p className="text-gray-500">
                          Email
                        </p>

                        <p className="font-medium break-all">
                          {subscription?.billingEmail ||
                            users.email ||
                            "Not available"}
                        </p>

                      </div>

                      <div>

                        <p className="text-gray-500">
                          Phone
                        </p>

                        <p className="font-medium">
                          {subscription?.billingPhone ||
                            "Not available"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* PAYMENT HISTORY */}

                  <div className="mt-6">

                    <h3 className="font-semibold text-lg mb-3">
                      Payment History
                    </h3>

                    {payments.length === 0 ? (

                      <p className="text-sm text-gray-500">
                        No payment history available.
                      </p>

                    ) : (

                      <div className="space-y-3">

                        {payments.map(
                          (payment: any) => (

                            <div
                              key={
                                payment._id
                              }
                              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg p-4"
                            >

                              <div>

                                <p className="font-semibold">
                                  {payment.plan} Plan
                                </p>

                                <p className="text-sm text-gray-500">
                                  ₹
                                  {
                                    payment.amount
                                  }
                                </p>

                                <p className="text-sm text-gray-500">

                                  {payment.paymentDate
                                    ? new Date(
                                        payment.paymentDate
                                      ).toLocaleDateString()
                                    : ""}

                                </p>

                                <p className="text-xs text-gray-500">

                                  Invoice:{" "}

                                  {
                                    payment.invoiceNumber
                                  }

                                </p>

                              </div>

                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleDownloadInvoice(
                                    payment._id
                                  )
                                }
                                className="flex items-center gap-2"
                              >

                                <Download className="w-4 h-4" />

                                Download Invoice

                              </Button>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                </>
              )}

            </CardContent>

          </Card>
        )}

        {/* =====================================================
            ABOUT + TOP TAGS
        ===================================================== */}

        <div className="grid grid-cols-1 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <Card>

              <CardHeader>
                <CardTitle>
                  About
                </CardTitle>
              </CardHeader>

              <CardContent>

                <div className="prose max-w-none">

                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {users.about}
                  </p>

                </div>

              </CardContent>

            </Card>

          </div>

          <div className="space-y-6">

            <Card>

              <CardHeader>
                <CardTitle>
                  Top Tags
                </CardTitle>
              </CardHeader>

              <CardContent>

                <div className="space-y-3">

                  {users.tags.map(
                    (tag: string) => (

                      <div
                        key={tag}
                        className="flex items-center justify-between"
                      >

                        <div>

                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                          >
                            {tag}
                          </Badge>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </CardContent>

            </Card>

          </div>

        </div>

      </div>
    </Mainlayout>
  );
};

export default index;