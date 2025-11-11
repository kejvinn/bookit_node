import paymentService from '../../services/payment/paymentService.js'
import { asyncHandler } from '../../utils/helpers.js'
import PayPalService from '../../services/payment/paypalService.js'
import axios from 'axios'

export class PaymentController {
  static createPayPalOrder = asyncHandler(async (req, res) => {
    const result = await paymentService.createPayPalOrder(req.params.reservationId, req.user.id)

    res.status(201).json({
      success: true,
      data: result,
      message: 'PayPal order created successfully'
    })
  })

  static capturePayPalOrder = asyncHandler(async (req, res) => {
    const result = await paymentService.capturePayPalOrder(req.params.reservationId, req.body.orderId, req.user.id)

    res.json({
      success: true,
      data: result,
      message: 'Payment processed successfully'
    })
  })

  static handlePayPalSuccess = asyncHandler(async (req, res) => {
    const { token } = req.query

    if (!token) {
      return res.redirect(`${process.env.FRONTEND_URL}/reservations/error?message=Missing payment token`)
    }

    res.redirect(`${process.env.FRONTEND_URL}/reservations/payment-success?token=${token}`)
  })

  static handlePayPalCancel = asyncHandler(async (req, res) => {
    const { token } = req.query

    res.redirect(`${process.env.FRONTEND_URL}/reservations/payment-cancel?token=${token || ''}`)
  })

  static refundPayment = asyncHandler(async (req, res) => {
    const result = await paymentService.refundPayment(req.params.reservationId, req.user.id, req.user.role)

    res.json({
      success: true,
      data: result,
      message: 'Refund processed successfully'
    })
  })

  static getPaymentStatus = asyncHandler(async (req, res) => {
    const result = await paymentService.getPaymentStatus(req.params.reservationId, req.user.id)

    res.json({
      success: true,
      data: result
    })
  })

  static checkPayPalOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params

    try {
      const accessToken = await PayPalService.getAccessToken()
      const response = await axios.get(`${PayPalService.baseUrl}/v2/checkout/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      res.json({
        success: true,
        orderId: response.data.id,
        status: response.data.status,
        payer: response.data.payer,
        intent: response.data.intent
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.response?.data || error.message
      })
    }
  })
}
