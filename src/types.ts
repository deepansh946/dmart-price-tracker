import { Dispatch, SetStateAction } from 'react'
import { RouteComponentProps } from 'react-router-dom'

export type ListItem = {
  [cart: string]: any
}

export type PriceItem = {
  name: string
  price: string
}

export type PincodesArr = {
  pin: string
}

export type PriceArr = {
  [pinCode: string]: {
    [product: string]: PriceItem[]
  }
}

export interface DmartAPIRes {
  name: string
  priceSALE: string
}

export type AddModalProps = {
  show: Boolean
  setModal: Dispatch<SetStateAction<boolean>>
  onConfirm: (arg0: string) => void
}

interface MatchParams {
  cart: string
}

export interface CartProps extends RouteComponentProps<MatchParams> {}

export const getKeyValue = <T, K extends keyof T>(obj: T, key: K): T[K] =>
  obj[key]

export interface Item {
  name: string
  slug: string
}
