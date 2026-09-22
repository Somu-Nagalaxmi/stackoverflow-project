import notification from "../models/notification.js";

// Get my notifications
export const getnotifications = async (req, res) => {
  try {
    const notifications = await notification
      .find({ recipient: req.userid })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Mark notification as read
export const marknotificationread = async (req, res) => {
  const { id: _id } = req.params;

  try {
    const notificationDoc = await notification.findById(_id);

    if (!notificationDoc) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    // Only recipient can mark it as read
    if (notificationDoc.recipient !== req.userid) {
      return res.status(403).json({
        message: "You cannot update this notification",
      });
    }

    notificationDoc.isRead = true;

    await notificationDoc.save();

    res.status(200).json({
      message: "Notification marked as read",
      data: notificationDoc,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};