import { useRecoilState } from "recoil";
import { transactionsListState } from "../atoms/transactionState";

export const useTransaction = () => {
    const [transactionsList, setTransactionsList] = useRecoilState(transactionsListState);

    function addTransaction(id, balance) {
        setTransactionsList((transactionsList) => [
            ...transactionsList,
            {
                id,
                balance
            }
        ])
    }

    function deleteTransaction(id) {
        setTransactionsList((transactionsList) =>
            transactionsList.filter((transaction) =>
                transaction.id != id
            )
        )
    }
 return {transactionsList,addTransaction,deleteTransaction};
}