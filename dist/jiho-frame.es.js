let w = {}, x = {}, g = [], v = /* @__PURE__ */ new WeakMap(), E = /* @__PURE__ */ new Set(), F = !1, J = [], _ = [], C = /* @__PURE__ */ new Map(), N = [];
function S() {
  if (F)
    return;
  F = !0;
  const e = Array.from(E);
  E.clear(), [...new Set(e)].forEach((c) => {
    try {
      c();
    } catch (r) {
      console.error("JihoFrame: 업데이트 중 오류 발생:", r);
    }
  }), F = !1;
}
function O() {
  E.size > 0 && Promise.resolve().then(S);
}
function V(e) {
  if (typeof e != "function") {
    console.warn("JihoFrame: jihoInit expects a function");
    return;
  }
  J.push(e);
}
function q(e) {
  if (typeof e != "function") {
    console.warn("JihoFrame: jihoMount expects a function");
    return;
  }
  _.push(e);
}
function D(e, t) {
  if (typeof e != "function") {
    console.warn("JihoFrame: jihoUpdate expects a function as first parameter");
    return;
  }
  C.has(t) || C.set(t, []), C.get(t).push(e);
}
function R(e) {
  if (typeof e != "function") {
    console.warn("JihoFrame: jihoUnMount expects a function");
    return;
  }
  N.push(e);
}
function z(e, t) {
  if (typeof e != "string")
    throw new Error("JihoFrame: State key must be a string");
  e in w || (w[e] = t, x[e] = /* @__PURE__ */ new Set());
  const c = {
    // 일관된 API - value 프로퍼티로 통일
    get value() {
      return w[e];
    },
    set value(r) {
      w[e] !== r && (w[e] = r, g.forEach((n) => E.add(n)), C.has(c) && C.get(c).forEach((n) => E.add(n)), x[e].forEach((n) => E.add(n)), O());
    },
    // 기존 API 호환성 유지
    get: () => w[e],
    set: (r) => {
      c.value = r;
    },
    subscribe: (r, n = null) => {
      if (typeof r != "function")
        return console.warn("JihoFrame: subscribe expects a function"), () => {
        };
      x[e].add(r);
      const i = () => x[e].delete(r);
      return n && (v.has(n) || v.set(n, []), v.get(n).push(i)), i;
    }
  };
  return c.get._setter = c.set, c;
}
function m(e, t = null) {
  if (typeof e != "function")
    return console.warn("JihoFrame: subscribeState expects a function"), () => {
    };
  g.push(e);
  const c = () => {
    const r = g.indexOf(e);
    r > -1 && g.splice(r, 1);
  };
  return t && (v.has(t) || v.set(t, []), v.get(t).push(c)), c;
}
function d(e, t = "Unknown") {
  var c;
  console.error(`JihoFrame Error in ${t}:`, e), ((c = process == null ? void 0 : process.env) == null ? void 0 : c.NODE_ENV) === "development" && console.trace();
}
function h(e, t = "function", c = null) {
  try {
    return e();
  } catch (r) {
    return d(r, t), c;
  }
}
function A(e, t, c) {
  return t === "function" && typeof e != "function" ? (console.warn(`JihoFrame: Expected function in ${c}, got ${typeof e}`), !1) : !0;
}
function j(e, t, c = "text") {
  if (typeof t == "function") {
    const r = () => {
      const i = h(t, "bindValue update");
      i !== null && (c === "checkbox" ? e.checked = !!i : c === "radio" ? e.checked = e.value === i : e.value = i);
    };
    r();
    const n = m(r);
    e._jihoUnsubscribers ? e._jihoUnsubscribers.push(n) : e._jihoUnsubscribers = [n], e.addEventListener("input", (i) => {
      if (t._setter)
        try {
          c === "checkbox" ? t._setter(i.target.checked) : c === "radio" ? i.target.checked && t._setter(i.target.value) : t._setter(i.target.value);
        } catch (s) {
          d(s, "input event handler");
        }
    });
  } else
    c === "checkbox" ? e.checked = !!t : c === "radio" ? e.checked = e.value === t : e.value = t;
}
function M(e, t, c) {
  if (!t || typeof t != "object") {
    console.warn("JihoFrame: Invalid options passed to applyAttributes");
    return;
  }
  const { text: r, style: n, id: i, className: s, event: u } = t;
  if (typeof r == "function") {
    const a = () => {
      const l = h(r, "text update");
      l !== null && (e.textContent = l);
    };
    a();
    const o = m(a);
    e._jihoUnsubscribers ? e._jihoUnsubscribers.push(o) : e._jihoUnsubscribers = [o];
  } else
    r !== void 0 && (e.textContent = r);
  if (n && typeof n == "object")
    try {
      Object.assign(e.style, n);
    } catch (a) {
      d(a, "style application");
    }
  if (i && (e.id = i), s && (e.className = s), Array.isArray(u))
    u.forEach((a) => {
      if (typeof a != "object") {
        console.warn("JihoFrame: Event object must be an object");
        return;
      }
      for (const [o, l] of Object.entries(a)) {
        if (!A(l, "function", `event ${o}`))
          continue;
        const p = o.toLowerCase().replace(/^on/, "");
        e.addEventListener(p, (b) => {
          h(() => l(b), `event handler ${o}`);
        });
      }
    });
  else if (u && typeof u == "object")
    for (const [a, o] of Object.entries(u)) {
      if (!A(o, "function", `event ${a}`))
        continue;
      const l = a.toLowerCase().replace(/^on/, "");
      e.addEventListener(l, (p) => {
        h(() => o(p), `event handler ${a}`);
      });
    }
  const f = (a) => {
    a.forEach((o) => {
      if (o in t)
        try {
          e[o] = t[o];
        } catch (l) {
          d(l, `setting attribute ${o}`);
        }
    });
  };
  switch (c) {
    case "input":
      f([
        "type",
        "checked",
        "multiple",
        "placeholder",
        "required",
        "name"
      ]);
      const a = t.type || "text";
      j(e, t.value, a);
      break;
    case "textarea":
      f(["placeholder", "required", "rows", "cols"]), j(e, t.value);
      break;
    case "select":
      f(["multiple", "required", "name"]), Array.isArray(t.options) && t.options.forEach((o) => {
        const l = document.createElement("option");
        typeof o == "string" ? (l.value = o, l.textContent = o) : o && typeof o == "object" && (l.value = o.value || "", l.textContent = o.label || o.value || ""), e.appendChild(l);
      }), j(e, t.value);
      break;
    case "checkbox":
      j(e, t.value, "checkbox");
      break;
    case "radio":
      j(e, t.value, "radio");
      break;
  }
  if (typeof t.disabled == "function") {
    const a = () => {
      const l = h(t.disabled, "disabled update");
      l !== null && (e.disabled = !!l);
    };
    a();
    const o = m(a);
    e._jihoUnsubscribers ? e._jihoUnsubscribers.push(o) : e._jihoUnsubscribers = [o];
  } else
    t.disabled !== void 0 && (e.disabled = !!t.disabled);
  if (typeof t.show == "function") {
    const a = () => {
      const l = h(t.show, "show update");
      l !== null && (e.style.display = l ? "" : "none");
    };
    a();
    const o = m(a);
    e._jihoUnsubscribers ? e._jihoUnsubscribers.push(o) : e._jihoUnsubscribers = [o];
  } else
    t.show === !1 && (e.style.display = "none");
}
function T(e, t) {
  var r;
  if (!t || typeof t != "object")
    return;
  const c = /* @__PURE__ */ new Set([
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
  if (Object.entries(t).forEach(([n, i]) => {
    if (!c.has(n))
      try {
        const s = typeof i == "function" ? h(i, `child component ${n}`) : i;
        if (!s)
          return;
        const [u, f] = Object.entries(s)[0], a = y(u, f);
        a && e.appendChild(a);
      } catch (s) {
        d(s, `rendering child ${n}`);
      }
  }), Array.isArray(t.children) && t.children.forEach((n, i) => {
    try {
      if (!n || typeof n != "object") {
        console.warn(`JihoFrame: Invalid child at index ${i}`);
        return;
      }
      const [s, u] = Object.entries(n)[0], f = y(s, u);
      f && e.appendChild(f);
    } catch (s) {
      d(s, `rendering child at index ${i}`);
    }
  }), (r = t.each) != null && r.list)
    try {
      const n = typeof t.each.list == "function" ? h(t.each.list, "each list function") : t.each.list;
      Array.isArray(n) && typeof t.each.render == "function" && n.forEach((i, s) => {
        try {
          const u = h(() => t.each.render(i, s), `each render at index ${s}`);
          if (u) {
            const [f, a] = Object.entries(u)[0], o = y(f, a);
            o && e.appendChild(o);
          }
        } catch (u) {
          d(u, `each item rendering at index ${s}`);
        }
      });
    } catch (n) {
      d(n, "each list processing");
    }
}
function k(e) {
  e._jihoUnsubscribers && (e._jihoUnsubscribers.forEach((t) => {
    try {
      t();
    } catch (c) {
      d(c, "cleanup unsubscribe");
    }
  }), delete e._jihoUnsubscribers), Array.from(e.children).forEach((t) => k(t));
}
function y(e, t) {
  try {
    if (typeof e == "function") {
      const r = h(() => e(t), `component ${e.name || "anonymous"}`);
      if (!r)
        return null;
      if (r.nodeType)
        return r;
      if (r.layout) {
        const s = document.createElement("div");
        return s.style.display = "contents", new $(s).update(r.layout), s;
      }
      const [n, i] = Object.entries(r)[0];
      return y(n, i);
    }
    if (typeof t == "function") {
      const r = h(t, "options function");
      if (!r)
        return null;
      const [n, i] = Object.entries(r)[0];
      return y(n, i);
    }
    if (typeof t == "string") {
      const r = document.createElement(e);
      return r.textContent = t, r;
    }
    if (typeof e != "string")
      return console.warn("JihoFrame: Tag must be a string, got:", typeof e), null;
    const c = document.createElement(e);
    return t && (M(c, t, e), T(c, t)), c;
  } catch (c) {
    return d(c, `createElement for tag ${e}`), null;
  }
}
function B(e, t) {
  if (!Array.isArray(e)) {
    console.warn("JihoFrame: Conditional block value must be an array");
    return;
  }
  let c = document.createComment("condition-start"), r = document.createComment("condition-end"), n = null, i = [];
  t.appendChild(c), t.appendChild(r);
  const s = () => {
    n && (k(n), n.parentNode && n.parentNode.removeChild(n), n = null), i.forEach((a) => {
      try {
        a();
      } catch (o) {
        d(o, "conditional cleanup unsubscribe");
      }
    }), i = [];
  }, u = () => {
    try {
      t.contains(r) || (r = document.createComment("condition-end"), t.appendChild(r)), s();
      let a = !1;
      for (const o of e) {
        if (!o || typeof o != "object") {
          console.warn("JihoFrame: Invalid conditional item");
          continue;
        }
        const [l, p] = Object.entries(o)[0];
        if (!p || typeof p != "object")
          continue;
        const b = p.if ?? (a ? !1 : p.elseIf ?? p.else);
        if ((typeof b == "function" ? h(b, "conditional condition") : b) && !a) {
          const U = y(l, p);
          if (U && t.contains(r)) {
            t.insertBefore(U, r), n = U, a = !0;
            break;
          }
        }
      }
    } catch (a) {
      d(a, "conditional block rerender");
    }
  }, f = m(u);
  return i.push(f), u(), s;
}
function I(e, t) {
  if (!e || typeof e != "object") {
    console.warn("JihoFrame: Switch block must be an object");
    return;
  }
  let c = document.createComment("switch-start"), r = document.createComment("switch-end"), n = null, i = [];
  t.appendChild(c), t.appendChild(r);
  const s = () => {
    n && (k(n), n.parentNode && n.parentNode.removeChild(n), n = null), i.forEach((a) => {
      try {
        a();
      } catch (o) {
        d(o, "switch cleanup unsubscribe");
      }
    }), i = [];
  }, u = () => {
    try {
      t.contains(r) || (r = document.createComment("switch-end"), t.appendChild(r)), s();
      const a = typeof e.switch == "function" ? h(e.switch, "switch value function") : e.switch;
      if (!Array.isArray(e.cases)) {
        console.warn("JihoFrame: Switch cases must be an array");
        return;
      }
      for (const o of e.cases)
        if (!(!o || typeof o != "object") && (o.case === a || o.default === !0) && o.element && typeof o.element == "object") {
          const [l, p] = Object.entries(o.element)[0], b = y(l, p);
          if (b && t.contains(r)) {
            t.insertBefore(b, r), n = b;
            break;
          }
        }
    } catch (a) {
      d(a, "switch block rerender");
    }
  }, f = m(u);
  return i.push(f), u(), s;
}
class $ {
  constructor(t) {
    this.container = t, this.currentNodes = [], this.cleanupFunctions = [];
  }
  // 기존 노드들 정리
  cleanup() {
    this.currentNodes.forEach((t) => {
      t && t.parentNode && (k(t), t.parentNode.removeChild(t));
    }), this.cleanupFunctions.forEach((t) => {
      try {
        t();
      } catch (c) {
        d(c, "DOM updater cleanup");
      }
    }), this.currentNodes = [], this.cleanupFunctions = [];
  }
  // 새로운 노드들 추가
  update(t) {
    if (this.cleanup(), !Array.isArray(t)) {
      console.warn("JihoFrame: Layout must be an array");
      return;
    }
    t.forEach((c, r) => {
      try {
        if (typeof c == "function") {
          const n = h(c, `layout function at index ${r}`);
          if (n) {
            const [i, s] = Object.entries(n)[0], u = y(i, s);
            u && (this.container.appendChild(u), this.currentNodes.push(u));
          }
        } else if (c && typeof c == "object") {
          const [n, i] = Object.entries(c)[0];
          if (n === "condition" && Array.isArray(i)) {
            const s = B(i, this.container);
            s && this.cleanupFunctions.push(s);
          } else if (n === "switchBlock") {
            const s = I(i, this.container);
            s && this.cleanupFunctions.push(s);
          } else {
            const s = y(n, i);
            s && (this.container.appendChild(s), this.currentNodes.push(s));
          }
        }
      } catch (n) {
        d(n, `rendering layout item at index ${r}`);
      }
    });
  }
}
function K(e, t) {
  if (typeof e != "function")
    throw new Error("JihoFrame: App must be a function");
  if (!t || !t.appendChild)
    throw new Error("JihoFrame: Container must be a valid DOM element");
  J.forEach((u) => {
    try {
      u();
    } catch (f) {
      d(f, "init callback");
    }
  });
  const c = new $(t);
  let r = [];
  const n = () => {
    try {
      const u = h(e, "app function");
      if (!u)
        return;
      if (!u.layout) {
        console.warn("JihoFrame: App function must return an object with layout property");
        return;
      }
      c.update(u.layout), _.forEach((f) => {
        try {
          f();
        } catch (a) {
          d(a, "mount callback");
        }
      });
    } catch (u) {
      d(u, "app rerender");
    }
  }, i = m(n);
  r.push(i), n();
  const s = () => {
    try {
      N.forEach((u) => {
        try {
          u();
        } catch (f) {
          d(f, "unmount callback");
        }
      }), c.cleanup(), r.forEach((u) => {
        try {
          u();
        } catch (f) {
          d(f, "app unsubscribe");
        }
      });
    } catch (u) {
      d(u, "app cleanup");
    }
  };
  return window.addEventListener("beforeunload", s), s;
}
export {
  z as createState,
  V as jihoInit,
  q as jihoMount,
  R as jihoUnMount,
  D as jihoUpdate,
  K as renderApp,
  m as subscribeState
};
