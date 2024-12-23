import countries from 'i18n-iso-countries'

export const getCountryISOCode = (countryName: string) => {
  const countryISOCode = countries.getAlpha2Code(countryName, 'en')
  if (countryISOCode) {
    return countryISOCode
  } else {
    return undefined
  }
}

export const getCountryNameFromISOCode = (countryCode: string) => {
  const countryName = countries.getName(countryCode, 'en')
  if (countryName) {
    return countryName
  } else {
    return undefined
  }
}
