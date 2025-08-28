import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create new inquiry
export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, propertyId } = req.body;

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        message,
        propertyId,
        userId: req.user?.id || null
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            location: true,
            price: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiry
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ 
      error: 'Failed to submit inquiry' 
    });
  }
};

// Get all inquiries (admin/agent only)
export const getInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const where = {};
    
    // Filter by status if provided
    if (status) where.status = status;
    
    // If user is an agent, only show their property inquiries
    if (req.user.role === 'AGENT') {
      const userProperties = await prisma.property.findMany({
        where: { userId: req.user.id },
        select: { id: true }
      });
      
      where.propertyId = {
        in: userProperties.map(p => p.id)
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              location: true,
              price: true
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
      }),
      prisma.inquiry.count({ where })
    ]);

    res.json({
      inquiries,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch inquiries' 
    });
  }
};

// Get single inquiry
export const getInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!inquiry) {
      return res.status(404).json({ 
        error: 'Inquiry not found' 
      });
    }

    // Check if user has access to this inquiry
    if (req.user.role === 'AGENT') {
      const property = await prisma.property.findUnique({
        where: { id: inquiry.propertyId }
      });
      
      if (property?.userId !== req.user.id) {
        return res.status(403).json({ 
          error: 'Not authorized to view this inquiry' 
        });
      }
    }

    res.json({ inquiry });
  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch inquiry' 
    });
  }
};

// Update inquiry status
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if inquiry exists
    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: true
      }
    });

    if (!existingInquiry) {
      return res.status(404).json({ 
        error: 'Inquiry not found' 
      });
    }

    // Check authorization
    if (req.user.role === 'AGENT' && existingInquiry.property?.userId !== req.user.id) {
      return res.status(403).json({ 
        error: 'Not authorized to update this inquiry' 
      });
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            location: true
          }
        }
      }
    });

    res.json({
      message: 'Inquiry status updated successfully',
      inquiry
    });
  } catch (error) {
    console.error('Update inquiry status error:', error);
    res.status(500).json({ 
      error: 'Failed to update inquiry status' 
    });
  }
};

// Delete inquiry
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id }
    });

    if (!existingInquiry) {
      return res.status(404).json({ 
        error: 'Inquiry not found' 
      });
    }

    await prisma.inquiry.delete({
      where: { id }
    });

    res.json({
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ 
      error: 'Failed to delete inquiry' 
    });
  }
};
