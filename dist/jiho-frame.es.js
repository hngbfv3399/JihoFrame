let g = {}, x = {}, I = [], v = /* @__PURE__ */ new WeakMap(), k = /* @__PURE__ */ new Set(), N = !1;
const z = [], T = [], $ = /* @__PURE__ */ new Map(), O = [];
function D() {
  if (N)
    return;
  N = !0;
  const t = Array.from(k);
  k.clear(), [...new Set(t)].forEach((n) => {
    try {
      n();
    } catch (r) {
      console.error("JihoFrame: 업데이트 중 오류 발생:", r);
    }
  }), N = !1;
}
function L() {
  k.size > 0 && Promise.resolve().then(D);
}
function be(t) {
  if (typeof t != "function") {
    console.warn("JihoFrame: jihoInit expects a function");
    return;
  }
  z.push(t);
}
function me(t) {
  if (typeof t != "function") {
    console.warn("JihoFrame: jihoMount expects a function");
    return;
  }
  T.push(t);
}
function ye(t, e) {
  if (typeof t != "function") {
    console.warn("JihoFrame: jihoUpdate expects a function as first parameter");
    return;
  }
  $.has(e) || $.set(e, []), $.get(e).push(t);
}
function ge(t) {
  if (typeof t != "function") {
    console.warn("JihoFrame: jihoUnMount expects a function");
    return;
  }
  O.push(t);
}
function xe(t) {
  v.has(t) && (v.get(t).forEach((n) => n()), v.delete(t));
}
function W(t, e) {
  if (typeof t != "string")
    throw new Error("JihoFrame: State key must be a string");
  t in g || (g[t] = e, x[t] = /* @__PURE__ */ new Set());
  const n = {
    // 일관된 API - value 프로퍼티로 통일
    get value() {
      return g[t];
    },
    set value(r) {
      g[t] !== r && (g[t] = r, I.forEach((o) => k.add(o)), $.has(n) && $.get(n).forEach((o) => k.add(o)), x[t].forEach((o) => k.add(o)), L());
    },
    // 기존 API 호환성 유지
    get: () => g[t],
    set: (r) => {
      n.value = r;
    },
    subscribe: (r, o = null) => {
      if (typeof r != "function")
        return console.warn("JihoFrame: subscribe expects a function"), () => {
        };
      x[t].add(r);
      const i = () => x[t].delete(r);
      return o && (v.has(o) || v.set(o, []), v.get(o).push(i)), i;
    }
  };
  return n.get._setter = n.set, n;
}
function j(t, e = null) {
  if (typeof t != "function")
    return console.warn("JihoFrame: subscribeState expects a function"), () => {
    };
  I.push(t);
  const n = () => {
    const r = I.indexOf(t);
    r > -1 && I.splice(r, 1);
  };
  return e && (v.has(e) || v.set(e, []), v.get(e).push(n)), n;
}
function we() {
  return { ...g };
}
function R(t) {
  t ? (delete g[t], x[t] && x[t].clear()) : (g = {}, Object.values(x).forEach((e) => e.clear()), x = {});
}
function ve(t, e) {
  if (typeof e != "function")
    return console.warn("JihoFrame: watchState callback must be a function"), () => {
    };
  if (!x[t])
    return console.warn(`JihoFrame: State key "${t}" does not exist`), () => {
    };
  const n = (r, o) => {
    try {
      e(r, o, t);
    } catch (i) {
      G(i, `watchState callback for ${t}`);
    }
  };
  return x[t].add(n), () => x[t].delete(n);
}
function q(t, e) {
  if (!Array.isArray(t))
    throw new Error("JihoFrame: combineStates expects an array of state objects");
  if (typeof e != "function")
    throw new Error("JihoFrame: combineStates expects a combiner function");
  const n = `combined_${Date.now()}_${Math.random()}`, r = () => {
    const a = t.map((s) => s.value), l = e(...a);
    g[n] !== l && (g[n] = l);
  };
  r();
  const o = t.map(
    (a) => a.subscribe(r)
  ), i = W(n, g[n]);
  return i.cleanup = () => {
    o.forEach((a) => a()), R(n);
  }, i;
}
function Ce(t, e) {
  if (!Array.isArray(t))
    throw new Error("JihoFrame: computedState expects an array of dependencies");
  if (typeof e != "function")
    throw new Error("JihoFrame: computedState expects a computer function");
  return q(t, e);
}
function G(t, e = "Unknown") {
  var n, r;
  console.error(`JihoFrame Error in ${e}:`, t), typeof window < "u" && ((r = (n = window.process) == null ? void 0 : n.env) == null ? void 0 : r.NODE_ENV) === "development" && console.trace();
}
const H = (t = {}) => {
  const {
    left: e = null,
    // 왼쪽 영역 (로고, 메뉴 등)
    center: n = null,
    // 중앙 영역 (제목, 검색바 등)  
    right: r = null,
    // 오른쪽 영역 (버튼들, 프로필 등)
    sticky: o = !0,
    // 스크롤시 고정 여부
    blur: i = !1,
    // 배경 블러 효과
    transparent: a = !1,
    // 투명 배경
    height: l = 60,
    style: s = {},
    ...u
  } = t;
  return {
    div: {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 2fr 1fr",
        // 좌:중앙:우 = 1:2:1 비율
        alignItems: "center",
        height: `${l}px`,
        padding: "0 1rem",
        background: a ? "transparent" : i ? "rgba(255,255,255,0.8)" : "#ffffff",
        backdropFilter: i ? "blur(10px)" : "none",
        borderBottom: a ? "none" : "1px solid #e0e0e0",
        position: o ? "sticky" : "relative",
        top: o ? 0 : "auto",
        zIndex: 100,
        transition: "all 0.3s ease",
        ...s
      },
      "data-jiho-layout": "header",
      children: [
        // 왼쪽 영역
        {
          div: {
            style: { display: "flex", alignItems: "center", justifyContent: "flex-start" },
            children: e ? Array.isArray(e) ? e : [e] : []
          }
        },
        // 중앙 영역  
        {
          div: {
            style: { display: "flex", alignItems: "center", justifyContent: "center" },
            children: n ? Array.isArray(n) ? n : [n] : []
          }
        },
        // 오른쪽 영역
        {
          div: {
            style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" },
            children: r ? Array.isArray(r) ? r : [r] : []
          }
        }
      ]
    }
  };
}, K = (t = {}) => {
  const {
    items: e = [],
    direction: n = "horizontal",
    // horizontal, vertical
    position: r = "bottom",
    // top, bottom, left, right
    style: o = "pills",
    // pills, tabs, breadcrumb, dots
    activeIndex: i = 0,
    onChange: a = () => {
    },
    ...l
  } = t, s = () => {
    const f = {
      display: "flex",
      gap: "0.5rem",
      padding: "0.75rem",
      background: "#ffffff",
      borderRadius: o === "pills" ? "2rem" : "0.5rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    };
    return n === "vertical" && (f.flexDirection = "column"), r === "bottom" && (f.position = "fixed", f.bottom = "1rem", f.left = "50%", f.transform = "translateX(-50%)"), f;
  }, u = (f, c) => {
    const d = {
      padding: "0.5rem 1rem",
      borderRadius: o === "pills" ? "1.5rem" : "0.25rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.9rem",
      fontWeight: c ? "600" : "400",
      textDecoration: "none"
    };
    return c ? (d.background = "#007bff", d.color = "#ffffff") : (d.background = "transparent", d.color = "#666"), d;
  };
  return {
    nav: {
      style: s(),
      "data-jiho-layout": "nav",
      "data-nav-style": o,
      children: e.map((f, c) => ({
        div: {
          style: u(c, c === i),
          event: {
            onClick: () => a(c, f)
          },
          children: [
            f.icon && {
              span: {
                text: f.icon,
                style: { fontSize: "1.2rem" }
              }
            },
            f.label && {
              span: { text: f.label }
            }
          ].filter(Boolean)
        }
      }))
    }
  };
}, P = (t = {}) => {
  const {
    title: e = null,
    subtitle: n = null,
    actions: r = null,
    children: o = [],
    padding: i = "normal",
    // none, tight, normal, loose
    background: a = "default",
    // default, card, gradient, image
    ...l
  } = t, s = {
    none: "0",
    tight: "1rem",
    normal: "1.5rem",
    loose: "2.5rem"
  }, u = {
    default: { background: "transparent" },
    card: {
      background: "#ffffff",
      borderRadius: "0.75rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      border: "1px solid #f0f0f0"
    },
    gradient: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#ffffff"
    }
  };
  return {
    section: {
      style: {
        padding: s[i],
        marginBottom: "1rem",
        ...u[a],
        ...l.style
      },
      "data-jiho-layout": "section",
      children: [
        // 헤더 영역 (제목 + 액션)
        (e || n || r) && {
          div: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem"
            },
            children: [
              // 제목 영역
              (e || n) && {
                div: {
                  children: [
                    e && {
                      h2: {
                        text: e,
                        style: {
                          margin: 0,
                          fontSize: "1.5rem",
                          fontWeight: "600",
                          color: "inherit"
                        }
                      }
                    },
                    n && {
                      p: {
                        text: n,
                        style: {
                          margin: "0.25rem 0 0 0",
                          fontSize: "0.9rem",
                          opacity: 0.7,
                          color: "inherit"
                        }
                      }
                    }
                  ].filter(Boolean)
                }
              },
              // 액션 영역
              r && {
                div: {
                  style: {
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center"
                  },
                  children: Array.isArray(r) ? r : [r]
                }
              }
            ].filter(Boolean)
          }
        },
        // 컨텐츠 영역
        ...o
      ].filter(Boolean)
    }
  };
}, Q = (t = {}) => {
  const {
    cols: e = "auto",
    // 1, 2, 3, 4, 'auto', 'fit'
    gap: n = "1rem",
    minItemWidth: r = "250px",
    // cols가 'auto'일 때 최소 너비
    children: o = [],
    responsive: i = !0,
    ...a
  } = t;
  return {
    div: {
      style: {
        display: "grid",
        gridTemplateColumns: (() => e === "auto" ? `repeat(auto-fit, minmax(${r}, 1fr))` : e === "fit" ? `repeat(auto-fill, minmax(${r}, 1fr))` : i ? `repeat(auto-fit, minmax(max(${r}, ${100 / e}%), 1fr))` : `repeat(${e}, 1fr)`)(),
        gap: n,
        width: "100%",
        ...a.style
      },
      "data-jiho-layout": "grid",
      "data-grid-cols": e,
      children: o
    }
  };
}, X = (t = {}) => {
  const {
    text: e = "",
    type: n = "elevated",
    // elevated, outlined, text, icon
    color: r = "primary",
    // primary, secondary, success, danger, warning
    size: o = "medium",
    // small, medium, large
    disabled: i = !1,
    fullWidth: a = !1,
    startIcon: l = null,
    endIcon: s = null,
    onClick: u = () => {
    },
    ...f
  } = t, c = {
    primary: { main: "#007bff", contrast: "#ffffff", hover: "#0056b3" },
    secondary: { main: "#6c757d", contrast: "#ffffff", hover: "#545b62" },
    success: { main: "#28a745", contrast: "#ffffff", hover: "#1e7e34" },
    danger: { main: "#dc3545", contrast: "#ffffff", hover: "#c82333" },
    warning: { main: "#ffc107", contrast: "#000000", hover: "#e0a800" }
  }, d = {
    small: { padding: "6px 12px", fontSize: "14px", height: "32px" },
    medium: { padding: "10px 20px", fontSize: "16px", height: "40px" },
    large: { padding: "14px 28px", fontSize: "18px", height: "48px" }
  }, p = (m, y) => {
    const F = {
      border: "none",
      borderRadius: "4px",
      cursor: i ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      opacity: i ? 0.6 : 1,
      outline: "none",
      textDecoration: "none",
      ...d[o]
    };
    switch (m) {
      case "elevated":
        return {
          ...F,
          backgroundColor: y.main,
          color: y.contrast,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          "&:hover": i ? {} : {
            backgroundColor: y.hover,
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
          }
        };
      case "outlined":
        return {
          ...F,
          backgroundColor: "transparent",
          color: y.main,
          border: `2px solid ${y.main}`,
          "&:hover": i ? {} : {
            backgroundColor: `${y.main}10`,
            borderColor: y.hover
          }
        };
      case "text":
        return {
          ...F,
          backgroundColor: "transparent",
          color: y.main,
          padding: d[o].padding,
          "&:hover": i ? {} : {
            backgroundColor: `${y.main}10`
          }
        };
      case "icon":
        return {
          ...F,
          backgroundColor: "transparent",
          color: y.main,
          padding: "8px",
          borderRadius: "50%",
          width: d[o].height,
          height: d[o].height,
          minWidth: d[o].height,
          "&:hover": i ? {} : {
            backgroundColor: `${y.main}10`
          }
        };
      default:
        return F;
    }
  }, J = c[r] || c.primary, C = {
    ...p(n, J),
    width: a ? "100%" : "auto",
    ...f.style
  }, S = (m, y) => m ? typeof m == "string" ? {
    span: {
      text: m,
      style: {
        fontSize: o === "small" ? "16px" : o === "large" ? "24px" : "20px"
      }
    }
  } : m : null, E = [];
  return l && E.push(S(l)), e && n !== "icon" && E.push({
    span: { text: e }
  }), s && E.push(S(s)), {
    button: {
      type: "button",
      disabled: i,
      style: C,
      "data-jiho-component": "Button",
      "data-button-type": n,
      "data-button-color": r,
      "data-button-size": o,
      event: {
        onClick: (m) => {
          !i && u && u(m);
        },
        onMouseEnter: (m) => {
          !i && f.onMouseEnter && f.onMouseEnter(m);
        },
        onMouseLeave: (m) => {
          !i && f.onMouseLeave && f.onMouseLeave(m);
        }
      },
      children: E,
      ...f.attributes
    }
  };
};
function h(t, e = "Unknown") {
  var n, r;
  console.error(`JihoFrame Error in ${e}:`, t), typeof window < "u" && ((r = (n = window.process) == null ? void 0 : n.env) == null ? void 0 : r.NODE_ENV) === "development" && console.trace();
}
function b(t, e = "function", n = null) {
  try {
    return t();
  } catch (r) {
    return h(r, e), n;
  }
}
function Y(t, e, n) {
  return e === "function" && typeof t != "function" ? (console.warn(`JihoFrame: Expected function in ${n}, got ${typeof t}`), !1) : !0;
}
function A(t, e, n = "text") {
  if (typeof e == "function") {
    const r = () => {
      const i = b(e, "bindValue update");
      i !== null && (n === "checkbox" ? t.checked = !!i : n === "radio" ? t.checked = t.value === i : t.value = i);
    };
    r();
    const o = j(r);
    t._jihoUnsubscribers ? t._jihoUnsubscribers.push(o) : t._jihoUnsubscribers = [o], t.addEventListener("input", (i) => {
      if (e._setter)
        try {
          n === "checkbox" ? e._setter(i.target.checked) : n === "radio" ? i.target.checked && e._setter(i.target.value) : e._setter(i.target.value);
        } catch (a) {
          h(a, "input event handler");
        }
    });
  } else
    n === "checkbox" ? t.checked = !!e : n === "radio" ? t.checked = t.value === e : t.value = e;
}
function B(t, e) {
  t._jihoUnsubscribers ? t._jihoUnsubscribers.push(e) : t._jihoUnsubscribers = [e];
}
function Z(t, e) {
  if (typeof e == "function") {
    const n = () => {
      const o = b(e, "text update");
      o !== null && (t.textContent = o);
    };
    n();
    const r = j(n);
    B(t, r);
  } else
    e !== void 0 && (t.textContent = e);
}
function ee(t, e) {
  if (e && typeof e == "object")
    try {
      Object.assign(t.style, e);
    } catch (n) {
      h(n, "style application");
    }
}
function te(t, e) {
  Array.isArray(e) ? e.forEach((n) => {
    if (typeof n != "object") {
      console.warn("JihoFrame: Event object must be an object");
      return;
    }
    _(t, n);
  }) : e && typeof e == "object" && _(t, e);
}
function _(t, e) {
  for (const [n, r] of Object.entries(e)) {
    if (!Y(r, "function", `event ${n}`))
      continue;
    const o = n.toLowerCase().replace(/^on/, "");
    t.addEventListener(o, (i) => {
      b(() => r(i), `event handler ${n}`);
    });
  }
}
function M(t, e, n) {
  n.forEach((r) => {
    if (r in e)
      try {
        t[r] = e[r];
      } catch (o) {
        h(o, `setting attribute ${r}`);
      }
  });
}
function ne(t, e) {
  Array.isArray(e) && e.forEach((n) => {
    const r = document.createElement("option");
    typeof n == "string" ? (r.value = n, r.textContent = n) : n && typeof n == "object" && (r.value = n.value || "", r.textContent = n.label || n.value || ""), t.appendChild(r);
  });
}
function re(t, e, n) {
  switch (n) {
    case "input":
      M(t, e, [
        "type",
        "checked",
        "multiple",
        "placeholder",
        "required",
        "name"
      ]);
      const r = e.type || "text";
      A(t, e.value, r);
      break;
    case "textarea":
      M(t, e, ["placeholder", "required", "rows", "cols"]), A(t, e.value);
      break;
    case "select":
      M(t, e, ["multiple", "required", "name"]), ne(t, e.options), A(t, e.value);
      break;
    case "checkbox":
      A(t, e.value, "checkbox");
      break;
    case "radio":
      A(t, e.value, "radio");
      break;
  }
}
function oe(t, e) {
  if (typeof e == "function") {
    const n = () => {
      const o = b(e, "disabled update");
      o !== null && (t.disabled = !!o);
    };
    n();
    const r = j(n);
    B(t, r);
  } else
    e !== void 0 && (t.disabled = !!e);
}
function ie(t, e) {
  if (typeof e == "function") {
    const n = () => {
      const o = b(e, "show update");
      o !== null && (t.style.display = o ? "" : "none");
    };
    n();
    const r = j(n);
    B(t, r);
  } else
    e === !1 && (t.style.display = "none");
}
function ae(t, e, n) {
  if (!e || typeof e != "object") {
    console.warn("JihoFrame: Invalid options passed to applyAttributes");
    return;
  }
  const { text: r, style: o, id: i, className: a, event: l, disabled: s, show: u } = e;
  Z(t, r), ee(t, o), i && (t.id = i), a && (t.className = a), te(t, l), re(t, e, n), oe(t, s), ie(t, u);
}
function ce(t, e) {
  var r;
  if (!e || typeof e != "object")
    return;
  const n = /* @__PURE__ */ new Set([
    "text",
    "style",
    "id",
    "className",
    "event",
    "children",
    "if",
    "elseIf",
    "else",
    "switch",
    "case",
    "default",
    "option",
    "type",
    "value",
    "checked",
    "multiple",
    "placeholder",
    "required",
    "for",
    "each",
    "show",
    "disabled"
  ]);
  if (Object.entries(e).forEach(([o, i]) => {
    if (!n.has(o))
      try {
        const a = typeof i == "function" ? b(i, `child component ${o}`) : i;
        if (!a || typeof a != "object")
          return;
        const l = Object.entries(a);
        if (l.length === 0) {
          console.warn(`JihoFrame: Empty object for child ${o}`);
          return;
        }
        const [s, u] = l[0], f = w(s, u);
        f && t.appendChild(f);
      } catch (a) {
        h(a, `rendering child ${o}`);
      }
  }), Array.isArray(e.children) && e.children.forEach((o, i) => {
    try {
      if (!o || typeof o != "object") {
        console.warn(`JihoFrame: Invalid child at index ${i}`);
        return;
      }
      const a = Object.entries(o);
      if (a.length === 0) {
        console.warn(`JihoFrame: Empty child object at index ${i}`);
        return;
      }
      const [l, s] = a[0], u = w(l, s);
      u && t.appendChild(u);
    } catch (a) {
      h(a, `rendering child at index ${i}`);
    }
  }), (r = e.each) != null && r.list)
    try {
      const o = typeof e.each.list == "function" ? b(e.each.list, "each list function") : e.each.list;
      Array.isArray(o) && typeof e.each.render == "function" && o.forEach((i, a) => {
        try {
          const l = b(() => e.each.render(i, a), `each render at index ${a}`);
          if (l && typeof l == "object") {
            const s = Object.entries(l);
            if (s.length > 0) {
              const [u, f] = s[0], c = w(u, f);
              c && t.appendChild(c);
            }
          }
        } catch (l) {
          h(l, `each item rendering at index ${a}`);
        }
      });
    } catch (o) {
      h(o, "each list processing");
    }
}
function U(t) {
  t._jihoUnsubscribers && (t._jihoUnsubscribers.forEach((e) => {
    try {
      e();
    } catch (n) {
      h(n, "cleanup unsubscribe");
    }
  }), delete t._jihoUnsubscribers), Array.from(t.children).forEach((e) => U(e));
}
function se(t, e) {
  const r = {
    JihoHeader: H,
    JihoNav: K,
    JihoSection: P,
    JihoGrid: Q,
    JihoButton: X
  }[t];
  if (!r)
    return console.warn(`JihoFrame: Unknown JihoUI component: ${t}`), null;
  try {
    const o = r(e);
    if (o && typeof o == "object") {
      const i = Object.entries(o);
      if (i.length > 0) {
        const [a, l] = i[0];
        return w(a, l);
      }
    }
    return null;
  } catch (o) {
    return h(o, `JihoUI component ${t}`), null;
  }
}
function le(t, e) {
  const n = b(() => t(e), `component ${t.name || "anonymous"}`);
  if (!n)
    return null;
  if (n.nodeType)
    return n;
  if (n.layout) {
    const r = document.createElement("div");
    return r.style.display = "contents", new V(r).update(n.layout), r;
  }
  if (typeof n == "object" && n !== null) {
    const r = Object.entries(n);
    if (r.length > 0) {
      const [o, i] = r[0];
      return w(o, i);
    }
  }
  return console.warn("JihoFrame: Component returned invalid object"), null;
}
function ue(t) {
  const e = b(t, "options function");
  if (!e)
    return null;
  if (typeof e == "object" && e !== null) {
    const n = Object.entries(e);
    if (n.length > 0) {
      const [r, o] = n[0];
      return w(r, o);
    }
  }
  return console.warn("JihoFrame: Options function returned invalid object"), null;
}
function fe(t, e) {
  if (typeof t != "string")
    return console.warn("JihoFrame: Tag must be a string, got:", typeof t), null;
  const n = document.createElement(t);
  return e && (ae(n, e, t), ce(n, e)), n;
}
function w(t, e) {
  try {
    if (typeof t == "string" && t.startsWith("Jiho"))
      return se(t, e);
    if (typeof t == "function")
      return le(t, e);
    if (typeof e == "function")
      return ue(e);
    if (typeof e == "string") {
      const n = document.createElement(t);
      return n.textContent = e, n;
    }
    return fe(t, e);
  } catch (n) {
    return h(n, `createElement for tag ${t}`), null;
  }
}
function de(t, e) {
  if (!Array.isArray(t)) {
    console.warn("JihoFrame: Conditional block value must be an array");
    return;
  }
  let n = document.createComment("condition-start"), r = document.createComment("condition-end"), o = null, i = [];
  e.appendChild(n), e.appendChild(r);
  const a = () => {
    o && (U(o), o.parentNode && o.parentNode.removeChild(o), o = null), i.forEach((c) => {
      try {
        c();
      } catch (d) {
        h(d, "conditional cleanup unsubscribe");
      }
    }), i = [];
  }, l = (c, d) => {
    const p = c.if ?? (d ? !1 : c.elseIf ?? c.else);
    return typeof p == "function" ? b(p, "conditional condition") : p;
  }, s = (c, d) => {
    if (!c || typeof c != "object")
      return console.warn("JihoFrame: Invalid conditional item"), { shouldContinue: !0, rendered: d };
    const p = Object.entries(c);
    if (p.length === 0)
      return console.warn("JihoFrame: Empty conditional item"), { shouldContinue: !0, rendered: d };
    const [J, C] = p[0];
    if (!C || typeof C != "object")
      return { shouldContinue: !0, rendered: d };
    if (l(C, d) && !d) {
      const E = w(J, C);
      if (E && e.contains(r))
        return e.insertBefore(E, r), o = E, { shouldContinue: !1, rendered: !0 };
    }
    return { shouldContinue: !0, rendered: d };
  }, u = () => {
    try {
      e.contains(r) || (r = document.createComment("condition-end"), e.appendChild(r)), a();
      let c = !1;
      for (const d of t) {
        const p = s(d, c);
        if (c = p.rendered, !p.shouldContinue)
          break;
      }
    } catch (c) {
      h(c, "conditional block rerender");
    }
  }, f = j(u);
  return i.push(f), u(), a;
}
function he(t, e) {
  if (!t || typeof t != "object") {
    console.warn("JihoFrame: Switch block must be an object");
    return;
  }
  let n = document.createComment("switch-start"), r = document.createComment("switch-end"), o = null, i = [];
  e.appendChild(n), e.appendChild(r);
  const a = () => {
    o && (U(o), o.parentNode && o.parentNode.removeChild(o), o = null), i.forEach((c) => {
      try {
        c();
      } catch (d) {
        h(d, "switch cleanup unsubscribe");
      }
    }), i = [];
  }, l = () => typeof t.switch == "function" ? b(t.switch, "switch value function") : t.switch, s = (c, d) => {
    if (!c || typeof c != "object")
      return !1;
    if ((c.case === d || c.default === !0) && c.element && typeof c.element == "object") {
      const p = Object.entries(c.element);
      if (p.length > 0) {
        const [J, C] = p[0], S = w(J, C);
        if (S && e.contains(r))
          return e.insertBefore(S, r), o = S, !0;
      }
    }
    return !1;
  }, u = () => {
    try {
      e.contains(r) || (r = document.createComment("switch-end"), e.appendChild(r)), a();
      const c = l();
      if (!Array.isArray(t.cases)) {
        console.warn("JihoFrame: Switch cases must be an array");
        return;
      }
      for (const d of t.cases)
        if (s(d, c))
          break;
    } catch (c) {
      h(c, "switch block rerender");
    }
  }, f = j(u);
  return i.push(f), u(), a;
}
class V {
  constructor(e) {
    this.container = e, this.currentNodes = [], this.cleanupFunctions = [];
  }
  // 기존 노드들 정리
  cleanup() {
    this.currentNodes.forEach((e) => {
      e && e.parentNode && (U(e), e.parentNode.removeChild(e));
    }), this.cleanupFunctions.forEach((e) => {
      try {
        e();
      } catch (n) {
        h(n, "DOM updater cleanup");
      }
    }), this.currentNodes = [], this.cleanupFunctions = [];
  }
  // 함수형 아이템 처리
  processFunctionItem(e, n) {
    const r = b(e, `layout function at index ${n}`);
    if (r && typeof r == "object") {
      const o = Object.entries(r);
      if (o.length > 0) {
        const [i, a] = o[0], l = w(i, a);
        l && (this.container.appendChild(l), this.currentNodes.push(l));
      }
    }
  }
  // 객체형 아이템 처리
  processObjectItem(e) {
    const n = Object.entries(e);
    if (n.length > 0) {
      const [r, o] = n[0];
      if (r === "condition" && Array.isArray(o)) {
        const i = de(o, this.container);
        i && this.cleanupFunctions.push(i);
      } else if (r === "switchBlock") {
        const i = he(o, this.container);
        i && this.cleanupFunctions.push(i);
      } else {
        const i = w(r, o);
        i && (this.container.appendChild(i), this.currentNodes.push(i));
      }
    }
  }
  // 새로운 노드들 추가
  update(e) {
    if (this.cleanup(), !Array.isArray(e)) {
      console.warn("JihoFrame: Layout must be an array");
      return;
    }
    e.forEach((n, r) => {
      try {
        typeof n == "function" ? this.processFunctionItem(n, r) : n && typeof n == "object" && this.processObjectItem(n);
      } catch (o) {
        h(o, `rendering layout item at index ${r}`);
      }
    });
  }
}
function Ee(t, e) {
  if (typeof t != "function")
    throw new Error("JihoFrame: App must be a function");
  if (!e || !e.appendChild)
    throw new Error("JihoFrame: Container must be a valid DOM element");
  z.forEach((s) => {
    try {
      s();
    } catch (u) {
      h(u, "init callback");
    }
  });
  const n = new V(e);
  let r = [];
  const o = () => {
    T.forEach((s) => {
      try {
        s();
      } catch (u) {
        h(u, "mount callback");
      }
    });
  }, i = () => {
    try {
      const s = b(t, "app function");
      if (!s)
        return;
      if (!s.layout) {
        console.warn("JihoFrame: App function must return an object with layout property");
        return;
      }
      n.update(s.layout), o();
    } catch (s) {
      h(s, "app rerender");
    }
  }, a = j(i);
  r.push(a), i();
  const l = () => {
    try {
      O.forEach((s) => {
        try {
          s();
        } catch (u) {
          h(u, "unmount callback");
        }
      }), n.cleanup(), r.forEach((s) => {
        try {
          s();
        } catch (u) {
          h(u, "app unsubscribe");
        }
      });
    } catch (s) {
      h(s, "app cleanup");
    }
  };
  return window.addEventListener("beforeunload", l), l;
}
export {
  q as combineStates,
  Ce as computedState,
  W as createState,
  we as getStateSnapshot,
  be as jihoInit,
  me as jihoMount,
  ge as jihoUnMount,
  ye as jihoUpdate,
  Ee as renderApp,
  R as resetState,
  j as subscribeState,
  xe as unsubscribeAll,
  ve as watchState
};
