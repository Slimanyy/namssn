import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Category from '../models/categoryModel.js';
import Payment from '../models/paymentModel.js';
import Blog from '../models/blogModel.js';
import Announcement from '../models/announcementModel.js'
import { verifyPayments } from '../utils/paymentLogic.js';
import Event from '../models/eventModel.js';


// @desc Make a user an admin
// Route PUT /api/v1/admin/users/makeadmin/:userId
// Access Private (only accessible to admin users)
const makeUserAdmin = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if the user is already an admin
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('User is already an admin');
  }

  // Make the user an admin
  user.role = 'admin';

  // Save the updated user
  await user.save();

  res.status(200).json({ message: 'User is now an admin' });
});


// @desc Remove admin privileges from a user
// Route PUT /api/v1/admin/users/removeadmin/:userId
// Access Private (only accessible to admin users)
const removeAdmin = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if the user is not an admin
  if (user.role !== 'admin') {
    res.status(400);
    throw new Error('User is not an admin');
  }

  // Remove admin privileges from the user
  user.role = 'user';

  // Save the updated user
  await user.save();

  res.status(200).json({ message: 'User is no longer an admin' });
});


// @desc Create a new blog
// Route POST /api/v1/admin/blogs
// Access Private (only accessible to admin users)
const createBlog = asyncHandler(async (req, res) => {
  const { title, coverImage, content, tags, author  } = req.body;

  // You can access the currently logged-in user's information from req.user
  const userId = req.user._id;

  // Create a new blog
  const newBlog = new Blog({
    title,
    coverImage,
    content,
    tags,
    author,
    user: userId, // Associate the blog with the user who created it
  });

  // Save the new blog to the database
  const createdBlog = await newBlog.save();

  res.status(201).json(createdBlog);
});

// @desc Get user's blogs (My Blogs)
// Route GET /api/v1/admin/blogs
// Access Private (only accessible to admin users)
const getUserBlogs = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the user ID from the authenticated user

  // Fetch the user's blogs from the database
  const userBlogs = await Blog.find({ user: userId })
    .sort({ timestamp: -1 }); // Sort by timestamp in descending order (latest blogs first)

  res.status(200).json(userBlogs);
});

// @desc	Update user blog
// Route	PUT  /api/v1/admin/blogs
// access	Private (only accessible to admin users)
const updateBlog = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Update a Blog' });
});

// @desc	Delete user blog
// Route	DELETE  /api/v1/admin/blogs
// access	Private (only accessible to admin users)
const deleteBlog = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Delete Blog' });
});


// @desc Create a new payment category
// Route POST /api/v1/admin/payments
// Access Private (only accessible to admin users)  
const createCategory = asyncHandler(async (req, res) => {
  const { name, session, amount } = req.body;
  const addCategory = new Category(
    {
      name,
      session,
      amount,
    }
  )
  const createdCategory = await addCategory.save();
  res.status(201).json(createdCategory)
});

// @desc Delete a single payment category
// Route DELETE /api/v1/admin/payments/:id
// Access Private (only accessible to admin users)
const deleteCategory = asyncHandler(async (req, res) => {
  const { name, session, amount } = req.body;

  try {
    // Step 1: Find the category that matches the criteria
    const category = await Category.findOne({ name, amount, session }).exec();

    if (!category) {
      // Step 2: Handle the case where no matching category is found
      return res.status(404).json({ message: 'Category not found' });
    }
    const categoryId = category._id

    // Step 3: If the category is found, remove it
    await Category.deleteOne(categoryId)

    // Step 4: Handle success response
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    // Step 5: Handle any errors that occur during removal
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// @desc Show all payment status for last 10 users
// Route GET /api/v1/admin/payments
// Access Private (only accessible to admin users)
const getPaymentStatus = asyncHandler(async (req, res) => {
  try {
    await verifyPayments(req, res);
  } catch (error) {
    console.log(error);
  }
});


// @desc Get all payments for all users
// Route GET /api/v1/admin/payments
// Access Private (only accessible to admin users)
const getAllPayments = asyncHandler(async (req, res) => {
  // Fetch all payment records from the payment model
  const allPayments = await Payment.find().populate('user');
  res.status(200).json(allPayments);
  });


// Create Announcement
const createAnnouncement = asyncHandler(async (req, res) => {
  const { text, level } = req.body; // Add level to the destructured request body
  const userId = req.user._id;

  // Create a new announcement
  const newAnnouncement = new Announcement({
    text,
    level, // Set the level field with the value from the request body
    user: userId, // Associate the announcement with the user who created it
  });

  // Save the new announcement to the database
  const createdAnnouncement = await newAnnouncement.save();

  res.status(201).json(createdAnnouncement);
});

// Update Announcement
const updateAnnouncement = asyncHandler(async (req, res) => {
  const { text, level } = req.body; // Add level to the destructured request body
  const announcementId = req.params.announcementId;

  // Find the announcement by ID
  const announcement = await Announcement.findById(announcementId);

  if (!announcement) {
    res.status(404);
    throw new Error('Announcement not found');
  }

  // Check if the user has permission to update this announcement (e.g., they are the owner or an admin)
  if (announcement.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Unauthorized to update this announcement');
  }

  // Update the announcement
  announcement.text = text;
  announcement.level = level; // Update the level field
  const updatedAnnouncement = await announcement.save();

  res.status(200).json(updatedAnnouncement);
});

// Delete Announcement
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcementId = req.params.announcementId;

  // Find the announcement by ID
  const announcement = await Announcement.findById(announcementId);

  if (!announcement) {
    res.status(404);
    throw new Error('Announcement not found');
  }

  // Check if the user has permission to delete this announcement (e.g., they are the owner or an admin)
  if (announcement.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Unauthorized to delete this announcement');
  }

  // Delete the announcement
  await announcement.remove();

  res.status(200).json({ message: 'Announcement deleted' });
});


// Create Event
const createEvent = asyncHandler(async (req, res) => {
  const { image } = req.body; // You can add more event properties as needed
  const userId = req.user._id;

  // Create a new event
  const newEvent = new Event({
    image,
    user: userId, // Associate the event with the user who created it
  });

  // Save the new event to the database
  const createdEvent = await newEvent.save();

  res.status(201).json(createdEvent);
});

// Get User's Events (My Events)
const getUserEvents = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the user ID from the authenticated user

  // Fetch the user's events from the database
  const userEvents = await Event.find({ user: userId }).sort({ createdAt: -1 }); // Sort by creation date in descending order (latest first)

  res.status(200).json(userEvents);
});

// Update Event
const updateEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId; // Get the event ID from the request parameters
  const { image } = req.body;

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      // Event not found
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user making the request is the owner of the event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this event' });
    }

    // Update the event's image
    event.image = image;

    // Save the updated event
    const updatedEvent = await event.save();

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete Event
const deleteEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;

  // Find the event by ID
  const event = await Event.findById(eventId);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if the user has permission to delete this event (e.g., they are the owner)
  if (event.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Unauthorized to delete this event');
  }

  // Delete the event
  await event.remove();

  res.status(200).json({ message: 'Event deleted' });
});

  // Save the new announcement to the database

export {
  getAllPayments,
  createBlog,
  getUserBlogs,
  updateBlog,
  deleteBlog,
  createCategory,
  deleteCategory,
  getPaymentStatus,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  createEvent,
  getUserEvents,
  updateEvent,
  deleteEvent,
  makeUserAdmin,
  removeAdmin,
};
