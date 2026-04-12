<script setup lang="ts">
import { computed } from "vue";

interface FinancialData {
  categories: string[];
  income: number[];
  outcome: number[];
}

const props = defineProps<{
  data?: FinancialData;
}>();

const fallbackCategories = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Use backend data or fallback to static data
const series = computed(() => [
  {
    name: "Income",
    data: props.data?.income || [5, 15, 10, 18, 25, 22, 35, 28, 24, 30, 28, 25],
  },
  {
    name: "Outcome",
    data: props.data?.outcome || [15, 22, 20, 25, 30, 45, 55, 45, 40, 58, 62, 55],
  },
]);

const chartKey = computed(() =>
  JSON.stringify({
    categories: props.data?.categories || fallbackCategories,
    income: props.data?.income || [],
    outcome: props.data?.outcome || [],
  }),
);

const yAxisMax = computed(() => {
  const values = [...(props.data?.income || []), ...(props.data?.outcome || [])];
  const maxValue = Math.max(...values, 0);

  if (maxValue <= 0) {
    return 10;
  }

  return Math.ceil(maxValue * 1.2);
});

const chartOptions = computed(() => ({
  chart: {
    type: "area",
    height: 300,
    toolbar: {
      show: false,
    },
    fontFamily: "inherit",
  },
  colors: ["#012D5A", "#EF4444"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  markers: {
    size: 4,
    colors: ["#fff"],
    strokeColors: ["#012D5A", "#EF4444"],
    strokeWidth: 2,
    hover: {
      size: 6,
    },
  },
  xaxis: {
    categories: props.data?.categories || fallbackCategories,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: "#64748b",
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    max: yAxisMax.value,
    tickAmount: 5,
    labels: {
      style: {
        colors: "#64748b",
        fontSize: "12px",
      },
    },
  },
  grid: {
    borderColor: "#e2e8f0",
    strokeDashArray: 4,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 10,
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    offsetY: -20,
    markers: {
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return "Rp " + val + "jt";
      },
    },
  },
}));
</script>

<template>
  <div class="h-full flex flex-col pt-6 px-6 bg-card rounded-xl border border-border shadow-sm">
    <div class="mb-2">
      <h3 class="font-semibold text-lg">Financial Overview</h3>
    </div>

    <div class="flex-1 w-full min-h-[300px]">
      <ClientOnly>
        <apexchart
          :key="chartKey"
          type="area"
          height="320"
          :options="chartOptions"
          :series="series"
        />
      </ClientOnly>
    </div>
  </div>
</template>
