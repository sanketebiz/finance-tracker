export const generateIdFromName = (value) => value.toLowerCase().split(' ').join('-');
export const getFormattedName = (value) => value[0].toUpperCase() + value.slice(1, value.length).split('_').join(' ');
export const generateId = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return Array(7).fill().map(() => numbers[Math.round(Math.random() * 9)]).join('');
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
});
export const formatCurrency = (amount) => {
    return formatter.format(amount)
}