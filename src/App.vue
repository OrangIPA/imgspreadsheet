<script setup lang="ts">
import { ref } from "vue";
import getColorArray from "./getColorArray";
import XLSX from "xlsx-js-style";
import rgbToHex from "./rgbToHex";
import { useColorMode } from "@vueuse/core";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mode = useColorMode();
mode.value = "dark";

type CellParam = {
  v: string;
  t: string;
  s: {
    fill: {
      fgColor: {
        rgb: string;
      };
    };
  };
};

const imgInput = ref<InstanceType<typeof Input> | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

getColorArray(imgInput, canvas, (colorArray) => {
  const wb = XLSX.utils.book_new();

  const rows: CellParam[][] = [];
  for (const colorRow of colorArray) {
    const row: CellParam[] = [];
    for (const color of colorRow) {
      const hexColor = rgbToHex(color.r, color.g, color.b);
      row.push({ v: "", t: "s", s: { fill: { fgColor: { rgb: hexColor } } } });
    }
    rows.push(row);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);

  if (!ws["!cols"]) ws["!cols"] = []
  for (let i = 0; i < colorArray.length; i++) {
    ws["!cols"][i] = {wpx: 20}
  }
  if (!ws["!rows"]) ws["!rows"] = []
  for (let i = 0; i < colorArray[0].length; i++) {
    ws["!rows"][i] = {hpx: 20}
  }

  XLSX.utils.book_append_sheet(wb, ws);
  XLSX.writeFile(wb, "yahaha.xlsx");
});
</script>

<template>
  <header class="flex align-middle justify-center p-2">
    <h1 class="text-5xl">Imeg to Spredshit</h1>
  </header>
  <div class="flex align-middle justify-center w-screen">
    <p class="font-normal w-3/5 text-center"></p>
  </div>
  <div class="flex align-middle justify-center">
    <div class="grid w-screen max-w-sm items-center gap-1.5 pt-9">
      <Label for="imgInput">Pilih Gambar</Label>
      <Input id="imgInput" ref="imgInput" accept="image/" type="file" />
    </div>
  </div>
  <canvas ref="canvas" style="display: none"></canvas>
</template>
