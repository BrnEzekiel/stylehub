const express = require('express');
const router = express.Router();
const stayController = require('../controllers/stayController');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Stay routes
router.post('/', 
  upload.array('images', 10), // Max 10 images
  stayController.createStay
);

router.get('/', stayController.getStays);
router.get('/search', stayController.searchStays);
router.get('/my-stays', stayController.getMyStays);
router.get('/:id', stayController.getStayById);

router.put('/:id', 
  upload.array('images', 10), // For adding more images
  stayController.updateStay
);

router.delete('/:id', stayController.deleteStay);

// Stay images routes
router.post('/:id/images', 
  upload.array('images', 10), // Max 10 images per upload
  stayController.addStayImages
);

router.put('/:id/images/:imageId/primary', stayController.setPrimaryImage);
router.delete('/:id/images/:imageId', stayController.deleteStayImage);

// Booking routes
router.post('/:stayId/bookings', bookingController.createBooking);
router.get('/bookings', bookingController.getUserBookings);
router.get('/bookings/host', bookingController.getHostBookings);
router.get('/bookings/:id', bookingController.getBookingById);
router.put('/bookings/:id/status', bookingController.updateBookingStatus);
router.put('/bookings/:id/cancel', bookingController.cancelBooking);

// Review routes
router.post('/bookings/:bookingId/reviews', bookingController.addStayReview);

module.exports = router;
