import { API_URL, PIN_CODES } from "../resources/constants";
import axios from "axios";
import { PriceArr, PriceItem, ListItem} from '../types'

export const requestPrice = async ({ list }) => {
  try {
    let pricesWithPincodes = {};
    for (const { storeId, code } of PIN_CODES) {
      let prices = {};

      for (const { slug } of list ) {
        const url = API_URL + slug;
        const {
          data: {
            dynamicPDP: {
              data: {
                productData: { sKUs }
              }
            }
          }
        } = await axios.get(url, {
          headers: {
            storeId
          }
        });
        const data = sKUs.map(({ priceSALE: price, name }) => ({
          name,
          price
        }));
        prices = {
          ...prices,
          [slug]: data
        };
      }

      pricesWithPincodes = {
        ...pricesWithPincodes,
        [code]: prices
      };
    }

    return pricesWithPincodes;
  } catch (err) {
    throw err;
  }
};
