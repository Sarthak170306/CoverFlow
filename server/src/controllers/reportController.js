import prisma from '../lib/prisma.js'

/**
 * Helper to escape CSV field values safely to handle commas, quotes, and newlines
 */
const escapeCSVField = (field) => {
  if (field === null || field === undefined) return '""'
  const stringified = String(field).replace(/"/g, '""')
  return `"${stringified}"`
}

/**
 * GET /api/reports/claims/csv
 * Exports all Claims data as a downloadable CSV file
 */
export const exportClaimsCSV = async (req, res) => {
  try {
    const claims = await prisma.claim.findMany({
      include: {
        policy: {
          include: {
            customer: true
          }
        }
      },
      orderBy: { submissionDate: 'desc' }
    })

    const headers = [
      'Claim ID',
      'Policy Number',
      'Customer Name',
      'Customer Email',
      'Claim Amount ($)',
      'Status',
      'Submission Date'
    ]

    const csvRows = [headers.map(escapeCSVField).join(',')]

    for (const claim of claims) {
      const claimId = `CLM-${claim.id.substring(0, 8).toUpperCase()}`
      const policyNumber = claim.policy?.policyNumber || 'N/A'
      const customerName = claim.policy?.customer?.name || 'N/A'
      const customerEmail = claim.policy?.customer?.email || 'N/A'
      const amount = claim.claimAmount ? claim.claimAmount.toFixed(2) : '0.00'
      const status = claim.status || 'PENDING'
      const submissionDate = claim.submissionDate
        ? new Date(claim.submissionDate).toISOString().split('T')[0]
        : 'N/A'

      const row = [
        claimId,
        policyNumber,
        customerName,
        customerEmail,
        amount,
        status,
        submissionDate
      ].map(escapeCSVField).join(',')

      csvRows.push(row)
    }

    const csvContent = csvRows.join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="claims_report.csv"')
    return res.status(200).send(csvContent)
  } catch (error) {
    console.error('Error generating Claims CSV report:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * GET /api/reports/premiums/csv
 * Exports all Premium Payments data as a downloadable CSV file
 */
export const exportPremiumsCSV = async (req, res) => {
  try {
    const payments = await prisma.premiumPayment.findMany({
      include: {
        policy: {
          include: {
            customer: true
          }
        }
      },
      orderBy: { paymentDate: 'desc' }
    })

    const headers = [
      'Transaction ID',
      'Policy Number',
      'Customer Name',
      'Customer Email',
      'Amount ($)',
      'Payment Method',
      'Status',
      'Payment Date'
    ]

    const csvRows = [headers.map(escapeCSVField).join(',')]

    for (const pmt of payments) {
      const transactionId = pmt.transactionId || `TXN-${pmt.id.substring(0, 8).toUpperCase()}`
      const policyNumber = pmt.policy?.policyNumber || 'N/A'
      const customerName = pmt.policy?.customer?.name || 'N/A'
      const customerEmail = pmt.policy?.customer?.email || 'N/A'
      const amount = pmt.amount ? pmt.amount.toFixed(2) : '0.00'
      const method = pmt.paymentMethod || 'BANK_TRANSFER'
      const status = pmt.paymentStatus || 'PAID'
      const paymentDate = pmt.paymentDate
        ? new Date(pmt.paymentDate).toISOString().split('T')[0]
        : 'N/A'

      const row = [
        transactionId,
        policyNumber,
        customerName,
        customerEmail,
        amount,
        method,
        status,
        paymentDate
      ].map(escapeCSVField).join(',')

      csvRows.push(row)
    }

    const csvContent = csvRows.join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="premiums_report.csv"')
    return res.status(200).send(csvContent)
  } catch (error) {
    console.error('Error generating Premiums CSV report:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}
