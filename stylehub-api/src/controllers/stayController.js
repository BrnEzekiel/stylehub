const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');

// Utility function to handle file uploads
const uploadFile = async (file, uploadPath) => {
  const fileExt = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExt}`;
  const filePath = path.join(uploadPath, fileName);
  
  // Ensure upload directory exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  
  const writeFile = promisify(fs.writeFile);
  await writeFile(filePath, file.buffer);
  
  return {
    fileName,
    filePath: `/uploads/stays/${fileName}`,
    mimeType: file.mimetype,
    size: file.size
  };
};

// Create a new stay
const createStay = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      type, 
      pricePerMonth, 
      address, 
      city, 
      state, 
      country, 
      maxOccupants, 
      availableFrom, 
      availableTo, 
      amenities 
    } = req.body;
    
    const ownerId = req.user.id;
    
    // Basic validation
    if (!title || !description || !type || !pricePerMonth || !address || !city || !state || !country || !maxOccupants || !availableFrom) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create stay in database
    const stay = await prisma.stay.create({
      data: {
        title,
        description,
        type,
        pricePerMonth: parseFloat(pricePerMonth),
        address,
        city,
        state,
        country,
        maxOccupants: parseInt(maxOccupants),
        availableFrom: new Date(availableFrom),
        availableTo: availableTo ? new Date(availableTo) : null,
        ownerId,
      }
    });
    
    // Add amenities if provided
    if (amenities && Array.isArray(amenities)) {
      await Promise.all(
        amenities.map(amenity => 
          prisma.stayAmenity.create({
            data: {
              stayId: stay.id,
              type: amenity.type,
              description: amenity.description || null,
              isAvailable: amenity.isAvailable !== false,
              additionalCost: amenity.additionalCost ? parseFloat(amenity.additionalCost) : 0.00,
            }
          })
        )
      );
    }
    
    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file, index) => {
        const uploadPath = path.join(__dirname, '../../public/uploads/stays');
        const { filePath } = await uploadFile(file, uploadPath);
        
        return prisma.stayImage.create({
          data: {
            stayId: stay.id,
            url: filePath,
            isPrimary: index === 0 // First image is primary by default
          }
        });
      });
      
      await Promise.all(uploadPromises);
    }
    
    // Return the created stay with relations
    const createdStay = await prisma.stay.findUnique({
      where: { id: stay.id },
      include: {
        amenities: true,
        images: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });
    
    res.status(201).json(createdStay);
  } catch (error) {
    console.error('Error creating stay:', error);
    res.status(500).json({ error: 'Failed to create stay', details: error.message });
  }
};

// Get all stays with filtering and pagination
const getStays = async (req, res) => {
  try {
    const { 
      city, 
      minPrice, 
      maxPrice, 
      type, 
      amenities, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build filter
    const where = {
      isAvailable: true,
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(minPrice && { pricePerMonth: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { pricePerMonth: { lte: parseFloat(maxPrice) } }),
      ...(type && { type }),
      ...(amenities && {
        amenities: {
          some: {
            type: { in: Array.isArray(amenities) ? amenities : [amenities] },
            isAvailable: true
          }
        }
      })
    };
    
    // Get total count for pagination
    const total = await prisma.stay.count({ where });
    
    // Get stays with pagination
    const stays = await prisma.stay.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { [sortBy]: sortOrder.toLowerCase() },
      include: {
        amenities: true,
        images: {
          where: { isPrimary: true },
          take: 1
        },
        _count: {
          select: { reviews: true }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    });
    
    // Calculate average rating for each stay
    const staysWithAvgRating = stays.map(stay => {
      const avgRating = stay.reviews.length > 0
        ? stay.reviews.reduce((sum, review) => sum + review.rating, 0) / stay.reviews.length
        : 0;
      
      const { reviews, ...stayWithoutReviews } = stay;
      
      return {
        ...stayWithoutReviews,
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: stay._count.reviews
      };
    });
    
    res.json({
      data: staysWithAvgRating,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching stays:', error);
    res.status(500).json({ error: 'Failed to fetch stays', details: error.message });
  }
};

// Get a single stay by ID
const getStayById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const stay = await prisma.stay.findUnique({
      where: { id },
      include: {
        amenities: true,
        images: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            _count: {
              select: { staysOwned: true }
            }
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                imageUrl: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: { reviews: true, bookings: true }
        }
      }
    });
    
    if (!stay) {
      return res.status(404).json({ error: 'Stay not found' });
    }
    
    // Calculate average rating
    const avgRating = stay.reviews.length > 0
      ? stay.reviews.reduce((sum, review) => sum + review.rating, 0) / stay.reviews.length
      : 0;
    
    const stayWithStats = {
      ...stay,
      avgRating: parseFloat(avgRating.toFixed(1)),
      reviewCount: stay._count.reviews,
      bookingCount: stay._count.bookings
    };
    
    delete stayWithStats._count;
    
    res.json(stayWithStats);
  } catch (error) {
    console.error('Error fetching stay:', error);
    res.status(500).json({ error: 'Failed to fetch stay', details: error.message });
  }
};

// Update a stay
const updateStay = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const ownerId = req.user.id;
    
    // Check if stay exists and user is the owner
    const existingStay = await prisma.stay.findUnique({
      where: { id },
      select: { ownerId: true }
    });
    
    if (!existingStay) {
      return res.status(404).json({ error: 'Stay not found' });
    }
    
    if (existingStay.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Not authorized to update this stay' });
    }
    
    // Prepare update data
    const updateData = {};
    const allowedFields = [
      'title', 'description', 'type', 'pricePerMonth', 'address',
      'city', 'state', 'country', 'maxOccupants', 'availableFrom', 'availableTo', 'isAvailable'
    ];
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });
    
    // Handle numeric fields
    if (updateData.pricePerMonth) updateData.pricePerMonth = parseFloat(updateData.pricePerMonth);
    if (updateData.maxOccupants) updateData.maxOccupants = parseInt(updateData.maxOccupants);
    
    // Handle date fields
    if (updateData.availableFrom) updateData.availableFrom = new Date(updateData.availableFrom);
    if (updateData.availableTo) updateData.availableTo = new Date(updateData.availableTo);
    
    // Update stay
    const updatedStay = await prisma.stay.update({
      where: { id },
      data: updateData,
      include: {
        amenities: true,
        images: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });
    
    res.json(updatedStay);
  } catch (error) {
    console.error('Error updating stay:', error);
    res.status(500).json({ error: 'Failed to update stay', details: error.message });
  }
};

// Delete a stay
const deleteStay = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;
    
    // Check if stay exists and user is the owner
    const existingStay = await prisma.stay.findUnique({
      where: { id },
      select: { ownerId: true }
    });
    
    if (!existingStay) {
      return res.status(404).json({ error: 'Stay not found' });
    }
    
    if (existingStay.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Not authorized to delete this stay' });
    }
    
    // Delete stay (Prisma's onDelete: Cascade will handle related records)
    await prisma.stay.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting stay:', error);
    res.status(500).json({ error: 'Failed to delete stay', details: error.message });
  }
};

// Add images to a stay
const addStayImages = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;
    
    // Check if stay exists and user is the owner
    const existingStay = await prisma.stay.findUnique({
      where: { id },
      select: { ownerId: true }
    });
    
    if (!existingStay) {
      return res.status(404).json({ error: 'Stay not found' });
    }
    
    if (existingStay.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Not authorized to update this stay' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Upload files
    const uploadPath = path.join(__dirname, '../../public/uploads/stays');
    const uploadPromises = req.files.map(async (file, index) => {
      const { filePath } = await uploadFile(file, uploadPath);
      
      return prisma.stayImage.create({
        data: {
          stayId: id,
          url: filePath,
          isPrimary: false
        }
      });
    });
    
    const uploadedImages = await Promise.all(uploadPromises);
    
    res.status(201).json(uploadedImages);
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Failed to upload images', details: error.message });
  }
};

// Set primary image for a stay
const setPrimaryImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const ownerId = req.user.id;
    
    // Check if stay exists and user is the owner
    const existingStay = await prisma.stay.findUnique({
      where: { id },
      select: { ownerId: true }
    });
    
    if (!existingStay) {
      return res.status(404).json({ error: 'Stay not found' });
    }
    
    if (existingStay.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Not authorized to update this stay' });
    }
    
    // Check if image exists and belongs to this stay
    const image = await prisma.stayImage.findUnique({
      where: { id: imageId },
      select: { stayId: true }
    });
    
    if (!image || image.stayId !== id) {
      return res.status(404).json({ error: 'Image not found for this stay' });
    }
    
    // Reset all primary flags for this stay
    await prisma.stayImage.updateMany({
      where: { stayId: id },
      data: { isPrimary: false }
    });
    
    // Set the selected image as primary
    const updatedImage = await prisma.stayImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
      select: {
        id: true,
        url: true,
        isPrimary: true,
        createdAt: true
      }
    });
    
    res.json(updatedImage);
  } catch (error) {
    console.error('Error setting primary image:', error);
    res.status(500).json({ error: 'Failed to set primary image', details: error.message });
  }
};

// Delete a stay image
const deleteStayImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const ownerId = req.user.id;
    
    // Check if stay exists and user is the owner
    const existingStay = await prisma.stay.findUnique({
      where: { id },
      select: { ownerId: true }
    });
    
    if (!existingStay) {
      return res.status(404).json({ error: 'Stay not found' });
    }
    
    if (existingStay.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Not authorized to update this stay' });
    }
    
    // Check if image exists and belongs to this stay
    const image = await prisma.stayImage.findUnique({
      where: { id: imageId },
      select: { stayId: true, url: true, isPrimary: true }
    });
    
    if (!image || image.stayId !== id) {
      return res.status(404).json({ error: 'Image not found for this stay' });
    }
    
    // Delete image file
    try {
      const filePath = path.join(__dirname, '../../public', image.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fileError) {
      console.error('Error deleting image file:', fileError);
      // Continue even if file deletion fails
    }
    
    // Delete image record
    await prisma.stayImage.delete({
      where: { id: imageId }
    });
    
    // If the deleted image was primary, set another image as primary if available
    if (image.isPrimary) {
      const firstImage = await prisma.stayImage.findFirst({
        where: { stayId: id },
        orderBy: { createdAt: 'asc' },
        select: { id: true }
      });
      
      if (firstImage) {
        await prisma.stayImage.update({
          where: { id: firstImage.id },
          data: { isPrimary: true }
        });
      }
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
};

// Get stays by owner
const getMyStays = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [total, stays] = await Promise.all([
      prisma.stay.count({ where: { ownerId } }),
      prisma.stay.findMany({
        where: { ownerId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          },
          _count: {
            select: { bookings: true, reviews: true }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        }
      })
    ]);
    
    // Calculate average rating for each stay
    const staysWithStats = stays.map(stay => {
      const avgRating = stay.reviews.length > 0
        ? stay.reviews.reduce((sum, review) => sum + review.rating, 0) / stay.reviews.length
        : 0;
      
      return {
        ...stay,
        avgRating: parseFloat(avgRating.toFixed(1)),
        bookingCount: stay._count.bookings,
        reviewCount: stay._count.reviews
      };
    });
    
    res.json({
      data: staysWithStats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching user stays:', error);
    res.status(500).json({ error: 'Failed to fetch user stays', details: error.message });
  }
};

// Search stays by location
const searchStays = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 3) {
      return res.status(400).json({ error: 'Search query must be at least 3 characters long' });
    }
    
    const stays = await prisma.stay.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { state: { contains: query, mode: 'insensitive' } }
        ],
        isAvailable: true
      },
      take: 10,
      select: {
        id: true,
        title: true,
        description: true,
        pricePerMonth: true,
        city: true,
        state: true,
        country: true,
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true }
        },
        _count: {
          select: { reviews: true }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    });
    
    // Calculate average rating for each stay
    const staysWithRatings = stays.map(stay => {
      const avgRating = stay.reviews.length > 0
        ? stay.reviews.reduce((sum, review) => sum + review.rating, 0) / stay.reviews.length
        : 0;
      
      const { reviews, ...stayWithoutReviews } = stay;
      
      return {
        ...stayWithoutReviews,
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: stay._count.reviews,
        image: stay.images[0]?.url || null
      };
    });
    
    res.json(staysWithRatings);
  } catch (error) {
    console.error('Error searching stays:', error);
    res.status(500).json({ error: 'Failed to search stays', details: error.message });
  }
};

module.exports = {
  createStay,
  getStays,
  getStayById,
  updateStay,
  deleteStay,
  addStayImages,
  setPrimaryImage,
  deleteStayImage,
  getMyStays,
  searchStays
};
