/**
 * GET /api/settings/health
 * Public system health check endpoint
 */
export const getHealthStatus = async (req, res) => {
  try {
    return res.status(200).json({
      status: 'active',
      message: 'CoverFlow API is running smoothly',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching health status:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}
