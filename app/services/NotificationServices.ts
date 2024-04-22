import Notification from '#models/Notification'

const create = async (
  orderNumber: string,
  forUser: 'Admin' | 'Client',
  heading: string,
  message: string,
  userId?: number
) => {
  return await Notification.create({
    orderNumber,
    for: forUser,
    heading,
    message,
    userId,
  })
}

const update = async (id: number) => {
  await Notification.query().where('id', id).update({
    read: true,
  })
}

export { create, update }
