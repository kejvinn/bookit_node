import axios from 'axios'
import { config } from '../../../config/env.js'
import { AppError } from '../../utils/helpers.js'
import { HTTP_STATUS } from '../../../config/constants.js'
import logger from '../../utils/logger.js'

class PayPalService {
  constructor() {
    this.baseUrl = config.paypal.mode === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
    this.clientId = config.paypal.clientId
    this.clientSecret = config.paypal.clientSecret
    this.accessToken = null
    this.tokenExpiry = null
  }

  async getAccessToken() {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')

      const response = await axios.post(`${this.baseUrl}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      this.accessToken = response.data.access_token
      // Set expiry to 1 minute before actual expiry for safety
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000

      return this.accessToken
    } catch (error) {
      logger.error('Failed to get PayPal access token:', error.message)
      throw new AppError('PayPal authentication failed', HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
  }

  async createOrder(orderData) {
    try {
      const accessToken = await this.getAccessToken()

      const requestBody = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: String(orderData.reservationId),
            description: orderData.description ?? 'Property booking',
            amount: {
              currency_code: orderData.currency,
              value: orderData.amount.toFixed(2)
            }
          }
        ],
        application_context: {
          brand_name: 'BookIt',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: `${config.app.url}/api/payments/paypal/success`,
          cancel_url: `${config.app.url}/api/payments/paypal/cancel`
        }
      }

      const response = await axios.post(`${this.baseUrl}/v2/checkout/orders`, requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      logger.info(`PayPal order created: ${response.data.id}`)

      return {
        orderId: response.data.id,
        status: response.data.status,
        links: response.data.links
      }
    } catch (error) {
      logger.error('PayPal order creation failed:', error.response?.data || error.message)
      throw new AppError('Failed to create PayPal order', HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
  }

  async captureOrder(orderId) {
    try {
      const accessToken = await this.getAccessToken()

      console.log('🔵 Attempting to capture order:', orderId)
      console.log('🔵 Using base URL:', this.baseUrl)

      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('Capture SUCCESS!')
      console.log('Response:', JSON.stringify(response.data, null, 2))

      const capture = response.data.purchase_units[0].payments.captures[0]

      return {
        transactionId: capture.id,
        orderId: response.data.id,
        status: response.data.status,
        payerId: response.data.payer.payer_id,
        payerEmail: response.data.payer.email_address,
        amount: capture.amount.value,
        currency: capture.amount.currency_code
      }
    } catch (error) {
      console.error('PayPal capture FAILED!')
      console.error('Status Code:', error.response?.status)
      console.error('Error Response:', JSON.stringify(error.response?.data, null, 2))
      console.error('Error Message:', error.message)
      console.error('Order ID:', orderId)

      logger.error('PayPal capture failed:', error.response?.data || error.message)

      throw new AppError(
        error.response?.data?.message || 'Failed to capture PayPal payment',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    }
  }

  async refundPayment(captureId, amount, currency) {
    try {
      const accessToken = await this.getAccessToken()
      const url = `${this.baseUrl}/v2/payments/captures/${captureId}/refund`
      const requestBody = {
        amount: {
          value: amount.toFixed(2),
          currency_code: currency
        }
      }

      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data.status === 'COMPLETED') {
        logger.info('Refund API response:', response.data)
        return {
          refundId: response.data.id,
          status: response.data.status,
          amount: response.data.amount?.value || amount.toFixed(2)
        }
      }

      // Handle unexpected but non-exception responses
      logger.warn('Unexpected refund status:', response.data)
      return {
        refundId: response.data.id,
        status: response.data.status || 'UNKNOWN',
        amount: response.data.amount?.value || amount.toFixed(2)
      }
    } catch (error) {
      const errData = error.response?.data
      logger.error('PayPal refund error response:', errData || error.message)

      //  Handle already-refunded gracefully
      if (errData?.details?.[0]?.issue === 'CAPTURE_FULLY_REFUNDED') {
        return {
          refundId: captureId,
          status: 'ALREADY_REFUNDED',
          amount: amount.toFixed(2)
        }
      }

      throw new AppError('Failed to process refund', HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
  }

  getApprovalUrl(links) {
    const link = links.find((l) => l.rel === 'approve')
    return link?.href
  }
}

export default new PayPalService()
