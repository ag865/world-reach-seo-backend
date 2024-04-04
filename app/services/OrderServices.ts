import OrderMaster from '#models/OrderMaster'
import { generateRandomOrderNumber } from '../../utils/helpers.js'

const get = async (
  limit: number,
  page: number,
  order: 'asc' | 'desc',
  sort: string,
  search: string,
  status: string,
  userId?: number
) => {
  const query = OrderMaster.query()
    .preload('user')
    .withCount('details')
    .as('detailsCount')
    .withCount('details', (query) => {
      query.where('status', 'live').as('liveLinks')
    })

  if (userId) query.andWhere('user_id', userId)

  if (status) query.andWhere('status', status)

  if (search) query.andWhereILike('orderNumber', `%${search}%`)

  return await query.orderBy(sort, order).paginate(page, limit)
}

const getById = async (id: number) => {
  return await OrderMaster.query()
    .where('id', id)
    .withCount('details')
    .as('detailsCount')
    .withCount('details', (query) => {
      query.where('status', 'live').as('liveLinks')
    })
    .preload('user')
    .preload('details', (details) => {
      details.preload('website')
    })
    .first()
}

const getOrderNumber = async () => {
  let orderNumber = generateRandomOrderNumber()

  let order = await checkOrderNumber(orderNumber)

  if (order) orderNumber = await getOrderNumber()

  return orderNumber
}

const checkOrderNumber = async (orderNumber: string) => {
  return await OrderMaster.query().where('orderNumber', orderNumber).first()
}

export { get, getById, getOrderNumber }
