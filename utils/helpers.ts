const generateRandomOrderNumber = () => {
  let result = 'OD-'
  const characters = '1234567890'
  const charactersLength = characters.length
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
export { generateRandomOrderNumber }
