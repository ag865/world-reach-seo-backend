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
    .preload('details', (query) => {
      query.preload('website')
    })
    .withCount('details', (query) => {
      query.where('status', 'live').as('liveLinks')
    })

  if (userId) query.andWhere('user_id', userId)

  if (status) query.andWhere('status', status)

  if (search) query.andWhereILike('orderNumber', `%${search}%`)

  return await query.orderBy(sort, order).paginate(page, limit)
}

const getByValue = async (column: string, value: any) => {
  return await OrderMaster.query()
    .where(column, value)
    .withCount('details')
    .as('detailsCount')
    .withCount('details', (query) => {
      query.where('status', 'Live Link').as('liveLinks')
    })
    .preload('user')
    .preload('details', (details) => {
      details.preload('website').orderBy('id', 'desc')
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

export { get, getByValue, getOrderNumber }
