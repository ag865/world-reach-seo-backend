import Coupon from '#models/Coupon'

const getCoupons = async (params: any) => {
  const { page = 1, limit = 10, sort = 'id', order = 'desc', search = '' } = params

  const query = Coupon.query()

  query.preload('users')

  if (search) query.whereILike('name', `%${search}%`).orWhereILike('coupon_code', `%${search}`)

  return await query.orderBy(sort, order).paginate(page, limit)
}

const createCoupon = async (data: any, users: number[]) => {
  const coupon = await Coupon.create(data)

  if (users.length) await coupon.related('users').attach(users)
}

const updateCoupon = async (data: any, users: number[], id: number, obj: Coupon) => {
  await Coupon.query().update(data).where('id', id)

  await obj.related('users').sync(users ?? [])
}

const getCouponByValue = async (column: string, value: any, includeUsers = false) => {
  const query = Coupon.query()

  if (includeUsers) query.preload('users')

  return await query.where(column, value).first()
}

const destroy = async (id: number) => {
  return await Coupon.query().where('id', id).delete()
}
export { createCoupon, destroy, getCouponByValue, getCoupons, updateCoupon }
