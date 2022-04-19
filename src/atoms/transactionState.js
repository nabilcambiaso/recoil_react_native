import { atom, selector } from "recoil";

export const transactionsListState = atom({
    key: 'transactionsListState',
    default: []
})

export const transactionsListSize = selector({
    key:'TransactionlistSize',
    get:({get})=>(get(transactionsListState)).length
})