let b = {}, m = {}, F = [], w = /* @__PURE__ */ new WeakMap(), j = /* @__PURE__ */ new Set(), A = !1, S = [], k = [], x = /* @__PURE__ */ new Map(), _ = [];
function N() {
  if (A)
    return;
  A = !0;
  const e = Array.from(j);
  j.clear(), [...new Set(e)].forEach((n) => {
    try {
      n();
    } catch (r) {
      console.error("JihoFrame: 업데이트 중 오류 발생:", r);
    }
  }), A = !1;
}
function O() {
  j.size > 0 && Promise.resolve().then(N);
}
function R(e) {
  if (typeof e != "function") {
    console.warn("JihoFrame: jihoInit expects a function");
    return;
  }
  S.push(e);
}
function z(e) {
  if (typeof e != "function") {
    console.warn("JihoFrame: jihoMount expects a function");
    return;
  }
  k.push(e);
}
function P(e, t) {
  if (typeof e != "function") {
    console.warn("JihoFrame: jihoUpdate expects a function as first parameter");
    return;
  }
  x.has(t) || x.set(t, []), x.get(t).push(e);
}
function Q(e) {
  if (typeof e != "function") {
    console.warn("JihoFrame: jihoUnMount expects a function");
    return;
  }
  _.push(e);
}
function W(e) {
  w.has(e) && (w.get(e).forEach((n) => n()), w.delete(e));
}
function M(e, t) {
  if (typeof e != "string")
    throw new Error("JihoFrame: State key must be a string");
  e in b || (b[e] = t, m[e] = /* @__PURE__ */ new Set());
  const n = {
    // 일관된 API - value 프로퍼티로 통일
    get value() {
      return b[e];
    },
    set value(r) {
      b[e] !== r && (b[e] = r, F.forEach((c) => j.add(c)), x.has(n) && x.get(n).forEach((c) => j.add(c)), m[e].forEach((c) => j.add(c)), O());
    },
    // 기존 API 호환성 유지
    get: () => b[e],
    set: (r) => {
      n.value = r;
    },
    subscribe: (r, c = null) => {
      if (typeof r != "function")
        return console.warn("JihoFrame: subscribe expects a function"), () => {
        };
      m[e].add(r);
      const o = () => m[e].delete(r);
      return c && (w.has(c) || w.set(c, []), w.get(c).push(o)), o;
    }
  };
  return n.get._setter = n.set, n;
}
function v(e, t = null) {
  if (typeof e != "function")
    return console.warn("JihoFrame: subscribeState expects a function"), () => {
    };
  F.push(e);
  const n = () => {
    const r = F.indexOf(e);
    r > -1 && F.splice(r, 1);
  };
  return t && (w.has(t) || w.set(t, []), w.get(t).push(n)), n;
}
function G() {
  return { ...b };
}
function T(e) {
  e ? (delete b[e], m[e] && m[e].clear()) : (b = {}, Object.values(m).forEach((t) => t.clear()), m = {});
}
function H(e, t) {
  if (typeof t != "function")
    return console.warn("JihoFrame: watchState callback must be a function"), () => {
    };
  if (!m[e])
    return console.warn(`JihoFrame: State key "${e}" does not exist`), () => {
    };
  const n = (r, c) => {
    try {
      t(r, c, e);
    } catch (o) {
      V(o, `watchState callback for ${e}`);
    }
  };
  return m[e].add(n), () => m[e].delete(n);
}
function B(e, t) {
  if (!Array.isArray(e))
    throw new Error("JihoFrame: combineStates expects an array of state objects");
  if (typeof t != "function")
    throw new Error("JihoFrame: combineStates expects a combiner function");
  const n = `combined_${Date.now()}_${Math.random()}`, r = () => {
    const i = e.map((f) => f.value), a = t(...i);
    b[n] !== a && (b[n] = a);
  };
  r();
  const c = e.map(
    (i) => i.subscribe(r)
  ), o = M(n, b[n]);
  return o.cleanup = () => {
    c.forEach((i) => i()), T(n);
  }, o;
}
function X(e, t) {
  if (!Array.isArray(e))
    throw new Error("JihoFrame: computedState expects an array of dependencies");
  if (typeof t != "function")
    throw new Error("JihoFrame: computedState expects a computer function");
  return B(e, t);
}
function V(e, t = "Unknown") {
  var n, r;
  console.error(`JihoFrame Error in ${t}:`, e), typeof window < "u" && ((r = (n = window.process) == null ? void 0 : n.env) == null ? void 0 : r.NODE_ENV) === "development" && console.trace();
}
function d(e, t = "Unknown") {
  var n;
  console.error(`JihoFrame Error in ${t}:`, e), ((n = process == null ? void 0 : process.env) == null ? void 0 : n.NODE_ENV) === "development" && console.trace();
}
function h(e, t = "function", n = null) {
  try {
    return e();
  } catch (r) {
    return d(r, t), n;
  }
}
function J(e, t, n) {
  return t === "function" && typeof e != "function" ? (console.warn(`JihoFrame: Expected function in ${n}, got ${typeof e}`), !1) : !0;
}
function C(e, t, n = "text") {
  if (typeof t == "function") {
    const r = () => {
      const o = h(t, "bindValue update");
      o !== null && (n === "checkbox" ? e.checked = !!o : n === "radio" ? e.checked = e.value === o : e.value = o);
    };
    r();
    const c = v(r);
    e._jihoUnsubscribers ? e._jihoUnsubscribers.push(c) : e._jihoUnsubscribers = [c], e.addEventListener("input", (o) => {
      if (t._setter)
        try {
          n === "checkbox" ? t._setter(o.target.checked) : n === "radio" ? o.target.checked && t._setter(o.target.value) : t._setter(o.target.value);
        } catch (i) {
          d(i, "input event handler");
        }
    });
  } else
    n === "checkbox" ? e.checked = !!t : n === "radio" ? e.checked = e.value === t : e.value = t;
}
function D(e, t, n) {
  if (!t || typeof t != "object") {
    console.warn("JihoFrame: Invalid options passed to applyAttributes");
    return;
  }
  const { text: r, style: c, id: o, className: i, event: a } = t;
  if (typeof r == "function") {
    const u = () => {
      const l = h(r, "text update");
      l !== null && (e.textContent = l);
    };
    u();
    const s = v(u);
    e._jihoUnsubscribers ? e._jihoUnsubscribers.push(s) : e._jihoUnsubscribers = [s];
  } else
    r !== void 0 && (e.textContent = r);
  if (c && typeof c == "object")
    try {
      Object.assign(e.style, c);
    } catch (u) {
      d(u, "style application");
    }
  if (o && (e.id = o), i && (e.className = i), Array.isArray(a))
    a.forEach((u) => {
      if (typeof u != "object") {
        console.warn("JihoFrame: Event object must be an object");
        return;
      }
      for (const [s, l] of Object.entries(u)) {
        if (!J(l, "function", `event ${s}`))
          continue;
        const p = s.toLowerCase().replace(/^on/, "");
        e.addEventListener(p, (y) => {
          h(() => l(y), `event handler ${s}`);
        });
      }
    });
  else if (a && typeof a == "object")
    for (const [u, s] of Object.entries(a)) {
      if (!J(s, "function", `event ${u}`))
        continue;
      const l = u.toLowerCase().replace(/^on/, "");
      e.addEventListener(l, (p) => {
        h(() => s(p), `event handler ${u}`);
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
  switch (n) {
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
      C(e, t.value, u);
      break;
    case "textarea":
      f(["placeholder", "required", "rows", "cols"]), C(e, t.value);
      break;
    case "select":
      f(["multiple", "required", "name"]), Array.isArray(t.options) && t.options.forEach((s) => {
        const l = document.createElement("option");
        typeof s == "string" ? (l.value = s, l.textContent = s) : s && typeof s == "object" && (l.value = s.value || "", l.textContent = s.label || s.value || ""), e.appendChild(l);
      }), C(e, t.value);
      break;
    case "checkbox":
      C(e, t.value, "checkbox");
      break;
    case "radio":
      C(e, t.value, "radio");
      break;
  }
  if (typeof t.disabled == "function") {
    const u = () => {
      const l = h(t.disabled, "disabled update");
      l !== null && (e.disabled = !!l);
    };
    u();
    const s = v(u);
    e._jihoUnsubscribers ? e._jihoUnsubscribers.push(s) : e._jihoUnsubscribers = [s];
  } else
    t.disabled !== void 0 && (e.disabled = !!t.disabled);
  if (typeof t.show == "function") {
    const u = () => {
      const l = h(t.show, "show update");
      l !== null && (e.style.display = l ? "" : "none");
    };
    u();
    const s = v(u);
    e._jihoUnsubscribers ? e._jihoUnsubscribers.push(s) : e._jihoUnsubscribers = [s];
  } else
    t.show === !1 && (e.style.display = "none");
}
function I(e, t) {
  var r;
  if (!t || typeof t != "object")
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
  if (Object.entries(t).forEach(([c, o]) => {
    if (!n.has(c))
      try {
        const i = typeof o == "function" ? h(o, `child component ${c}`) : o;
        if (!i)
          return;
        const [a, f] = Object.entries(i)[0], u = E(a, f);
        u && e.appendChild(u);
      } catch (i) {
        d(i, `rendering child ${c}`);
      }
  }), Array.isArray(t.children) && t.children.forEach((c, o) => {
    try {
      if (!c || typeof c != "object") {
        console.warn(`JihoFrame: Invalid child at index ${o}`);
        return;
      }
      const [i, a] = Object.entries(c)[0], f = E(i, a);
      f && e.appendChild(f);
    } catch (i) {
      d(i, `rendering child at index ${o}`);
    }
  }), (r = t.each) != null && r.list)
    try {
      const c = typeof t.each.list == "function" ? h(t.each.list, "each list function") : t.each.list;
      Array.isArray(c) && typeof t.each.render == "function" && c.forEach((o, i) => {
        try {
          const a = h(() => t.each.render(o, i), `each render at index ${i}`);
          if (a) {
            const [f, u] = Object.entries(a)[0], s = E(f, u);
            s && e.appendChild(s);
          }
        } catch (a) {
          d(a, `each item rendering at index ${i}`);
        }
      });
    } catch (c) {
      d(c, "each list processing");
    }
}
function g(e) {
  e._jihoUnsubscribers && (e._jihoUnsubscribers.forEach((t) => {
    try {
      t();
    } catch (n) {
      d(n, "cleanup unsubscribe");
    }
  }), delete e._jihoUnsubscribers), Array.from(e.children).forEach((t) => g(t));
}
function E(e, t) {
  try {
    if (typeof e == "function") {
      const r = h(() => e(t), `component ${e.name || "anonymous"}`);
      if (!r)
        return null;
      if (r.nodeType)
        return r;
      if (r.layout) {
        const i = document.createElement("div");
        return i.style.display = "contents", new $(i).update(r.layout), i;
      }
      const [c, o] = Object.entries(r)[0];
      return E(c, o);
    }
    if (typeof t == "function") {
      const r = h(t, "options function");
      if (!r)
        return null;
      const [c, o] = Object.entries(r)[0];
      return E(c, o);
    }
    if (typeof t == "string") {
      const r = document.createElement(e);
      return r.textContent = t, r;
    }
    if (typeof e != "string")
      return console.warn("JihoFrame: Tag must be a string, got:", typeof e), null;
    const n = document.createElement(e);
    return t && (D(n, t, e), I(n, t)), n;
  } catch (n) {
    return d(n, `createElement for tag ${e}`), null;
  }
}
function L(e, t) {
  if (!Array.isArray(e)) {
    console.warn("JihoFrame: Conditional block value must be an array");
    return;
  }
  let n = document.createComment("condition-start"), r = document.createComment("condition-end"), c = null, o = [];
  t.appendChild(n), t.appendChild(r);
  const i = () => {
    c && (g(c), c.parentNode && c.parentNode.removeChild(c), c = null), o.forEach((u) => {
      try {
        u();
      } catch (s) {
        d(s, "conditional cleanup unsubscribe");
      }
    }), o = [];
  }, a = () => {
    try {
      t.contains(r) || (r = document.createComment("condition-end"), t.appendChild(r)), i();
      let u = !1;
      for (const s of e) {
        if (!s || typeof s != "object") {
          console.warn("JihoFrame: Invalid conditional item");
          continue;
        }
        const [l, p] = Object.entries(s)[0];
        if (!p || typeof p != "object")
          continue;
        const y = p.if ?? (u ? !1 : p.elseIf ?? p.else);
        if ((typeof y == "function" ? h(y, "conditional condition") : y) && !u) {
          const U = E(l, p);
          if (U && t.contains(r)) {
            t.insertBefore(U, r), c = U, u = !0;
            break;
          }
        }
      }
    } catch (u) {
      d(u, "conditional block rerender");
    }
  }, f = v(a);
  return o.push(f), a(), i;
}
function q(e, t) {
  if (!e || typeof e != "object") {
    console.warn("JihoFrame: Switch block must be an object");
    return;
  }
  let n = document.createComment("switch-start"), r = document.createComment("switch-end"), c = null, o = [];
  t.appendChild(n), t.appendChild(r);
  const i = () => {
    c && (g(c), c.parentNode && c.parentNode.removeChild(c), c = null), o.forEach((u) => {
      try {
        u();
      } catch (s) {
        d(s, "switch cleanup unsubscribe");
      }
    }), o = [];
  }, a = () => {
    try {
      t.contains(r) || (r = document.createComment("switch-end"), t.appendChild(r)), i();
      const u = typeof e.switch == "function" ? h(e.switch, "switch value function") : e.switch;
      if (!Array.isArray(e.cases)) {
        console.warn("JihoFrame: Switch cases must be an array");
        return;
      }
      for (const s of e.cases)
        if (!(!s || typeof s != "object") && (s.case === u || s.default === !0) && s.element && typeof s.element == "object") {
          const [l, p] = Object.entries(s.element)[0], y = E(l, p);
          if (y && t.contains(r)) {
            t.insertBefore(y, r), c = y;
            break;
          }
        }
    } catch (u) {
      d(u, "switch block rerender");
    }
  }, f = v(a);
  return o.push(f), a(), i;
}
class $ {
  constructor(t) {
    this.container = t, this.currentNodes = [], this.cleanupFunctions = [];
  }
  // 기존 노드들 정리
  cleanup() {
    this.currentNodes.forEach((t) => {
      t && t.parentNode && (g(t), t.parentNode.removeChild(t));
    }), this.cleanupFunctions.forEach((t) => {
      try {
        t();
      } catch (n) {
        d(n, "DOM updater cleanup");
      }
    }), this.currentNodes = [], this.cleanupFunctions = [];
  }
  // 새로운 노드들 추가
  update(t) {
    if (this.cleanup(), !Array.isArray(t)) {
      console.warn("JihoFrame: Layout must be an array");
      return;
    }
    t.forEach((n, r) => {
      try {
        if (typeof n == "function") {
          const c = h(n, `layout function at index ${r}`);
          if (c) {
            const [o, i] = Object.entries(c)[0], a = E(o, i);
            a && (this.container.appendChild(a), this.currentNodes.push(a));
          }
        } else if (n && typeof n == "object") {
          const [c, o] = Object.entries(n)[0];
          if (c === "condition" && Array.isArray(o)) {
            const i = L(o, this.container);
            i && this.cleanupFunctions.push(i);
          } else if (c === "switchBlock") {
            const i = q(o, this.container);
            i && this.cleanupFunctions.push(i);
          } else {
            const i = E(c, o);
            i && (this.container.appendChild(i), this.currentNodes.push(i));
          }
        }
      } catch (c) {
        d(c, `rendering layout item at index ${r}`);
      }
    });
  }
}
function Y(e, t) {
  if (typeof e != "function")
    throw new Error("JihoFrame: App must be a function");
  if (!t || !t.appendChild)
    throw new Error("JihoFrame: Container must be a valid DOM element");
  S.forEach((a) => {
    try {
      a();
    } catch (f) {
      d(f, "init callback");
    }
  });
  const n = new $(t);
  let r = [];
  const c = () => {
    try {
      const a = h(e, "app function");
      if (!a)
        return;
      if (!a.layout) {
        console.warn("JihoFrame: App function must return an object with layout property");
        return;
      }
      n.update(a.layout), k.forEach((f) => {
        try {
          f();
        } catch (u) {
          d(u, "mount callback");
        }
      });
    } catch (a) {
      d(a, "app rerender");
    }
  }, o = v(c);
  r.push(o), c();
  const i = () => {
    try {
      _.forEach((a) => {
        try {
          a();
        } catch (f) {
          d(f, "unmount callback");
        }
      }), n.cleanup(), r.forEach((a) => {
        try {
          a();
        } catch (f) {
          d(f, "app unsubscribe");
        }
      });
    } catch (a) {
      d(a, "app cleanup");
    }
  };
  return window.addEventListener("beforeunload", i), i;
}
export {
  B as combineStates,
  X as computedState,
  M as createState,
  G as getStateSnapshot,
  R as jihoInit,
  z as jihoMount,
  Q as jihoUnMount,
  P as jihoUpdate,
  Y as renderApp,
  T as resetState,
  v as subscribeState,
  W as unsubscribeAll,
  H as watchState
};
