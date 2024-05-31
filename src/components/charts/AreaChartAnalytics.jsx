import { useState, useContext, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { FilterContext } from '@/context/filter.context';
import { AuthContext } from '@/context/auth.context';


// Notes:
// 1. Numbers should be reflected as negative
// 2. Reverse the order
// 3. Currency sign
// 4. Maybe add a year to month format "Mar, 24"


function AreaChartAnalytics({ formatDate }) {
    const { selectedMonth, rangeSelected, allTransactions, startDate, endDate, analyticsInput
        ,

    } = useContext(FilterContext);
    const [finalData, setFinalData] = useState(null);

    // Function to parse monthSelectedInFilter in "MMM 'YY" format
    const parseMonthSelected = (dateStr) => {
        const [month, year] = dateStr.split(' ');
        const monthIndex = new Date(Date.parse(month + " 1, 2020")).getMonth();
        const fullYear = `20${year}`;
        return new Date(fullYear, monthIndex);
    };

    // Loop to generate 6 months of formatted dates
    const listLastSixMonths = () => {
        const formattedDates = [];
        // If range isn't selected, show last six month either from today or from selected month
        if (!startDate && !endDate) {
            const end = selectedMonth ? parseMonthSelected(selectedMonth) : new Date();
            for (let i = 5; i >= 0; i--) {
                // Calculate the month and year for the current iteration
                const month = end.getMonth() - i;
                const year = end.getFullYear();
                const date = new Date(year, month + 1, 0);
                // Format the date to "Mar'24" format
                const formattedDate = formatDate(date);
                const monthAmount = { month: formattedDate, amount: 0 };
                formattedDates.push(monthAmount);
            }
        } else {
            // If there's range selected, only show those months in the range
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Iterate from startDate to endDate by month
            for (let date = start; date <= end; date.setMonth(date.getMonth() + 1)) {
                const formattedDate = formatDate(date);
                const monthAmount = { month: formattedDate, amount: 0 };
                formattedDates.push(monthAmount);
            }
        }
        return formattedDates;
    };

    // Add data for the list of dates to be presented
    const addData = () => {
        if (analyticsInput) {
            // If range is selected, use allTransactions, if not, use the copy of data
            // The reason is allTransactions are modified by the filter selection
            // In date range, it's fine but if Month selected, allTransactions include only that month
            const rawTransactions = !rangeSelected ? JSON.parse(JSON.stringify(analyticsInput)) : JSON.parse(JSON.stringify(allTransactions));
            // console.log('Raw Transactions', rawTransactions);
            let datesList = listLastSixMonths();
            console.log('Dates list', datesList);
            {
                rawTransactions && rawTransactions.length > 0 &&
                    rawTransactions.forEach(tran => {
                        const tranMonth = new Date(tran.authorized_date);
                        const formattedTranMonth = formatDate(tranMonth);
                        datesList.forEach(object => {
                            if (formattedTranMonth === object.month && tran.amount > 0) {
                                object.amount += Math.round(tran.amount);
                            }
                        });
                    });
            }
            return datesList;
        } else {
            // If no data, show some dummy empty table
            const noData = listLastSixMonths();
            return noData;
        }
    };


    // Run every time filter updated or reloaded
    useEffect(() => {
        // console.log(allTransactions); //Checking if bank changes are reflected in input data
        // formData();
        console.log('All transactions', allTransactions);
        const formattedDates = addData();
        setFinalData(formattedDates);
    }, [allTransactions, selectedMonth, startDate, endDate]);


    return (
        <div className='h-full w-full mx-1 px-1 pt-4 bg-black bg-opacity-15 rounded-lg'>
            {finalData && finalData.length > 0 &&
                <ResponsiveContainer width="100%" height="100%" >
                    <AreaChart
                        width={500}
                        height={400}
                        data={finalData}
                        margin={{
                            top: 10,
                            right: 40,
                            left: 4,
                            bottom: 25,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month">
                            <Label position={'insideBottom'} dy={17}>Total Spending</Label>
                        </XAxis>
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
            }
        </div>
    );
}


export default AreaChartAnalytics;
