import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { getBankTransactions } from "../API/plaid.api";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import getSymbolFromCurrency from 'currency-symbol-map';

function Transactions({ currBank }) {
    const [recentTransactions, setRecentTransactions] = useState([]);
    const navigate = useNavigate();

    // Retrieve transactions
    const retrieveTransactions = async (currBank) => {
        if (currBank) {
            try {
                const params = { user_id: currBank.user_id, bank_id: currBank._id };
                const transactions = await getBankTransactions(params);
                setRecentTransactions(transactions.data.added_transactions.slice(0, 5));
                console.log(transactions.data.added_transactions.slice(0, 5));
            } catch (error) {
                console.log('Error retrieving transactions', error);
            }
        }
    };

    // When bank is selected, retrieve transactions
    useEffect(() => {
        retrieveTransactions(currBank);
    }, [currBank]);

    // Redirect to SingleTransaction with props
    const handleRowClick = (input) => {
        navigate('/transaction', { state: { transaction: input } });
        console.log(input);
    };


    return (
        <div>
            <h2 className="text-3xl py-10 text-center">{`${currBank ? currBank.institution_name : ''} Recent Transactions`}</h2>

            <table className="box-border">
                <thead className="text-lg h-10 bg-black bg-opacity-20">
                    <tr>
                        <th className="px-10">Transaction</th>
                        <th className="px-10">Date</th>
                        <th className="px-10">Category</th>
                        <th className="px-10">Amount</th>
                    </tr>
                </thead>
                <tbody className="text-xl text-center">
                    {recentTransactions && recentTransactions.map(tran => {
                        return (
                            <tr key={uuidv4()} onClick={() => handleRowClick(tran)}
                                className="text-lg border-b dark:hover:bg-blue-800 hover:bg-opacity-15 hover:bg-black cursor-pointer">
                                {/* <td>{tran.account_details.institution_name}</td> */}
                                <td className="px-10 py-2 text-center flex items-center">
                                    <div className="h-10 my-1">
                                        {tran.logo_url && <img src={tran.logo_url} className="h-10 mr-6" />}
                                    </div>
                                    {tran.name}
                                </td>
                                <td>{format(new Date(tran.date), "MMM dd, yyyy")}</td>
                                <td>{tran.category[0]}</td>
                                <td>{`${tran.amount}${getSymbolFromCurrency(tran.iso_currency_code)}`}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {!currBank && (
                <div className="flex justify-center">
                    <h1 className="text-lg pt-6">No bank selected.</h1>
                </div>
            )}
        </div>
    );
}

export default Transactions;
