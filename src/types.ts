export type ListItem = {
  name: string;
  slug: string;
}

export type PriceItem =  {
  name: string;
  price: string;
}

export type PriceArr = {
  [pinCode: number]: {
    [product: string]: PriceItem[];
  };
};