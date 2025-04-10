import Counter from "./components/Counter.js";

export default function App() {
  return {
    layout: [
      {
        div: {
          h1: { text: "Hello, Jiho!" }
        }
      },
      Counter
    ]
  };
}
