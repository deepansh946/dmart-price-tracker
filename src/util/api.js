import { API_URL } from "../resources/constants";
import axios from "axios";

export const requestPrice = async ({ list, token, storeId }) => {
  try {
    let prices = {};

    for (const { slug } of list) {
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
          dm_token: token,
          storeId
        }
      });

      const data = sKUs.map(({ priceSALE: price, name }) => ({ name, price }));

      prices = {
        ...prices,
        [slug]: data
      };
    }

    return prices;
  } catch (err) {
    throw err;
  }
};
