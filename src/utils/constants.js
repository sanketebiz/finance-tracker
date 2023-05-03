export const monthYearOptions = [
    { label: '-- select option --', value: '' },
    { label: 'Jan 2023', value: 'jan-2023' },
    { label: 'Feb 2023', value: 'feb-2023' },
    { label: 'Mar 2023', value: 'mar-2023' },
    { label: 'Apr 2023', value: 'apr-2023' },
    { label: 'May 2023', value: 'may-2023' },
    { label: 'Jun 2023', value: 'jun-2023' },
    { label: 'Jul 2023', value: 'jul-2023' },
    { label: 'Aug 2023', value: 'aug-2023' },
    { label: 'Sep 2023', value: 'sep-2023' },
    { label: 'Oct 2023', value: 'oct-2023' },
    { label: 'Nov 2023', value: 'nov-2023' },
    { label: 'Des 2023', value: 'des-2023' },
];


export const transactionTypeOptions = [
    { label: '-- select option --', value: '' },
    { label: 'Home Expense', value: 'home-expense' },
    { label: 'Personal Expense', value: 'personal-expense' },
    { label: 'Income', value: 'income-expense' },
];

export const accountOptions = [
    { label: '-- select option --', value: '' },
    { label: 'Personal Account', value: 'personal-account' },
    { label: 'Real Living', value: 'real-living' },
    { label: 'My Dream Home', value: 'my-dream-home' },
    { label: 'Full Circle', value: 'full-circle' },
    { label: 'Core Realtors', value: 'core-realors' },
    { label: 'Big Block', value: 'big-block' },
];

export const groupByOptions = [
    { label: '-- none --', value: '' },
    { label: 'Month Year', value: 'month_year' },
    { label: 'Transaction Type', value: 'type' },
    { label: 'From Account', value: 'from_account' },
    { label: 'To Account', value: 'to_account' },
];

export const columnTypes = {
    id: 'number',
    date: 'date',
    month_year: 'string',
    type: 'string',
    from_account: 'string',
    to_account: 'string',
    amount: 'currency',
    receipt: 'file',
    notes: 'string',
};

export const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg']