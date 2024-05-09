import { useState, useContext, useEffect } from 'react';
import { FilterContext } from '../context/filter.context';


function DateRangeForm() {
    const { startDate, setStartDate, endDate, setEndDate, setDateRangeMenu, setRangeSelected } = useContext(FilterContext);
    const [errorMessage, setErrorMessage] = useState('');


    const handleStartDateChange = (e) => {
        e.preventDefault();
        setStartDate(e.target.value);
        localStorage.setItem('startDate', e.target.value);
    };

    const handleEndDateChange = (e) => {
        e.preventDefault();
        setEndDate(e.target.value);
        localStorage.setItem('endDate', e.target.value);
    };

    // When the selected range submitted
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!startDate && !endDate) {
            setErrorMessage('Please select at least one of the dates');
        } else if (!startDate) {
            const earliestDate = new Date(0); // January 1, 1970
            // Convert the automatically added date to selected date format
            const formattedDate = earliestDate.toISOString().split("T")[0];
            setStartDate(formattedDate);
            localStorage.setItem('startDate', formattedDate);
            setDateRangeMenu(false);
            setRangeSelected(true);
        } else if (!endDate) {
            const currentDate = new Date();
            // Convert the automatically added date to selected date format
            const formattedDate = currentDate.toISOString().split("T")[0];
            setEndDate(formattedDate);
            localStorage.setItem('endDate', formattedDate);
            setDateRangeMenu(false);
            setRangeSelected(true);
        }
        else {
            setDateRangeMenu(false);
            setRangeSelected(true);
        }
    };


    // Future dates can't be selected / define max date
    const getMaxDate = () => {
        const today = new Date().toISOString().split('T')[0];
        return today;
    };

    // Get min date


    // In every page reload, get selected range from localStorage
    useEffect(() => {
        const sDate = localStorage.getItem('startDate');
        setStartDate(sDate || null);
        const eDate = localStorage.getItem('endDate');
        setEndDate(eDate || null);
    }, []);


    // Clear range button
    const handleClear = () => {
        localStorage.removeItem('startDate');
        localStorage.removeItem('endDate');
        setStartDate(null);
        setEndDate(null);
        setRangeSelected(false);
    };


    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center text-lg">
            <div className='flex'>
                <div className='flex flex-col items-center mx-2'>
                    <label htmlFor="startDate" className="mt-4 mb-2 font-semibold">Starting on</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate || ''}
                        onChange={handleStartDateChange}
                        className="border rounded-md p-1 text-black"
                        // Max date is EndDate if selected, if not today | Min date as early as the calendar goes
                        max={endDate ? endDate : getMaxDate()}
                    />
                </div>
                <div className='flex flex-col items-center mx-2  font-semibold'>
                    <label htmlFor="endDate" className="mt-4 mb-2">Ending on</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate || ''}
                        onChange={handleEndDateChange}
                        className="border rounded-md p-1 text-black"
                        // Max date is today | Min date is startDate
                        max={getMaxDate()}
                        min={startDate}
                    />
                </div>
            </div>
            <div className='flex items-center'>
                <button type="submit" className="px-2 py-1 mx-1 mt-4 mb-2 border rounded-md border-black dark:border-slate-300 hover:bg-neutral-700 hover:text-white
            dark:hover:bg-white dark:hover:text-black  hover:border-transparent cursor-pointer">
                    Submit
                </button>
                <button onClick={handleClear} className="px-2 py-1 mx-1 mt-4 mb-2 border rounded-md border-black dark:border-slate-300 hover:bg-neutral-700 hover:text-white
            dark:hover:bg-white dark:hover:text-black  hover:border-transparent cursor-pointer">Clear</button>
            </div>
            <p className=''>{errorMessage}</p>
        </form>
    );
}

export default DateRangeForm;
