import OrderDetail from '#models/OrderDetail'
import OrderMaster from '#models/OrderMaster'
import SalesRepresentative from '#models/SalesRepresentative'
import User from '#models/User'
import Ws from '#services/Ws'
import { NotificationServices, OrderServices } from '#services/index'
import env from '#start/env'
import { createOrderValidator } from '#validators/OrderValidator'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import moment from 'moment'

export default class OrdersController {
  async index({ request, response, auth }: HttpContext) {
    const params = request.qs()

    let { status = '', search = '', limit = 10, page = 1, order = 'desc', sort = 'id' } = params

    if (search) search = `${search}%`

    const userId = auth.user?.id

    const data = await OrderServices.get(limit, page, order, sort, search, status, userId)

    return response.json(data)
  }

  async store({ request, response, auth }: HttpContext) {
    const userId = auth.user?.id

    const { details, ...data } = await request.validateUsing(createOrderValidator)

    const orderNumber = await OrderServices.getOrderNumber()

    const order = await OrderMaster.create({
      ...data,
      userId,
      status: 'Pending',
      orderNumber,
      paymentStatus: 'Paid',
    })

    await order.related('details').createMany(details)

    const user = await User.query().where('id', order.userId).first()

    const countries = [...new Set(details.map((obj) => obj.website!.country))]

    const notification = await NotificationServices.create(
      order.orderNumber,
      'Admin',
      `New Order - ${order.orderNumber}`,
      `A new order has been placed from Mr/Ms '${user!.firstName} ${user!.lastName}'.`
    )

    await mail.send((message) => {
      message
        .to(user!.email)
        .from(env.get('SMTP_USERNAME'))
        .subject('Order Confirmation')
        .htmlView('emails/client_order_place_email_html', {
          name: `${user!.firstName} ${user!.lastName}`,
        })
    })

    await mail.send((message) => {
      message
        .to('contact@worldreachseo.com')
        .from(env.get('SMTP_USERNAME'))
        .subject(`New Backlink Order Received - Order ID [${order.orderNumber}]`)
        .htmlView('emails/admin_order_place_email_html', {
          name: `${user!.firstName} ${user!.lastName}`,
          orderId: order.id,
          noOfLinks: details.length,
          totalAmount: order.totalAmount.toLocaleString(),
          countries: countries.length,
        })
    })

    const salesRep = await SalesRepresentative.query().first()

    if (salesRep && salesRep.email)
      await mail.send((message) => {
        message
          .to(salesRep.email)
          .from(env.get('SMTP_USERNAME'))
          .subject(`New Backlink Order Received - Order ID [${order.orderNumber}]`)
          .htmlView('emails/admin_order_place_email_html', {
            name: `${user!.firstName} ${user!.lastName}`,
            orderId: order.id,
            noOfLinks: details.length,
            totalAmount: order.totalAmount.toLocaleString(),
            countries: countries.length,
          })
      })

    await mail.send((message) => {
      message
        .to('abdulghaffar865@gmail.com')
        .from(env.get('SMTP_USERNAME'))
        .subject(`New Backlink Order Received - Order ID [${order.orderNumber}]`)
        .htmlView('emails/admin_order_place_email_html', {
          name: `${user!.firstName} ${user!.lastName}`,
          orderId: order.id,
          noOfLinks: details.length,
          totalAmount: order.totalAmount.toLocaleString(),
          countries: countries.length,
        })
    })
    Ws.io?.emit('message', notification)

    return response.json({ msg: 'Order placed successfully', order })
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    const data = await OrderServices.getByValue('orderNumber', id)

    return response.json(data)
  }

  async update({ params, request, response }: HttpContext) {
    const data: any = request.body()

    const { id } = params

    const detail = await OrderDetail.query()
      .preload('order', (query) => {
        query.preload('user')
      })
      .preload('website')
      .where('id', id)
      .first()

    await OrderDetail.query()
      .where('id', id)
      .update({ ...data, detailsAdded: true })

    const notification = await NotificationServices.create(
      detail!.order.orderNumber,
      'Admin',
      `Order Details ${detail?.detailsAdded ? 'Updated' : 'Added'} - ${detail!.order.orderNumber}`,
      `Mr/Ms '${detail!.order.user.firstName} ${detail!.order.user.lastName}' have ${detail?.detailsAdded ? 'updated' : 'added'} details for ${detail?.website.domain}.`
    )

    const orderId = `${detail?.order.orderNumber} - ${detail?.website.domain}`

    const changes: { label: string; value: string }[] = []

    if (data.notes) changes.push({ label: 'Notes', value: data.notes })
    if (data.anchorUrl) changes.push({ label: 'Anchor Text', value: data.anchorUrl })
    if (data.targetUrl) changes.push({ label: 'Target URL', value: data.targetUrl })
    if (data.dateOfPublication && data.publicationDate)
      changes.push({
        label: 'Date Of Publication',
        value: moment(data.publicationDate).format('MMM DD, YYYY'),
      })
    if (data.articleTopic) changes.push({ label: 'Topic Article', value: data.articleTopic })
    if (data.keywords) changes.push({ label: 'Keywords', value: data.keywords })
    if (data.guidelines) changes.push({ label: 'Guidelines', value: data.guidelines })
    if (data.picture) changes.push({ label: 'picture', value: data.picture ? 'YES' : 'NO' })

    await mail.send((message) => {
      message
        .to('contact@worldreachseo.com')
        .from(env.get('SMTP_USERNAME'))
        .subject(`Update to Backlink Order - Order ID [${orderId}]`)
        .htmlView('emails/admin_order_update_email_html', {
          name: `${detail!.order!.user!.firstName} ${detail!.order!.user!.lastName}`,
          orderId,
          changes,
        })
    })

    Ws.io?.emit('message', notification)

    return response.json({ msg: 'Order updated successfully' })
  }
}
