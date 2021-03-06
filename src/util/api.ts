import { API_URL, PIN_CODES } from '../resources/constants'
import axios from 'axios'
import { DmartAPIRes, PriceArr, Item, getKeyValue, PinCodes } from '../types'

export const requestPrice = async (
  list: Item[],
  pinCodes: PinCodes[]
): Promise<PriceArr> => {
  try {
    let pricesWithPincodes = {}
    for (const { storeId, code } of pinCodes) {
      let prices = {}

      for (const { slug, name } of list) {
        const url = API_URL + slug
        const {
          data: {
            dynamicPDP: {
              data: {
                productData: { sKUs },
              },
            },
          },
        } = await axios.get(url, {
          headers: {
            storeId,
          },
          params: {
            channel: 'web',
            profile: 'details',
          },
        })
        if (sKUs) {
          const data = sKUs.map(
            ({ priceSALE: price, name: dmartName }: DmartAPIRes) => ({
              name: (name + dmartName.split(':')[1]).trim(),
              price,
            })
          )
          prices = {
            ...prices,
            [slug]: data,
          }
        }
      }

      pricesWithPincodes = {
        ...pricesWithPincodes,
        [code]: prices,
      }
    }

    let excelFormat = {} as any

    const pins = Object.keys(pricesWithPincodes)

    const temp = Object.values(pricesWithPincodes)

    temp.forEach((obj: any, index: number) => {
      const keys = Object.values(obj)
      keys.forEach((key: any) => {
        key.forEach((ob: any) => {
          const { name, price } = ob

          excelFormat = {
            ...excelFormat,
            [name]: [
              ...(getKeyValue(excelFormat, name)
                ? getKeyValue(excelFormat, name)
                : []),
              {
                pin: pins[index],
                price,
              },
            ],
          }
        })
      })
    })

    return excelFormat
  } catch (err) {
    throw err
  }
}
