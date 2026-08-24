const INDONESIAN_ONES = [
  "",
  "Satu",
  "Dua",
  "Tiga",
  "Empat",
  "Lima",
  "Enam",
  "Tujuh",
  "Delapan",
  "Sembilan",
  "Sepuluh",
  "Sebelas",
];

const ENGLISH_ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const ENGLISH_TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

export function numberToIndonesianWords(value: number): string {
  const number = Math.floor(Number(value || 0));
  if (number === 0) return "";
  if (number < 12) return INDONESIAN_ONES[number] || "";
  if (number < 20) return `${numberToIndonesianWords(number - 10)} Belas`;
  if (number < 100) {
    const tens = Math.floor(number / 10);
    const rest = number % 10;
    return `${tens === 1 ? "Sepuluh" : `${INDONESIAN_ONES[tens]} Puluh`}${
      rest > 0 ? ` ${numberToIndonesianWords(rest)}` : ""
    }`;
  }
  if (number < 1000) {
    const hundreds = Math.floor(number / 100);
    const rest = number % 100;
    return `${hundreds === 1 ? "Seratus" : `${INDONESIAN_ONES[hundreds]} Ratus`}${
      rest > 0 ? ` ${numberToIndonesianWords(rest)}` : ""
    }`;
  }
  if (number < 1000000) {
    const thousands = Math.floor(number / 1000);
    const rest = number % 1000;
    return `${thousands === 1 ? "Seribu" : `${numberToIndonesianWords(thousands)} Ribu`}${
      rest > 0 ? ` ${numberToIndonesianWords(rest)}` : ""
    }`;
  }
  if (number < 1000000000) {
    const millions = Math.floor(number / 1000000);
    const rest = number % 1000000;
    return `${numberToIndonesianWords(millions)} Juta${
      rest > 0 ? ` ${numberToIndonesianWords(rest)}` : ""
    }`;
  }
  if (number < 1000000000000) {
    const billions = Math.floor(number / 1000000000);
    const rest = number % 1000000000;
    return `${numberToIndonesianWords(billions)} Miliar${
      rest > 0 ? ` ${numberToIndonesianWords(rest)}` : ""
    }`;
  }
  return "";
}

function convertEnglishChunk(value: number): string {
  let number = value;
  let words = "";
  if (number >= 100) {
    words += `${ENGLISH_ONES[Math.floor(number / 100)]} Hundred `;
    number %= 100;
  }
  if (number >= 20) {
    words += `${ENGLISH_TENS[Math.floor(number / 10)]} `;
    number %= 10;
  }
  if (number > 0) words += `${ENGLISH_ONES[number]} `;
  return words.trim();
}

export function numberToEnglishWords(value: number): string {
  let number = Math.floor(Number(value || 0));
  if (number === 0) return "Zero";

  const scales = ["", "Thousand", "Million", "Billion", "Trillion"];
  let scaleIndex = 0;
  let words = "";

  while (number > 0) {
    const chunk = number % 1000;
    if (chunk > 0) {
      words = `${convertEnglishChunk(chunk)}${
        scales[scaleIndex] ? ` ${scales[scaleIndex]}` : ""
      } ${words}`;
    }
    number = Math.floor(number / 1000);
    scaleIndex++;
  }

  return words.trim();
}

export function formatAmountInWords(amount: number, currency: string): string {
  const roundedAmount = Math.floor(Number(amount || 0));
  if (!roundedAmount) return "";

  if (currency === "USD") return `${numberToEnglishWords(roundedAmount)} Dollars`;

  return `${numberToIndonesianWords(roundedAmount)} Rupiah / ${numberToEnglishWords(
    roundedAmount,
  )} Rupiahs`;
}
