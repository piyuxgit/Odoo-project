// Format currency globally
export const formatCurrency = (amount, currencyCode = 'INR') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return `$${amount}`;
  }
};
