import { Dispatch, SetStateAction } from 'react'
import { RouteComponentProps } from 'react-router-dom'

export type ListItem = {
  [cart: string]: any
}

export type PriceItem = {
  name: string
  price: string
}

type Price = {
  pin: string
  price: string
}

export interface PinCodes {
  code: string
  storeId: string
}

export type PriceArr = {
  [name: string]: Price[]
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

export interface ButtonInterface
  extends React.MouseEvent<HTMLElement, MouseEvent> {
  target: EventTarget
}
