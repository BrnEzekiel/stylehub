export const formatCurrency = (value) => {
    if (!value) return 'Ksh 0.00';
    const numericValue = parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
    if (isNaN(numericValue)) return value;
  
    if (numericValue >= 1000000) {
      return `Ksh ${(numericValue / 1000000).toFixed(1)}M`;
    }
    if (numericValue >= 1000) {
      return `Ksh ${(numericValue / 1000).toFixed(1)}K`;
    }
    return `Ksh ${numericValue.toFixed(2)}`;
  };
