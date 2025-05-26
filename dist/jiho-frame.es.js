let p = {}, b = {}, x = [], y = /* @__PURE__ */ new WeakMap(), C = /* @__PURE__ */ new Set(), A = !1, $ = [], k = [], F = /* @__PURE__ */ new Map(), _ = [];
function O() {
  if (A)
    return;
  A = !0;
  const e = Array.from(C);
  C.clear(), [...new Set(e)].forEach((o) => {
    try {
      o();
    } catch (n) {
      console.error("JihoFrame: 업데이트 중 오류 발생:", n);
    }
  }), A = !1;
}
function M() {
  C.size > 0 && Promise.resolve().then(O);
}
function z(e) {
  if (typeof e != "function") {
    console.warn("JihoFrame: jihoInit expects a function");
    return;
  }
  $.push(e);
}
function P(e) {
  if (typeof e != "function") {
    console.warn("JihoFrame: jihoMount expects a function");
    return;
  }
  k.push(e);
}
function Q(e, t) {
  if (typeof e != "function") {
    console.warn("JihoFrame: jihoUpdate expects a function as first parameter");
    return;
  }
  F.has(t) || F.set(t, []), F.get(t).push(e);
}
function W(e) {
  if (typeof e != "function") {
    console.warn("JihoFrame: jihoUnMount expects a function");
    return;
  }
  _.push(e);
}
function G(e) {
  y.has(e) && (y.get(e).forEach((o) => o()), y.delete(e));
}
function T(e, t) {
  if (typeof e != "string")
    throw new Error("JihoFrame: State key must be a string");
  e in p || (p[e] = t, b[e] = /* @__PURE__ */ new Set());
  const o = {
    // 일관된 API - value 프로퍼티로 통일
    get value() {
      return p[e];
    },
    set value(n) {
      p[e] !== n && (p[e] = n, x.forEach((r) => C.add(r)), F.has(o) && F.get(o).forEach((r) => C.add(r)), b[e].forEach((r) => C.add(r)), M());
    },
    // 기존 API 호환성 유지
    get: () => p[e],
    set: (n) => {
      o.value = n;
    },
    subscribe: (n, r = null) => {
      if (typeof n != "function")
        return console.warn("JihoFrame: subscribe expects a function"), () => {
        };
      b[e].add(n);
      const c = () => b[e].delete(n);
      return r && (y.has(r) || y.set(r, []), y.get(r).push(c)), c;
    }
  };
  return o.get._setter = o.set, o;
}
function j(e, t = null) {
  if (typeof e != "function")
    return console.warn("JihoFrame: subscribeState expects a function"), () => {
    };
  x.push(e);
  const o = () => {
    const n = x.indexOf(e);
    n > -1 && x.splice(n, 1);
  };
  return t && (y.has(t) || y.set(t, []), y.get(t).push(o)), o;
}
function H() {
  return { ...p };
}
function B(e) {
  e ? (delete p[e], b[e] && b[e].clear()) : (p = {}, Object.values(b).forEach((t) => t.clear()), b = {});
}
function X(e, t) {
  if (typeof t != "function")
    return console.warn("JihoFrame: watchState callback must be a function"), () => {
    };
  if (!b[e])
    return console.warn(`JihoFrame: State key "${e}" does not exist`), () => {
    };
  const o = (n, r) => {
    try {
      t(n, r, e);
    } catch (c) {
      D(c, `watchState callback for ${e}`);
    }
  };
  return b[e].add(o), () => b[e].delete(o);
}
function V(e, t) {
  if (!Array.isArray(e))
    throw new Error("JihoFrame: combineStates expects an array of state objects");
  if (typeof t != "function")
    throw new Error("JihoFrame: combineStates expects a combiner function");
  const o = `combined_${Date.now()}_${Math.random()}`, n = () => {
    const a = e.map((f) => f.value), i = t(...a);
    p[o] !== i && (p[o] = i);
  };
  n();
  const r = e.map(
    (a) => a.subscribe(n)
  ), c = T(o, p[o]);
  return c.cleanup = () => {
    r.forEach((a) => a()), B(o);
  }, c;
}
function Y(e, t) {
  if (!Array.isArray(e))
    throw new Error("JihoFrame: computedState expects an array of dependencies");
  if (typeof t != "function")
    throw new Error("JihoFrame: computedState expects a computer function");
  return V(e, t);
}
function D(e, t = "Unknown") {
  var o, n;
  console.error(`JihoFrame Error in ${t}:`, e), typeof window < "u" && ((n = (o = window.process) == null ? void 0 : o.env) == null ? void 0 : n.NODE_ENV) === "development" && console.trace();
}
function d(e, t = "Unknown") {
  var o, n;
  console.error(`JihoFrame Error in ${t}:`, e), typeof window < "u" && ((n = (o = window.process) == null ? void 0 : o.env) == null ? void 0 : n.NODE_ENV) === "development" && console.trace();
}
function h(e, t = "function", o = null) {
  try {
    return e();
  } catch (n) {
    return d(n, t), o;
  }
}
function S(e, t, o) {
  return t === "function" && typeof e != "function" ? (console.warn(`JihoFrame: Expected function in ${o}, got ${typeof e}`), !1) : !0;
}
function g(e, t, o = "text") {
  if (typeof t == "function") {
    const n = () => {
      const c = h(t, "bindValue update");
      c !== null && (o === "checkbox" ? e.checked = !!c : o === "radio" ? e.checked = e.value === c : e.value = c);
    };
    n();
    const r = j(n);
    e._jihoUnsubscribers ? e._jihoUnsubscribers.push(r) : e._jihoUnsubscribers = [r], e.addEventListener("input", (c) => {
      if (t._setter)
        try {
          o === "checkbox" ? t._setter(c.target.checked) : o === "radio" ? c.target.checked && t._setter(c.target.value) : t._setter(c.target.value);
        } catch (a) {
          d(a, "input event handler");
        }
    });
  } else
    o === "checkbox" ? e.checked = !!t : o === "radio" ? e.checked = e.value === t : e.value = t;
}
function I(e, t, o) {
  if (!t || typeof t != "object") {
    console.warn("JihoFrame: Invalid options passed to applyAttributes");
    return;
  }
  const { text: n, style: r, id: c, className: a, event: i } = t;
  if (typeof n == "function") {
    const u = () => {
      const l = h(n, "text update");
      l !== null && (e.textContent = l);
    };
    u();
    const s = j(u);
    e._jihoUnsubscribers ? e._jihoUnsubscribers.push(s) : e._jihoUnsubscribers = [s];
  } else
    n !== void 0 && (e.textContent = n);
  if (r && typeof r == "object")
    try {
      Object.assign(e.style, r);
    } catch (u) {
      d(u, "style application");
    }
  if (c && (e.id = c), a && (e.className = a), Array.isArray(i))
    i.forEach((u) => {
      if (typeof u != "object") {
        console.warn("JihoFrame: Event object must be an object");
        return;
      }
      for (const [s, l] of Object.entries(u)) {
        if (!S(l, "function", `event ${s}`))
          continue;
        const E = s.toLowerCase().replace(/^on/, "");
        e.addEventListener(E, (m) => {
          h(() => l(m), `event handler ${s}`);
        });
      }
    });
  else if (i && typeof i == "object")
    for (const [u, s] of Object.entries(i)) {
      if (!S(s, "function", `event ${u}`))
        continue;
      const l = u.toLowerCase().replace(/^on/, "");
      e.addEventListener(l, (E) => {
        h(() => s(E), `event handler ${u}`);
      });
    }
  const f = (u) => {
    u.forEach((s) => {
      if (s in t)
        try {
          e[s] = t[s];
        } catch (l) {
          d(l, `setting attribute ${s}`);
        }
    });
  };
  switch (o) {
    case "input":
      f([
        "type",
        "checked",
        "multiple",
        "placeholder",
        "required",
        "name"
      ]);
      const u = t.type || "text";
      g(e, t.value, u);
      break;
    case "textarea":
      f(["placeholder", "required", "rows", "cols"]), g(e, t.value);
      break;
    case "select":
      f(["multiple", "required", "name"]), Array.isArray(t.options) && t.options.forEach((s) => {
        const l = document.createElement("option");
        typeof s == "string" ? (l.value = s, l.textContent = s) : s && typeof s == "object" && (l.value = s.value || "", l.textContent = s.label || s.value || ""), e.appendChild(l);
      }), g(e, t.value);
      break;
    case "checkbox":
      g(e, t.value, "checkbox");
      break;
    case "radio":
      g(e, t.value, "radio");
      break;
  }
  if (typeof t.disabled == "function") {
    const u = () => {
      const l = h(t.disabled, "disabled update");
      l !== null && (e.disabled = !!l);
    };
    u();
    const s = j(u);
    e._jihoUnsubscribers ? e._jihoUnsubscribers.push(s) : e._jihoUnsubscribers = [s];
  } else
    t.disabled !== void 0 && (e.disabled = !!t.disabled);
  if (typeof t.show == "function") {
    const u = () => {
      const l = h(t.show, "show update");
      l !== null && (e.style.display = l ? "" : "none");
    };
    u();
    const s = j(u);
    e._jihoUnsubscribers ? e._jihoUnsubscribers.push(s) : e._jihoUnsubscribers = [s];
  } else
    t.show === !1 && (e.style.display = "none");
}
function L(e, t) {
  var n;
  if (!t || typeof t != "object")
    return;
  const o = /* @__PURE__ */ new Set([
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
  if (Object.entries(t).forEach(([r, c]) => {
    if (!o.has(r))
      try {
        const a = typeof c == "function" ? h(c, `child component ${r}`) : c;
        if (!a || typeof a != "object")
          return;
        const i = Object.entries(a);
        if (i.length === 0) {
          console.warn(`JihoFrame: Empty object for child ${r}`);
          return;
        }
        const [f, u] = i[0], s = w(f, u);
        s && e.appendChild(s);
      } catch (a) {
        d(a, `rendering child ${r}`);
      }
  }), Array.isArray(t.children) && t.children.forEach((r, c) => {
    try {
      if (!r || typeof r != "object") {
        console.warn(`JihoFrame: Invalid child at index ${c}`);
        return;
      }
      const a = Object.entries(r);
      if (a.length === 0) {
        console.warn(`JihoFrame: Empty child object at index ${c}`);
        return;
      }
      const [i, f] = a[0], u = w(i, f);
      u && e.appendChild(u);
    } catch (a) {
      d(a, `rendering child at index ${c}`);
    }
  }), (n = t.each) != null && n.list)
    try {
      const r = typeof t.each.list == "function" ? h(t.each.list, "each list function") : t.each.list;
      Array.isArray(r) && typeof t.each.render == "function" && r.forEach((c, a) => {
        try {
          const i = h(() => t.each.render(c, a), `each render at index ${a}`);
          if (i && typeof i == "object") {
            const f = Object.entries(i);
            if (f.length > 0) {
              const [u, s] = f[0], l = w(u, s);
              l && e.appendChild(l);
            }
          }
        } catch (i) {
          d(i, `each item rendering at index ${a}`);
        }
      });
    } catch (r) {
      d(r, "each list processing");
    }
}
function J(e) {
  e._jihoUnsubscribers && (e._jihoUnsubscribers.forEach((t) => {
    try {
      t();
    } catch (o) {
      d(o, "cleanup unsubscribe");
    }
  }), delete e._jihoUnsubscribers), Array.from(e.children).forEach((t) => J(t));
}
function w(e, t) {
  try {
    if (typeof e == "function") {
      const n = h(() => e(t), `component ${e.name || "anonymous"}`);
      if (!n)
        return null;
      if (n.nodeType)
        return n;
      if (n.layout) {
        const r = document.createElement("div");
        return r.style.display = "contents", new N(r).update(n.layout), r;
      }
      if (typeof n == "object" && n !== null) {
        const r = Object.entries(n);
        if (r.length > 0) {
          const [c, a] = r[0];
          return w(c, a);
        }
      }
      return console.warn("JihoFrame: Component returned invalid object"), null;
    }
    if (typeof t == "function") {
      const n = h(t, "options function");
      if (!n)
        return null;
      if (typeof n == "object" && n !== null) {
        const r = Object.entries(n);
        if (r.length > 0) {
          const [c, a] = r[0];
          return w(c, a);
        }
      }
      return console.warn("JihoFrame: Options function returned invalid object"), null;
    }
    if (typeof t == "string") {
      const n = document.createElement(e);
      return n.textContent = t, n;
    }
    if (typeof e != "string")
      return console.warn("JihoFrame: Tag must be a string, got:", typeof e), null;
    const o = document.createElement(e);
    return t && (I(o, t, e), L(o, t)), o;
  } catch (o) {
    return d(o, `createElement for tag ${e}`), null;
  }
}
function q(e, t) {
  if (!Array.isArray(e)) {
    console.warn("JihoFrame: Conditional block value must be an array");
    return;
  }
  let o = document.createComment("condition-start"), n = document.createComment("condition-end"), r = null, c = [];
  t.appendChild(o), t.appendChild(n);
  const a = () => {
    r && (J(r), r.parentNode && r.parentNode.removeChild(r), r = null), c.forEach((u) => {
      try {
        u();
      } catch (s) {
        d(s, "conditional cleanup unsubscribe");
      }
    }), c = [];
  }, i = () => {
    try {
      t.contains(n) || (n = document.createComment("condition-end"), t.appendChild(n)), a();
      let u = !1;
      for (const s of e) {
        if (!s || typeof s != "object") {
          console.warn("JihoFrame: Invalid conditional item");
          continue;
        }
        const l = Object.entries(s);
        if (l.length === 0) {
          console.warn("JihoFrame: Empty conditional item");
          continue;
        }
        const [E, m] = l[0];
        if (!m || typeof m != "object")
          continue;
        const v = m.if ?? (u ? !1 : m.elseIf ?? m.else);
        if ((typeof v == "function" ? h(v, "conditional condition") : v) && !u) {
          const U = w(E, m);
          if (U && t.contains(n)) {
            t.insertBefore(U, n), r = U, u = !0;
            break;
          }
        }
      }
    } catch (u) {
      d(u, "conditional block rerender");
    }
  }, f = j(i);
  return c.push(f), i(), a;
}
function K(e, t) {
  if (!e || typeof e != "object") {
    console.warn("JihoFrame: Switch block must be an object");
    return;
  }
  let o = document.createComment("switch-start"), n = document.createComment("switch-end"), r = null, c = [];
  t.appendChild(o), t.appendChild(n);
  const a = () => {
    r && (J(r), r.parentNode && r.parentNode.removeChild(r), r = null), c.forEach((u) => {
      try {
        u();
      } catch (s) {
        d(s, "switch cleanup unsubscribe");
      }
    }), c = [];
  }, i = () => {
    try {
      t.contains(n) || (n = document.createComment("switch-end"), t.appendChild(n)), a();
      const u = typeof e.switch == "function" ? h(e.switch, "switch value function") : e.switch;
      if (!Array.isArray(e.cases)) {
        console.warn("JihoFrame: Switch cases must be an array");
        return;
      }
      for (const s of e.cases)
        if (!(!s || typeof s != "object") && (s.case === u || s.default === !0) && s.element && typeof s.element == "object") {
          const l = Object.entries(s.element);
          if (l.length > 0) {
            const [E, m] = l[0], v = w(E, m);
            if (v && t.contains(n)) {
              t.insertBefore(v, n), r = v;
              break;
            }
          }
        }
    } catch (u) {
      d(u, "switch block rerender");
    }
  }, f = j(i);
  return c.push(f), i(), a;
}
class N {
  constructor(t) {
    this.container = t, this.currentNodes = [], this.cleanupFunctions = [];
  }
  // 기존 노드들 정리
  cleanup() {
    this.currentNodes.forEach((t) => {
      t && t.parentNode && (J(t), t.parentNode.removeChild(t));
    }), this.cleanupFunctions.forEach((t) => {
      try {
        t();
      } catch (o) {
        d(o, "DOM updater cleanup");
      }
    }), this.currentNodes = [], this.cleanupFunctions = [];
  }
  // 새로운 노드들 추가
  update(t) {
    if (this.cleanup(), !Array.isArray(t)) {
      console.warn("JihoFrame: Layout must be an array");
      return;
    }
    t.forEach((o, n) => {
      try {
        if (typeof o == "function") {
          const r = h(o, `layout function at index ${n}`);
          if (r && typeof r == "object") {
            const c = Object.entries(r);
            if (c.length > 0) {
              const [a, i] = c[0], f = w(a, i);
              f && (this.container.appendChild(f), this.currentNodes.push(f));
            }
          }
        } else if (o && typeof o == "object") {
          const r = Object.entries(o);
          if (r.length > 0) {
            const [c, a] = r[0];
            if (c === "condition" && Array.isArray(a)) {
              const i = q(a, this.container);
              i && this.cleanupFunctions.push(i);
            } else if (c === "switchBlock") {
              const i = K(a, this.container);
              i && this.cleanupFunctions.push(i);
            } else {
              const i = w(c, a);
              i && (this.container.appendChild(i), this.currentNodes.push(i));
            }
          }
        }
      } catch (r) {
        d(r, `rendering layout item at index ${n}`);
      }
    });
  }
}
function Z(e, t) {
  if (typeof e != "function")
    throw new Error("JihoFrame: App must be a function");
  if (!t || !t.appendChild)
    throw new Error("JihoFrame: Container must be a valid DOM element");
  $.forEach((i) => {
    try {
      i();
    } catch (f) {
      d(f, "init callback");
    }
  });
  const o = new N(t);
  let n = [];
  const r = () => {
    try {
      const i = h(e, "app function");
      if (!i)
        return;
      if (!i.layout) {
        console.warn("JihoFrame: App function must return an object with layout property");
        return;
      }
      o.update(i.layout), k.forEach((f) => {
        try {
          f();
        } catch (u) {
          d(u, "mount callback");
        }
      });
    } catch (i) {
      d(i, "app rerender");
    }
  }, c = j(r);
  n.push(c), r();
  const a = () => {
    try {
      _.forEach((i) => {
        try {
          i();
        } catch (f) {
          d(f, "unmount callback");
        }
      }), o.cleanup(), n.forEach((i) => {
        try {
          i();
        } catch (f) {
          d(f, "app unsubscribe");
        }
      });
    } catch (i) {
      d(i, "app cleanup");
    }
  };
  return window.addEventListener("beforeunload", a), a;
}
export {
  V as combineStates,
  Y as computedState,
  T as createState,
  H as getStateSnapshot,
  z as jihoInit,
  P as jihoMount,
  W as jihoUnMount,
  Q as jihoUpdate,
  Z as renderApp,
  B as resetState,
  j as subscribeState,
  G as unsubscribeAll,
  X as watchState
};
