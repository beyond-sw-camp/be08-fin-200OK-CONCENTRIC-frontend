<template>
  <g-gantt-chart
      chart-start="2021-07-12 12:00"
      chart-end="2021-07-14 12:00"
      precision="hour"
      bar-start="myBeginDate"
      bar-end="myEndDate"
  >
    <g-gantt-row label="dlfeks 1qjs" :bars="row1BarList" />
    <g-gantt-row label="durlsms 2qjs" :bars="row2BarList" />
  </g-gantt-chart>
</template>

<script setup>
import { ref } from "vue"
import {GGanttChart, GGanttRow} from "@infectoone/vue-ganttastic";
const row1BarList = ref([
  {
    myBeginDate: "2021-07-13 13:00",
    myEndDate: "2021-07-13 19:00",
    ganttBarConfig: {
      // each bar must have a nested ganttBarConfig object ...
      id: "unique-id-1", // ... and a unique "id" property
      label: "ajajrwl"
    }
  }
])
const row2BarList = ref([
  {
    myBeginDate: "2021-07-13 00:00",
    myEndDate: "2021-07-14 02:00",
    ganttBarConfig: {
      id: "another-unique-id-2",
      hasHandles: true,
      label: "qorhvmek",
      style: {
        // arbitrary CSS styling for your bar
        background: "#e09b69",
        borderRadius: "20px",
        color: "black"
      },
      class: "foo" // you can also add CSS classes to your bars!
    }
  }
])
</script>