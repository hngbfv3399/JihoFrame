import { createState } from "../src/Jiho/jihoFunc.js";
import { renderApp } from "../src/Jiho/jihoRender.js";

// 전부 전역 등록
window.JihoFrame = {
  createState,
  renderApp
};
