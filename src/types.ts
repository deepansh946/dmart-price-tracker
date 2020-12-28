export type ListItem = {
  name: string;
  slug: string;
};

export type PriceItem = {
  name: string;
  price: string;
};

export type PincodesArr = {
  pin: string;
};

export type PriceArr = {
  [pinCode: string]: {
    [product: string]: PriceItem[];
  };
};

export interface DmartAPIRes {
  name: string;
  priceSALE: string;
}
