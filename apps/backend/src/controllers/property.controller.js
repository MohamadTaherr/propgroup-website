import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all properties with filters
export const getProperties = async (req, res) => {
  try {
    const {
      type,
      status,
      minPrice,
      maxPrice,
      location,
      bedrooms,
      bathrooms,
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter object
    const where = {};
    
    if (type) where.type = type;
    if (status) where.status = status;
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      };
    }
    if (bedrooms) where.bedrooms = parseInt(bedrooms);
    if (bathrooms) where.bathrooms = parseInt(bathrooms);
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get properties with pagination
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sort]: order
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.property.count({ where })
    ]);

    res.json({
      properties,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch properties' 
    });
  }
};

// Get single property by ID
export const getProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        inquiries: {
          select: {
            id: true,
            createdAt: true,
            status: true
          }
        }
      }
    });

    if (!property) {
      return res.status(404).json({ 
        error: 'Property not found' 
      });
    }

    res.json({ property });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch property' 
    });
  }
};

// Create new property
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      address,
      type,
      bedrooms,
      bathrooms,
      area,
      images,
      features,
      badge
    } = req.body;

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        address,
        type,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        area: area ? parseFloat(area) : null,
        images: images || [],
        features: features || [],
        badge,
        userId: req.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ 
      error: 'Failed to create property' 
    });
  }
};

// Update property
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if property exists and user owns it
    const existingProperty = await prisma.property.findUnique({
      where: { id }
    });

    if (!existingProperty) {
      return res.status(404).json({ 
        error: 'Property not found' 
      });
    }

    // Check ownership (admin can update any property)
    if (existingProperty.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        error: 'Not authorized to update this property' 
      });
    }

    // Update property
    const property = await prisma.property.update({
      where: { id },
      data: {
        ...updateData,
        price: updateData.price ? parseFloat(updateData.price) : undefined,
        bedrooms: updateData.bedrooms ? parseInt(updateData.bedrooms) : undefined,
        bathrooms: updateData.bathrooms ? parseInt(updateData.bathrooms) : undefined,
        area: updateData.area ? parseFloat(updateData.area) : undefined
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ 
      error: 'Failed to update property' 
    });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if property exists and user owns it
    const existingProperty = await prisma.property.findUnique({
      where: { id }
    });

    if (!existingProperty) {
      return res.status(404).json({ 
        error: 'Property not found' 
      });
    }

    // Check ownership (admin can delete any property)
    if (existingProperty.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        error: 'Not authorized to delete this property' 
      });
    }

    await prisma.property.delete({
      where: { id }
    });

    res.json({
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ 
      error: 'Failed to delete property' 
    });
  }
};
