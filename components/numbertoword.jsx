export function convertNumberToWords(amount) {
  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const teens = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const scales = ['', 'thousand', 'lakh', 'crore'];

  const convertLessThanThousand = (n) => {
    if (n <= 10) return units[n];
    else if (n < 20) return teens[n - 11];
    else if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
    else {
      return units[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' and ' + convertLessThanThousand(n % 100) : '');
    }
  };

  const convertAmountToWords = (amount) => {
    let wholePart = Math.floor(amount);
    const decimalPart = Math.round((amount - wholePart) * 100); // up to two decimal places
    let words = [];
    let scaleIndex = 0;

    if (wholePart === 0) {
      return 'zero kuwaiti dinar only';
    }

    while (wholePart > 0) {
      const chunk = wholePart % 1000;
      if (chunk !== 0) {
        words.unshift(convertLessThanThousand(chunk) + ' ' + scales[scaleIndex]);
      }
      wholePart = Math.floor(wholePart / 1000);
      scaleIndex++;
    }

    const wholeWords = words.join(' ') + ' kuwaiti dinar';
    const decimalWords = decimalPart > 0 ? ' and ' + convertLessThanThousand(decimalPart) + ' fills' : '';

    return wholeWords + decimalWords + ' only';
  };

  return convertAmountToWords(amount);
}
