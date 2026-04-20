import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const formatDate = (date) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};
const formatDateTime = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
function toNumber(value) {
  if (value === null || value === void 0) {
    return 0;
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    return Number.parseFloat(value);
  }
  if (typeof value === "object" && value !== null && "toString" in value) {
    return Number.parseFloat(String(value));
  }
  return 0;
}
function formatRupiah(value) {
  const num = toNumber(value);
  if (isNaN(num)) return "Rp0";
  if (num >= 1e12) {
    return `Rp${(num / 1e12).toFixed(1).replace(".", ",")}T`;
  }
  if (num >= 1e9) {
    return `Rp${(num / 1e9).toFixed(1).replace(".", ",")}M`;
  }
  if (num >= 1e6) {
    return `Rp${(num / 1e6).toFixed(1).replace(".", ",")}jt`;
  }
  if (num >= 1e3) {
    return `Rp${(num / 1e3).toFixed(1).replace(".", ",")}rb`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}
function getErrorMessage(err) {
  if (err && typeof err === "object" && "data" in err) {
    const errorData = err.data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "An unknown error occurred";
}

export {
  formatDateTime as a,
  formatDate as b,
  cn as c,
  formatRupiah as f,
  getErrorMessage as g,
  toNumber as t,
};
//# sourceMappingURL=utils-C_kyg7_s.mjs.map
