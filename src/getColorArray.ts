import { Ref, onMounted } from "vue";
import { Input } from "./components/ui/input";

export default function(imgInput: Ref<InstanceType<typeof Input> | null>, canvas: Ref<HTMLCanvasElement | null>, callback: (colorArray: {r: number, g: number, b: number, a: number}[][]) => void) {
  onMounted(() => {
    const ctx = canvas.value?.getContext("2d");
  
    imgInput.value?.inputRef?.addEventListener("change", (event): any => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
  
        img.onload = () => {
          canvas.value!.width = img.width;
          canvas.value!.height = img.height;
          ctx?.drawImage(img, 0, 0);
  
          const imageData = ctx?.getImageData(
            0,
            0,
            canvas.value!.width,
            canvas.value!.height
          );
          const colorArray: {r: number, g: number, b: number, a: number}[][] = [];
  
          for (let y = 0; y < imageData!.height; y++) {
            const row: {r: number, g: number, b: number, a: number}[] = [];
            for (let x = 0; x < imageData!.width; x++) {
              const offset = (y * imageData!.width + x) * 4;
              const pixel = {
                r: imageData!.data[offset],
                g: imageData!.data[offset + 1],
                b: imageData!.data[offset + 2],
                a: imageData!.data[offset + 3],
              };
              row.push(pixel);
            }
            colorArray.push(row)
          }
          callback(colorArray)
        };
        img.src = e.target!.result as string
      };
      reader.readAsDataURL(file)
    });
    
  })
}