import prisma from '../lib/prisma.js'

/**
 * GET /api/customers
 * Retrieves list of customers
 */
export const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        user: { select: { id: true, clerkId: true, role: true } },
        policies: { select: { id: true, policyNumber: true, policyType: true, status: true } },
        _count: { select: { documents: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return res.status(200).json({ customers })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * POST /api/customers
 * Creates a new customer
 */
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, dob, address, userId } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Bad Request', message: 'Name and email are required' })
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        dob: dob ? new Date(dob) : null,
        ...(userId && { userId })
      }
    })

    return res.status(201).json({ message: 'Customer created successfully', customer })
  } catch (error) {
    console.error('Error creating customer:', error)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Conflict', message: 'Customer with this email already exists' })
    }
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * GET /api/customers/:id
 * Retrieves details for a single customer
 */
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        policies: {
          include: {
            claims: true,
            payments: true
          }
        },
        documents: true
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
