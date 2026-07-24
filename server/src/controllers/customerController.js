import prisma from '../lib/prisma.js'

/**
 * GET /api/customers
 * Retrieves paginated customers with optional search filtering by name or email
 */
export const getCustomers = async (req, res) => {
  try {
    const search = req.query.search || ''
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const whereClause = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {}

    const [totalCount, customers] = await Promise.all([
      prisma.customer.count({ where: whereClause }),
      prisma.customer.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, clerkId: true, role: true } },
          policies: { select: { id: true, policyNumber: true, policyType: true, status: true } },
          _count: { select: { documents: true, policies: true } }
        },
        orderBy: { createdAt: 'desc' }
      })
    ])

    const totalPages = Math.ceil(totalCount / limit) || 1

    return res.status(200).json({
      customers,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit
      }
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * POST /api/customers
 * Creates a new customer record
 */
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, dob, address, userId } = req.body

    // Validation for required fields
    if (!name || !email || !phone || !dob || !address) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'All fields (name, email, phone, dob, address) are required'
      })
    }

    const parsedDob = new Date(dob)
    if (isNaN(parsedDob.getTime())) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid date format for dob (Date of Birth)'
      })
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        dob: parsedDob,
        ...(userId && { userId })
      }
    })

    return res.status(201).json({
      message: 'Customer created successfully',
      customer
    })
  } catch (error) {
    console.error('Error creating customer:', error)
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Customer with this email address already exists'
      })
    }
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * GET /api/customers/:id
 * Retrieves details for a single customer along with policies & documents history
 */
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, clerkId: true, role: true } },
        policies: {
          include: {
            claims: true,
            payments: true
          },
          orderBy: { createdAt: 'desc' }
        },
        documents: {
          orderBy: { uploadedAt: 'desc' }
        }
      }
    })

    if (!customer) {
      return res.status(404).json({ error: 'Not Found', message: 'Customer not found' })
    }

    return res.status(200).json({ customer })
  } catch (error) {
    console.error('Error fetching customer by ID:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * PUT /api/customers/:id
 * Updates an existing customer record
 */
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, dob, address } = req.body

    const existingCustomer = await prisma.customer.findUnique({ where: { id } })
    if (!existingCustomer) {
      return res.status(404).json({ error: 'Not Found', message: 'Customer not found' })
    }

    let parsedDob
    if (dob) {
      parsedDob = new Date(dob)
      if (isNaN(parsedDob.getTime())) {
        return res.status(400).json({ error: 'Bad Request', message: 'Invalid date format for dob' })
      }
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(parsedDob && { dob: parsedDob })
      }
    })

    return res.status(200).json({
      message: 'Customer updated successfully',
      customer: updatedCustomer
    })
  } catch (error) {
    console.error('Error updating customer:', error)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Conflict', message: 'Another customer with this email address already exists' })
    }
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * DELETE /api/customers/:id
 * Deletes a customer record
 */
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params

    const existingCustomer = await prisma.customer.findUnique({ where: { id } })
    if (!existingCustomer) {
      return res.status(404).json({ error: 'Not Found', message: 'Customer not found' })
    }

    await prisma.customer.delete({ where: { id } })

    return res.status(200).json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}
