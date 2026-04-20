import { u as O } from "./D0dPopTU.js";
import { u as B } from "./CJdNv5wq.js";
import { u as H } from "./ighQaoU7.js";
import { u as R } from "./BfskLp3w.js";
import { r as o, q as z, N as x, t as A } from "./D9q6143x.js";
const J = (t) =>
    new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
  I = (t) => {
    if (!t) return "";
    const c = new Date(t);
    return isNaN(c.getTime()) ? "" : c.toISOString().split("T")[0] || "";
  },
  U = (t) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(t),
  $ = (t) => {
    A(`/finance/expenses/${t}`);
  },
  q = [
    { value: "", label: "Pilih Kategori" },
    { value: "trucking", label: "Trucking" },
    { value: "port", label: "Port" },
    { value: "customs", label: "Customs" },
    { value: "handling", label: "Handling" },
    { value: "storage", label: "Storage" },
    { value: "other", label: "Lainnya" },
  ];
function ee() {
  const {
      fetchExpenses: t,
      fetchExpenseById: c,
      deleteExpense: w,
      updateExpense: E,
      isLoading: D,
    } = O(),
    { confirm: F } = R(),
    { companies: T, fetchCompanies: k } = B(),
    { jobs: j, fetchJobs: C } = H(),
    s = o({ search: "", categoryId: "", page: 1, limit: 10 }),
    d = o([]),
    g = o({ total: 0, limit: 10, page: 1, totalPages: 0 }),
    N = o("list"),
    f = o("");
  let y;
  const p = o(!1),
    m = o(!1),
    r = o(null),
    i = o(""),
    n = o({
      number: "",
      description: "",
      amount: 0,
      date: "",
      categoryId: "",
      vendorId: "",
      jobId: "",
      notes: "",
    }),
    P = z(() => D.value);
  (x(
    () => [s.value.search, s.value.categoryId, s.value.page],
    () => {
      l();
    },
    { deep: !0 },
  ),
    x(f, (e) => {
      (clearTimeout(y),
        (y = setTimeout(() => {
          ((s.value.search = e), (s.value.page = 1));
        }, 500)));
    }));
  const l = async () => {
      try {
        const e = await t(s.value);
        ((d.value = e.items), (g.value = e.pagination));
      } catch (e) {
        console.error("Failed to load expenses:", e);
      }
    },
    b = async () => {
      await Promise.all([k({ type: "VENDOR" }), C()]);
    },
    L = (e) => {
      s.value.page = e;
    },
    S = (e) => {
      $(e);
    },
    M = async (e) => {
      try {
        i.value = e;
        const u = await c(e);
        if (!u) throw new Error("Failed to load expense data");
        const a = u;
        (await b(),
          (n.value = {
            number: a.number || "",
            description: a.description || "",
            amount: Number(a.amount) || 0,
            date: I(a.date),
            categoryId: a.categoryId || "",
            vendorId: a.vendor?.id || a.vendorId || "",
            jobId: a.job?.id || a.jobId || "",
            notes: a.notes || "",
          }),
          (p.value = !0),
          (r.value = null));
      } catch (u) {
        (console.error("Failed to open edit modal:", u), (r.value = "Failed to load expense data"));
      }
    },
    h = () => {
      ((p.value = !1), (r.value = null), (i.value = ""));
    };
  return {
    expenses: d,
    filters: s,
    pagination: g,
    viewMode: N,
    searchQuery: f,
    isEditModalOpen: p,
    isSubmitting: m,
    editError: r,
    editingExpenseId: i,
    formData: n,
    categoryOptions: q,
    companies: T,
    jobs: j,
    formatCurrency: U,
    formatDate: J,
    formatDateForInput: I,
    isLoading: P,
    loadExpenses: l,
    loadDropdownData: b,
    handlePageChange: L,
    handleRowClick: S,
    openEditModal: M,
    closeEditModal: h,
    handleUpdate: async () => {
      if (i.value)
        try {
          if (
            ((m.value = !0),
            (r.value = null),
            await E(i.value, {
              number: n.value.number,
              description: n.value.description,
              amount: n.value.amount,
              date: n.value.date,
              categoryId: n.value.categoryId || void 0,
              vendorId: n.value.vendorId || void 0,
              jobId: n.value.jobId || void 0,
              notes: n.value.notes,
            }))
          )
            (h(), await l());
          else throw new Error("Failed to update expense");
        } catch (e) {
          (console.error("Failed to update expense:", e), (r.value = "Failed to update expense"));
        } finally {
          m.value = !1;
        }
    },
    handleDelete: async (e) => {
      const a = d.value.find((v) => v.id === e)?.number || e;
      if (
        await F({
          title: "Hapus Biaya",
          message: `Apakah Anda yakin ingin menghapus biaya ${a}? Tindakan ini tidak dapat dibatalkan.`,
          confirmText: "Hapus",
          cancelText: "Batal",
          type: "danger",
        })
      )
        try {
          (await w(e), l());
        } catch (v) {
          (console.error("Failed to delete expense:", v),
            alert("Gagal menghapus biaya. Silakan coba lagi."));
        }
    },
    initialize: () => {
      l();
    },
  };
}
export { U as f, ee as u };
