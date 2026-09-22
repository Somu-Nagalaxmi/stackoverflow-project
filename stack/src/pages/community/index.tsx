 import Mainlayout from "@/layout/Mainlayout";
import axiosInstance from "@/lib/axiosinstance";
import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Community() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [commentText, setCommentText] = useState<
    Record<string, string>
  >({});

  const [replyText, setReplyText] = useState<
    Record<string, string>
  >({});

  const [editText, setEditText] = useState<
    Record<string, string>
  >({});

  const [editMode, setEditMode] = useState<
    Record<string, boolean>
  >({});

  const [reportText, setReportText] = useState<
    Record<string, string>
  >({});

  const [showReport, setShowReport] = useState<
    Record<string, boolean>
  >({});

  const [searchHashtag, setSearchHashtag] = useState("");
  const [activeHashtag, setActiveHashtag] = useState("");

  const [notifications, setNotifications] = useState<any[]>(
    []
  );

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showTrending, setShowTrending] = useState(false);

  const [trendingPosts, setTrendingPosts] = useState<any[]>(
    []
  );

  const limit = 5;

  // =========================
  // CURRENT USER ID
  // =========================

  const currentUserId =
    user?._id ||
    user?.id ||
    user?.data?._id ||
    user?.data?.id;

  // =========================
  // FETCH POSTS
  // =========================

  const fetchPosts = async (
    pageNumber: number = 1
  ) => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/post/getallposts?page=${pageNumber}&limit=${limit}`
      );

      setPosts((previousPosts) => {
        if (pageNumber === 1) {
          return res.data.data || [];
        }

        return [
          ...previousPosts,
          ...(res.data.data || []),
        ];
      });

      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.log("FETCH POSTS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LIKE / UNLIKE
  // =========================

  const likePost = async (postId: string) => {
    try {
      const res = await axiosInstance.patch(
        `/post/like/${postId}`
      );

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes:
                  res.data.data?.likes || [],
              }
            : post
        )
      );
    } catch (error) {
      console.log("LIKE ERROR:", error);
    }
  };

  // =========================
  // ADD COMMENT
  // =========================

  const addComment = async (
    postId: string
  ) => {
    const text =
      commentText[postId]?.trim();

    if (!text) return;

    try {
      const res =
        await axiosInstance.post(
          `/post/comment/${postId}`,
          {
            commentbody: text,
          }
        );

      const newComment =
        res.data.data;

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments:
                  res.data.data?.comments ||
                  [
                    ...(post.comments || []),
                    newComment,
                  ],
              }
            : post
        )
      );

      setCommentText((previous) => ({
        ...previous,
        [postId]: "",
      }));
    } catch (error) {
      console.log(
        "COMMENT ERROR:",
        error
      );
    }
  };

  // =========================
  // ADD REPLY
  // =========================

  const addReply = async (
    postId: string,
    commentId: string
  ) => {
    const text =
      replyText[commentId]?.trim();

    if (!text) return;

    try {
      const res =
        await axiosInstance.post(
          `/post/reply/${postId}/${commentId}`,
          {
            replybody: text,
          }
        );

      const newReply =
        res.data.data;

      setPosts((previousPosts) =>
        previousPosts.map((post) => {
          if (post._id !== postId) {
            return post;
          }

          return {
            ...post,
            comments: (
              post.comments || []
            ).map(
              (comment: any) =>
                comment._id === commentId
                  ? {
                      ...comment,
                      replies:
                        res.data.data
                          ?.replies ||
                        [
                          ...(comment.replies ||
                            []),
                          newReply,
                        ],
                    }
                  : comment
            ),
          };
        })
      );

      setReplyText((previous) => ({
        ...previous,
        [commentId]: "",
      }));
    } catch (error) {
      console.log(
        "REPLY ERROR:",
        error
      );
    }
  };

  // =========================
  // BOOKMARK
  // =========================

  const bookmarkPost = async (
    postId: string
  ) => {
    try {
      const res =
        await axiosInstance.patch(
          `/post/bookmark/${postId}`
        );

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                bookmarks:
                  res.data.data
                    ?.bookmarks ||
                  post.bookmarks ||
                  [],
              }
            : post
        )
      );
    } catch (error) {
      console.log(
        "BOOKMARK ERROR:",
        error
      );
    }
  };

  // =========================
  // SHARE
  // =========================

  const sharePost = async (
    postId: string
  ) => {
    try {
      const res =
        await axiosInstance.patch(
          `/post/share/${postId}`
        );

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                shares:
                  res.data.data
                    ?.shares ??
                  (post.shares || 0) + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.log(
        "SHARE ERROR:",
        error
      );
    }
  };

  // =========================
  // EDIT POST
  // =========================

  const startEdit = (post: any) => {
    setEditMode((previous) => ({
      ...previous,
      [post._id]: true,
    }));

    setEditText((previous) => ({
      ...previous,
      [post._id]: post.content,
    }));
  };

  const cancelEdit = (
    postId: string
  ) => {
    setEditMode((previous) => ({
      ...previous,
      [postId]: false,
    }));
  };

  const editPost = async (
    postId: string
  ) => {
    const content =
      editText[postId]?.trim();

    if (!content) return;

    try {
      const res =
        await axiosInstance.patch(
          `/post/edit/${postId}`,
          {
            content,
          }
        );

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                ...res.data.data,
                content,
              }
            : post
        )
      );

      setEditMode((previous) => ({
        ...previous,
        [postId]: false,
      }));
    } catch (error) {
      console.log(
        "EDIT ERROR:",
        error
      );
    }
  };

  // =========================
  // DELETE POST
  // =========================

  const deletePost = async (
    postId: string
  ) => {
    const confirmDelete =
      window.confirm(
        t("confirmDeletePost")
      );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(
        `/post/delete/${postId}`
      );

      setPosts((previousPosts) =>
        previousPosts.filter(
          (post) =>
            post._id !== postId
        )
      );
    } catch (error) {
      console.log(
        "DELETE ERROR:",
        error
      );
    }
  };

  // =========================
  // FOLLOW / UNFOLLOW
  // =========================

  const followUser = async (
    targetUserId: string
  ) => {
    try {
      await axiosInstance.patch(
        `/user/follow/${targetUserId}`
      );

      alert(
        t("followStatusUpdated")
      );
    } catch (error) {
      console.log(
        "FOLLOW ERROR:",
        error
      );
    }
  };

  // =========================
  // REPORT POST
  // =========================

  const reportPost = async (
    postId: string
  ) => {
    const reason =
      reportText[postId]?.trim();

    if (!reason) {
      alert(
        t("enterReportReason")
      );
      return;
    }

    try {
      await axiosInstance.post(
        `/report/${postId}`,
        {
          reason,
        }
      );

      alert(
        t("postReportedSuccessfully")
      );

      setReportText((previous) => ({
        ...previous,
        [postId]: "",
      }));

      setShowReport((previous) => ({
        ...previous,
        [postId]: false,
      }));
    } catch (error) {
      console.log(
        "REPORT ERROR:",
        error
      );
    }
  };

  // =========================
  // NOTIFICATIONS
  // =========================

  const fetchNotifications =
    async () => {
      try {
        const res =
          await axiosInstance.get(
            "/notification/"
          );

        setNotifications(
          res.data.data || []
        );
      } catch (error) {
        console.log(
          "NOTIFICATION ERROR:",
          error
        );
      }
    };

  const markNotificationRead =
    async (
      notificationId: string
    ) => {
      try {
        await axiosInstance.patch(
          `/notification/${notificationId}/read`
        );

        setNotifications(
          (previous) =>
            previous.map(
              (notification) =>
                notification._id ===
                notificationId
                  ? {
                      ...notification,
                      isRead: true,
                    }
                  : notification
            )
        );
      } catch (error) {
        console.log(
          "READ NOTIFICATION ERROR:",
          error
        );
      }
    };

  // =========================
  // TRENDING POSTS
  // =========================

  const fetchTrending =
    async () => {
      try {
        const res =
          await axiosInstance.get(
            "/post/trending"
          );

        setTrendingPosts(
          res.data.data || []
        );

        setShowTrending(true);
      } catch (error) {
        console.log(
          "TRENDING ERROR:",
          error
        );
      }
    };

  // =========================
  // HASHTAG SEARCH
  // =========================

  const searchHashtagPosts =
    async () => {
      const hashtag =
        searchHashtag.trim();

      if (!hashtag) return;

      try {
        const cleanHashtag =
          hashtag.replace(
            /^#/,
            ""
          );

        const res =
          await axiosInstance.get(
            `/post/hashtag/${cleanHashtag}`
          );

        setPosts(
          res.data.data || []
        );

        setActiveHashtag(
          cleanHashtag
        );
      } catch (error) {
        console.log(
          "HASHTAG ERROR:",
          error
        );
      }
    };

  // =========================
  // CLEAR HASHTAG SEARCH
  // =========================

  const clearHashtagSearch =
    () => {
      setActiveHashtag("");
      setSearchHashtag("");
      setPage(1);
      fetchPosts(1);
    };

  // =========================
  // FIRST LOAD
  // =========================

  useEffect(() => {
    fetchPosts(1);
    fetchNotifications();
  }, []);

  // =========================
  // INFINITE SCROLL
  // =========================

  useEffect(() => {
    const handleScroll = () => {
      const reachedBottom =
        window.innerHeight +
          window.scrollY >=
        document.documentElement
          .scrollHeight -
          200;

      if (
        reachedBottom &&
        !loading &&
        page < totalPages &&
        !activeHashtag
      ) {
        setPage(
          (previousPage) =>
            previousPage + 1
        );
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [
    loading,
    page,
    totalPages,
    activeHashtag,
  ]);

  // =========================
  // LOAD NEXT PAGE
  // =========================

  useEffect(() => {
    if (
      page > 1 &&
      !activeHashtag
    ) {
      fetchPosts(page);
    }
  }, [page]);

  // =========================
  // UI
  // =========================

  return (
    <Mainlayout>
      <main className="p-6">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-6">

          <h1 className="text-2xl font-semibold">
            {t("communityFeed")}
          </h1>

          <div className="flex gap-2">

            {/* TRENDING */}

            <button
              onClick={fetchTrending}
              className="border rounded px-3 py-2 hover:bg-gray-100"
            >
              🔥 {t("trending")}
            </button>

            {/* NOTIFICATIONS */}

            <button
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              className="border rounded px-3 py-2 hover:bg-gray-100"
            >
              🔔 {t("notifications")}

              {notifications.filter(
                (n) => !n.isRead
              ).length > 0 && (
                <span className="ml-1 text-red-600">
                  (
                  {
                    notifications.filter(
                      (n) =>
                        !n.isRead
                    ).length
                  }
                  )
                </span>
              )}
            </button>

          </div>
        </div>

        {/* HASHTAG SEARCH */}

        <div className="flex gap-2 mb-6">

          <input
            type="text"
            placeholder={t(
              "searchHashtag"
            )}
            value={searchHashtag}
            onChange={(e) =>
              setSearchHashtag(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                searchHashtagPosts();
              }
            }}
            className="flex-1 border rounded px-3 py-2"
          />

          <button
            onClick={
              searchHashtagPosts
            }
            className="bg-blue-600 text-white rounded px-4 py-2"
          >
            {t("search")}
          </button>

          {activeHashtag && (
            <button
              onClick={
                clearHashtagSearch
              }
              className="border rounded px-4 py-2"
            >
              {t("clear")}
            </button>
          )}

        </div>

        {/* ACTIVE HASHTAG */}

        {activeHashtag && (
          <p className="mb-4 text-gray-600">
            {t("resultsFor")} #
            {activeHashtag}
          </p>
        )}

        {/* NOTIFICATIONS */}

        {showNotifications && (
          <div className="border rounded-lg p-4 mb-6 bg-white">

            <div className="flex justify-between mb-3">

              <h2 className="font-semibold">
                {t("notifications")}
              </h2>

              <button
                onClick={() =>
                  setShowNotifications(
                    false
                  )
                }
                className="text-gray-500"
              >
                ✕
              </button>

            </div>

            {notifications.length ===
            0 ? (
              <p className="text-gray-500">
                {t("noNotifications")}
              </p>
            ) : (
              <div className="space-y-2">

                {notifications.map(
                  (notification) => (
                    <div
                      key={
                        notification._id
                      }
                      onClick={() =>
                        markNotificationRead(
                          notification._id
                        )
                      }
                      className={`border rounded p-3 cursor-pointer ${
                        notification.isRead
                          ? "bg-white"
                          : "bg-blue-50"
                      }`}
                    >

                      <p className="text-sm">
                        {
                          notification.message
                        }
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {
                          notification.type
                        }
                      </p>

                    </div>
                  )
                )}

              </div>
            )}

          </div>
        )}

        {/* TRENDING */}

        {showTrending && (
          <div className="border rounded-lg p-4 mb-6 bg-white">

            <div className="flex justify-between mb-3">

              <h2 className="font-semibold">
                🔥 {t("trendingPosts")}
              </h2>

              <button
                onClick={() =>
                  setShowTrending(false)
                }
                className="text-gray-500"
              >
                ✕
              </button>

            </div>

            {trendingPosts.length ===
            0 ? (
              <p className="text-gray-500">
                {t("noTrendingPosts")}
              </p>
            ) : (
              <div className="space-y-3">

                {trendingPosts.map(
                  (post) => (
                    <div
                      key={post._id}
                      className="border rounded p-3"
                    >

                      <p className="font-medium">
                        {
                          post.userposted
                        }
                      </p>

                      <p className="text-sm mt-1">
                        {post.content}
                      </p>

                      <p className="text-xs text-gray-500 mt-2">

                        ❤️{" "}
                        {
                          post.likes
                            ?.length || 0
                        }{" "}
                        {t("likes")} • 💬{" "}

                        {
                          post.comments
                            ?.length || 0
                        }{" "}
                        {t("comments")} • 🔗{" "}

                        {post.shares || 0}{" "}
                        {t("shares")}

                      </p>

                    </div>
                  )
                )}

              </div>
            )}

          </div>
        )}

        {/* NO POSTS */}

        {posts.length === 0 &&
          !loading && (
            <p className="text-gray-500">
              {t("noPostsFound")}
            </p>
          )}

        {/* POSTS */}

        <div className="space-y-5">

          {posts.map((post) => {

            const isOwner =
              currentUserId &&
              String(
                post.userid
              ) ===
                String(
                  currentUserId
                );

            const isBookmarked =
              currentUserId &&
              post.bookmarks?.includes(
                String(
                  currentUserId
                )
              );

            return (
              <div
                key={post._id}
                className="border rounded-lg p-5 bg-white shadow-sm"
              >

                {/* USER HEADER */}

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="font-semibold text-lg">
                      {
                        post.userposted
                      }
                    </h2>

                    <p className="text-xs text-gray-500">
                      {post.createdAt
                        ? new Date(
                            post.createdAt
                          ).toLocaleString()
                        : ""}
                    </p>

                  </div>

                  {/* FOLLOW */}

                  {!isOwner &&
                    post.userid && (
                      <button
                        onClick={() =>
                          followUser(
                            post.userid
                          )
                        }
                        className="border rounded px-3 py-1 text-sm hover:bg-gray-100"
                      >
                        👤 {t("follow")}
                      </button>
                    )}

                </div>

                {/* EDIT MODE */}

                {editMode[
                  post._id
                ] ? (
                  <div className="mt-4">

                    <textarea
                      value={
                        editText[
                          post._id
                        ] || ""
                      }
                      onChange={(e) =>
                        setEditText(
                          (previous) => ({
                            ...previous,
                            [post._id]:
                              e.target.value,
                          })
                        )
                      }
                      className="w-full border rounded p-3 min-h-[100px]"
                    />

                    <div className="flex gap-2 mt-2">

                      <button
                        onClick={() =>
                          editPost(
                            post._id
                          )
                        }
                        className="bg-blue-600 text-white rounded px-4 py-2"
                      >
                        {t("save")}
                      </button>

                      <button
                        onClick={() =>
                          cancelEdit(
                            post._id
                          )
                        }
                        className="border rounded px-4 py-2"
                      >
                        {t("cancel")}
                      </button>

                    </div>

                  </div>
                ) : (
                  <p className="mt-3 whitespace-pre-wrap">
                    {post.content}
                  </p>
                )}

                {/* CODE */}

                {post.code && (
                  <pre className="bg-gray-100 p-3 mt-4 rounded overflow-x-auto">
                    <code>
                      {post.code}
                    </code>
                  </pre>
                )}

                {/* HASHTAGS */}

                {post.hashtags?.length >
                  0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">

                    {post.hashtags.map(
                      (
                        tag: string
                      ) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSearchHashtag(
                              tag
                            );
                            searchHashtagPosts();
                          }}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
                        >
                          #{tag}
                        </button>
                      )
                    )}

                  </div>
                )}

                {/* ACTIONS */}

                <div className="mt-5 flex items-center gap-2 flex-wrap">

                  {/* LIKE */}

                  <button
                    onClick={() =>
                      likePost(
                        post._id
                      )
                    }
                    className="border rounded px-3 py-1 hover:bg-gray-100"
                  >
                    ❤️{" "}
                    {
                      post.likes
                        ?.length || 0
                    }
                  </button>

                  {/* COMMENT COUNT */}

                  <span className="border rounded px-3 py-1 text-sm">
                    💬{" "}
                    {
                      post.comments
                        ?.length || 0
                    }
                  </span>

                  {/* SHARE */}

                  <button
                    onClick={() =>
                      sharePost(
                        post._id
                      )
                    }
                    className="border rounded px-3 py-1 hover:bg-gray-100"
                  >
                    🔗 {t("share")}{" "}
                    {post.shares || 0}
                  </button>

                  {/* BOOKMARK */}

                  <button
                    onClick={() =>
                      bookmarkPost(
                        post._id
                      )
                    }
                    className={`border rounded px-3 py-1 hover:bg-gray-100 ${
                      isBookmarked
                        ? "bg-yellow-100"
                        : ""
                    }`}
                  >
                    🔖{" "}
                    {isBookmarked
                      ? t("saved")
                      : t("bookmark")}
                  </button>

                  {/* EDIT */}

                  {isOwner && (
                    <button
                      onClick={() =>
                        startEdit(
                          post
                        )
                      }
                      className="border rounded px-3 py-1 hover:bg-gray-100"
                    >
                      ✏️ {t("edit")}
                    </button>
                  )}

                  {/* DELETE */}

                  {isOwner && (
                    <button
                      onClick={() =>
                        deletePost(
                          post._id
                        )
                      }
                      className="border border-red-300 text-red-600 rounded px-3 py-1 hover:bg-red-50"
                    >
                      🗑️ {t("delete")}
                    </button>
                  )}

                  {/* REPORT */}

                  {!isOwner && (
                    <button
                      onClick={() =>
                        setShowReport(
                          (previous) => ({
                            ...previous,
                            [post._id]:
                              !previous[
                                post._id
                              ],
                          })
                        )
                      }
                      className="border rounded px-3 py-1 hover:bg-gray-100"
                    >
                      🚨 {t("report")}
                    </button>
                  )}

                </div>

                {/* REPORT BOX */}

                {showReport[
                  post._id
                ] && (
                  <div className="mt-4 border rounded p-3 bg-gray-50">

                    <textarea
                      placeholder={t(
                        "reportReason"
                      )}
                      value={
                        reportText[
                          post._id
                        ] || ""
                      }
                      onChange={(e) =>
                        setReportText(
                          (previous) => ({
                            ...previous,
                            [post._id]:
                              e.target.value,
                          })
                        )
                      }
                      className="w-full border rounded p-2"
                    />

                    <button
                      onClick={() =>
                        reportPost(
                          post._id
                        )
                      }
                      className="mt-2 bg-red-600 text-white rounded px-4 py-2"
                    >
                      {t("submitReport")}
                    </button>

                  </div>
                )}

                {/* COMMENT INPUT */}

                <div className="mt-5 flex gap-2">

                  <input
                    type="text"
                    placeholder={t(
                      "writeComment"
                    )}
                    value={
                      commentText[
                        post._id
                      ] || ""
                    }
                    onChange={(e) =>
                      setCommentText(
                        (previous) => ({
                          ...previous,
                          [post._id]:
                            e.target.value,
                        })
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                        "Enter"
                      ) {
                        addComment(
                          post._id
                        );
                      }
                    }}
                    className="flex-1 border rounded px-3 py-2"
                  />

                  <button
                    onClick={() =>
                      addComment(
                        post._id
                      )
                    }
                    className="bg-blue-600 text-white rounded px-4 py-2"
                  >
                    {t("comment")}
                  </button>

                </div>

                {/* COMMENTS */}

                {post.comments?.length >
                  0 && (
                  <div className="mt-5 space-y-3">

                    <h3 className="font-semibold text-sm">
                      {t("comments")}
                    </h3>

                    {post.comments.map(
                      (
                        comment: any
                      ) => (
                        <div
                          key={
                            comment._id
                          }
                          className="bg-gray-50 border rounded p-3"
                        >

                          {/* COMMENT */}

                          <p className="font-medium text-sm">
                            {
                              comment.usercommented
                            }
                          </p>

                          <p className="text-sm mt-1">
                            {
                              comment.commentbody
                            }
                          </p>

                          {/* REPLY */}

                          <div className="mt-3 flex gap-2">

                            <input
                              type="text"
                              placeholder={t(
                                "writeReply"
                              )}
                              value={
                                replyText[
                                  comment._id
                                ] || ""
                              }
                              onChange={(e) =>
                                setReplyText(
                                  (previous) => ({
                                    ...previous,
                                    [comment._id]:
                                      e.target.value,
                                  })
                                )
                              }
                              onKeyDown={(
                                e
                              ) => {
                                if (
                                  e.key ===
                                  "Enter"
                                ) {
                                  addReply(
                                    post._id,
                                    comment._id
                                  );
                                }
                              }}
                              className="flex-1 border rounded px-3 py-1 text-sm"
                            />

                            <button
                              onClick={() =>
                                addReply(
                                  post._id,
                                  comment._id
                                )
                              }
                              className="border rounded px-3 py-1 text-sm"
                            >
                              {t("reply")}
                            </button>

                          </div>

                          {/* REPLIES */}

                          {comment.replies
                            ?.length >
                            0 && (
                            <div className="ml-6 mt-3 space-y-2">

                              {comment.replies.map(
                                (
                                  reply: any
                                ) => (
                                  <div
                                    key={
                                      reply._id
                                    }
                                    className="border-l-2 pl-3"
                                  >

                                    <p className="font-medium text-xs">
                                      {
                                        reply.userreplied
                                      }
                                    </p>

                                    <p className="text-sm">
                                      {
                                        reply.replybody
                                      }
                                    </p>

                                  </div>
                                )
                              )}

                            </div>
                          )}

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>
            );
          })}

        </div>

        {/* LOADING */}

        {loading && (
          <div className="text-center py-6 text-gray-500">
            {t("loadingMorePosts")}
          </div>
        )}

        {/* END */}

        {!loading &&
          posts.length > 0 &&
          page >= totalPages &&
          !activeHashtag && (
            <div className="text-center py-6 text-gray-500">
              {t("noMorePosts")}
            </div>
          )}

      </main>
    </Mainlayout>
  );
}