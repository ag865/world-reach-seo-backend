import env from '#start/env'

const generateRandomOrderNumber = () => {
  let result = 'OD-'
  const characters = '1234567890'
  const charactersLength = characters.length
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const getUniqueByKey = (array: any[], key: string) => {
  return Object.values(
    array.reduce((uniqueMap, obj) => {
      if (!uniqueMap[obj[key]]) {
        uniqueMap[obj[key]] = obj
      }
      return uniqueMap
    }, {})
  )
}

const inProduction = () => {
  return env.get('APP_MODE') === 'production'
}

export { generateRandomOrderNumber, getUniqueByKey, inProduction }
