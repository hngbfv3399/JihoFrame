import { createState } from "../../src/Jiho/jihoFunc";

const count = createState(0);

export default function Counter() {
  return {
    layout: [
      {
        div: {
          h2: { text: `Count: ${count.value}` },
          button: {
            text: "+1",
            onclick: () => count.set(count.value + 1)
          }
        }
      }
    ]
  };
}
