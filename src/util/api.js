import { API_URL } from "../resources/constants";
import axios from "axios";

export const requestPrice = async ({ slug, token, storeId }) => {
  const url = API_URL + slug;

  const {
    data: {
      dynamicPDP: {
        data: {
          productData: { sKUs }
        }
      }
    }
  } = await axios(
    url,
    {},
    {
      headers: {
        token,
        storeId
      }
    }
  );

  return sKUs;
};
