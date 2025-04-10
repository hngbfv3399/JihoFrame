export function renderApp(component, root) {
    const resolveComponent = (comp) => {
      if (typeof comp === "function") {
        return comp();
      }
      return comp;
    };
  
    const createElement = (node) => {
      const tag = Object.keys(node)[0];
      const props = node[tag];
      const el = document.createElement(tag);
  
      for (const [key, value] of Object.entries(props)) {
        if (key === "text") {
          el.textContent = value;
        } else if (key === "onclick") {
          el.addEventListener("click", value);
        } else if (key === "style") {
          Object.assign(el.style, value);
        } else if (key === "event" && Array.isArray(value)) {
          value.forEach((ev) => {
            const [eventName, handler] = Object.entries(ev)[0];
            el.addEventListener(eventName.slice(2).toLowerCase(), handler);
          });
        } else {
          el.setAttribute(key, value);
        }
      }
  
      return el;
    };
  
    const renderLayout = (layout, container) => {
      layout.forEach((item) => {
        if (typeof item === "function") {
          const resolved = resolveComponent(item);
          renderLayout(resolved.layout, container);
        } else {
          const el = createElement(item);
          container.appendChild(el);
        }
      });
    };
  
    const result = resolveComponent(component);
    root.innerHTML = "";
    renderLayout(result.layout, root);
  }
  