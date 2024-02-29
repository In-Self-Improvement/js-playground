let samples = ["1"];
const buffer = new ArrayBuffer(2 + samples.length * 2);
const view = new DataView(buffer);

const floatTo16BitPCM = (output, offset, input) => {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
};

floatTo16BitPCM(view, 2, samples);

console.log("view", view);
console.log("sample", samples);
