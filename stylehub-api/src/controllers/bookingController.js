const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { stayId, checkInDate, checkOutDate, guestCount, specialRequests, paymentMethod } = req.body;
    const userId = req.user.id;
    
    // Validate required fields
    if (!stayId || !checkInDate || !checkOutDate || !guestCount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if stay exists and is available
    const stay = await prisma.stay.findUnique({
      where: { id: stayId },
      select: {
        id: true,
        pricePerMonth: true,
        maxOccupants: true,
        isAvailable: true,
        availableFrom: true,
        availableTo: true,
        ownerId: true
      }
    });
    
    if (!stay) {
      return res.status(404).json({ error: 'Stay not found' });
    }
    
    if (!stay.isAvailable) {
      return res.status(400).json({ error: 'This stay is not currently available for booking' });
    }
    
    if (stay.ownerId === userId) {
      return res.status(400).json({ error: 'You cannot book your own stay' });
    }
    
    // Convert dates to Date objects
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const now = new Date();
    
    // Validate dates
    if (checkIn >= checkOut) {
      return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }
    
    if (checkIn < now) {
      return res.status(400).json({ error: 'Check-in date cannot be in the past' });
    }
    
    // Validate against stay's availability
    if (checkIn < new Date(stay.availableFrom) || 
        (stay.availableTo && checkOut > new Date(stay.availableTo))) {
      return res.status(400).json({ 
        error: 'Selected dates are outside the available date range for this stay' 
      });
    }
    
    // Check guest count
    if (guestCount > stay.maxOccupants) {
      return res.status(400).json({ 
        error: `Maximum ${stay.maxOccupants} guests allowed for this stay` 
      });
    }
    
    // Check for existing bookings that overlap with the requested dates
    const overlappingBookings = await prisma.stayBooking.findMany({
      where: {
        stayId,
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        OR: [
          {
            checkInDate: { lt: checkOut },
            checkOutDate: { gt: checkIn }
          }
        ]
      }
    });
    
    if (overlappingBookings.length > 0) {
      return res.status(400).json({ 
        error: 'The selected dates are not available for booking' 
      });
    }
    
    // Calculate total price (simplified - could be more complex based on pricing rules)
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const nightlyRate = stay.pricePerMonth / 30; // Simple conversion, adjust as needed
    const subtotal = nightlyRate * nights;
    const platformFee = subtotal * 0.1; // 10% platform fee
    const totalPrice = subtotal + platformFee;
    
    // Create booking
    const booking = await prisma.stayBooking.create({
      data: {
        stayId,
        userId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestCount: parseInt(guestCount),
        totalPrice,
        specialRequests: specialRequests || null,
        paymentMethod: paymentMethod || 'CASH',
        status: 'PENDING',
        paymentStatus: 'PENDING'
      },
      include: {
        stay: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            state: true,
            country: true,
            pricePerMonth: true,
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true }
            },
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });
    
    // TODO: Process payment based on payment method
    // For now, we'll just return the booking with payment pending
    
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const booking = await prisma.stayBooking.findUnique({
      where: { id },
      include: {
        stay: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            state: true,
            country: true,
            pricePerMonth: true,
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true }
            },
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Check if the user is authorized to view this booking
    if (booking.userId !== userId && booking.stay.ownerId !== userId) {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking', details: error.message });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = { userId };
    
    if (status) {
      where.status = status;
    }
    
    // Get total count for pagination
    const total = await prisma.stayBooking.count({ where });
    
    // Get bookings with pagination
    const bookings = await prisma.stayBooking.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        stay: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            state: true,
            country: true,
            pricePerMonth: true,
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true }
            }
          }
        }
      }
    });
    
    res.json({
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
};

// Get bookings for host's properties
const getHostBookings = async (req, res) => {
  try {
    const hostId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = {
      stay: { ownerId: hostId }
    };
    
    if (status) {
      where.status = status;
    }
    
    // Get total count for pagination
    const total = await prisma.stayBooking.count({ 
      where: {
        stay: { ownerId: hostId },
        ...(status && { status })
      }
    });
    
    // Get bookings with pagination
    const bookings = await prisma.stayBooking.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        stay: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            state: true,
            country: true,
            pricePerMonth: true,
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });
    
    res.json({
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching host bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
};

// Update booking status (for hosts to confirm/reject)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const hostId = req.user.id;
    
    // Validate status
    if (!['CONFIRMED', 'CANCELLED', 'REJECTED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // Check if booking exists and belongs to host's property
    const booking = await prisma.stayBooking.findUnique({
      where: { id },
      include: {
        stay: {
          select: {
            ownerId: true
          }
        }
      }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.stay.ownerId !== hostId) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }
    
    // Prevent updating completed or cancelled bookings
    if (['COMPLETED', 'CANCELLED', 'REJECTED'].includes(booking.status)) {
      return res.status(400).json({ 
        error: `Cannot update a booking that is already ${booking.status.toLowerCase()}` 
      });
    }
    
    // Update booking status
    const updatedBooking = await prisma.stayBooking.update({
      where: { id },
      data: { 
        status,
        // If confirming, also update payment status to PAID if it was pending
        ...(status === 'CONFIRMED' && booking.paymentStatus === 'PENDING' ? { paymentStatus: 'PAID' } : {})
      },
      include: {
        stay: {
          select: {
            id: true,
            title: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    // TODO: Send notification to guest about status update
    
    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status', details: error.message });
  }
};

// Cancel a booking (for guests)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if booking exists and belongs to user
    const booking = await prisma.stayBooking.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
        checkInDate: true,
        stay: {
          select: {
            ownerId: true,
            cancellationPolicy: true
          }
        }
      }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }
    
    // Check if booking can be cancelled
    if (['CANCELLED', 'COMPLETED', 'REJECTED'].includes(booking.status)) {
      return res.status(400).json({ 
        error: `This booking is already ${booking.status.toLowerCase()}` 
      });
    }
    
    // Check cancellation policy (simplified - could be more complex based on policy)
    const now = new Date();
    const checkIn = new Date(booking.checkInDate);
    const daysUntilCheckIn = Math.ceil((checkIn - now) / (1000 * 60 * 60 * 24));
    
    // Example: Full refund if cancelled more than 7 days before check-in, 50% if within 7 days
    let refundAmount = 0;
    if (daysUntilCheckIn > 7) {
      refundAmount = booking.totalPrice;
    } else if (daysUntilCheckIn > 1) {
      refundAmount = booking.totalPrice * 0.5;
    }
    
    // Update booking status to CANCELLED
    const updatedBooking = await prisma.stayBooking.update({
      where: { id },
      data: { 
        status: 'CANCELLED',
        // In a real app, you would also process the refund here
        // and update payment status accordingly
      },
      include: {
        stay: {
          select: {
            id: true,
            title: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    // TODO: Process refund if applicable
    // TODO: Send notifications to both guest and host
    
    res.json({
      ...updatedBooking,
      refundAmount
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking', details: error.message });
  }
};

// Add a review for a completed stay
const addStayReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, comment, images } = req.body;
    const userId = req.user.id;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Check if booking exists and belongs to user
    const booking = await prisma.stayBooking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        userId: true,
        stayId: true,
        status: true,
        checkOutDate: true,
        review: {
          select: { id: true }
        }
      }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to review this booking' });
    }
    
    // Check if booking is completed
    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ 
        error: 'You can only review completed stays' 
      });
    }
    
    // Check if check-out date has passed
    const now = new Date();
    if (new Date(booking.checkOutDate) > now) {
      return res.status(400).json({ 
        error: 'You can only review after your stay has ended' 
      });
    }
    
    // Check if review already exists
    if (booking.review) {
      return res.status(400).json({ 
        error: 'You have already reviewed this stay' 
      });
    }
    
    // Create review
    const review = await prisma.stayReview.create({
      data: {
        stayId: booking.stayId,
        userId,
        rating: parseInt(rating),
        comment: comment || null,
        images: Array.isArray(images) ? images : []
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        }
      }
    });
    
    // Update booking with review ID
    await prisma.stayBooking.update({
      where: { id: bookingId },
      data: { reviewId: review.id }
    });
    
    // Update stay's average rating and review count
    await updateStayRating(booking.stayId);
    
    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review', details: error.message });
  }
};

// Helper function to update stay's average rating and review count
async function updateStayRating(stayId) {
  const reviews = await prisma.stayReview.findMany({
    where: { stayId },
    select: { rating: true }
  });
  
  if (reviews.length === 0) return;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = totalRating / reviews.length;
  
  await prisma.stay.update({
    where: { id: stayId },
    data: {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: reviews.length
    }
  });
}

module.exports = {
  createBooking,
  getBookingById,
  getUserBookings,
  getHostBookings,
  updateBookingStatus,
  cancelBooking,
  addStayReview
};
