/*! artDialog v6.0.2 | https://github.com/aui/artDialog */
!(function () {
  function a(b) {
    var d = c[b],
      e = "exports";
    return "object" == typeof d
      ? d
      : (d[e] || ((d[e] = {}), (d[e] = d.call(d[e], a, d[e], d) || d[e])),
        d[e]);
  }
  function b(a, b) {
    c[a] = b;
  }
  var c = {};
  b("jquery", function () {
    return jQuery;
  }),
    b("popup", function (a) {
      function b() {
        (this.destroyed = !1),
          (this.__popup = c("<div />")
            .attr({ tabindex: "-1" })
            .css({ display: "none", position: "absolute", outline: 0 })
            .html(this.innerHTML)
            .appendTo("body")),
          (this.__backdrop = c("<div />")),
          (this.node = this.__popup[0]),
          (this.backdrop = this.__backdrop[0]),
          d++;
      }
      var c = a("jquery"),
        d = 0,
        e = !("minWidth" in c("html")[0].style),
        f = !e;
      return (
        c.extend(b.prototype, {
          node: null,
          backdrop: null,
          fixed: !1,
          destroyed: !0,
          open: !1,
          returnValue: "",
          autofocus: !0,
          align: "bottom left",
          backdropBackground: "#000",
          backdropOpacity: 0.7,
          innerHTML: "",
          className: "ui-popup",
          show: function (a) {
            if (this.destroyed) return this;
            var b = this,
              d = this.__popup;
            return (
              (this.__activeElement = this.__getActive()),
              (this.open = !0),
              (this.follow = a || this.follow),
              this.__ready ||
                (d.addClass(this.className),
                this.modal && this.__lock(),
                d.html() || d.html(this.innerHTML),
                e ||
                  c(window).on(
                    "resize",
                    (this.__onresize = function () {
                      b.reset();
                    })
                  ),
                (this.__ready = !0)),
              d
                .addClass(this.className + "-show")
                .attr("role", this.modal ? "alertdialog" : "dialog")
                .css("position", this.fixed ? "fixed" : "absolute")
                .show(),
              this.__backdrop.show(),
              this.reset().focus(),
              this.__dispatchEvent("show"),
              this
            );
          },
          showModal: function () {
            return (this.modal = !0), this.show.apply(this, arguments);
          },
          close: function (a) {
            return (
              !this.destroyed &&
                this.open &&
                (void 0 !== a && (this.returnValue = a),
                this.__popup.hide().removeClass(this.className + "-show"),
                this.__backdrop.hide(),
                (this.open = !1),
                this.blur(),
                this.__dispatchEvent("close")),
              this
            );
          },
          remove: function () {
            if (this.destroyed) return this;
            this.__dispatchEvent("beforeremove"),
              b.current === this && (b.current = null),
              this.__unlock(),
              this.__popup.remove(),
              this.__backdrop.remove(),
              e || c(window).off("resize", this.__onresize),
              this.__dispatchEvent("remove");
            for (var a in this) delete this[a];
            return this;
          },
          reset: function () {
            var a = this.follow;
            return (
              a ? this.__follow(a) : this.__center(),
              this.__dispatchEvent("reset"),
              this
            );
          },
          focus: function () {
            var a = this.node,
              d = b.current;
            if (
              (d && d !== this && d.blur(!1),
              !c.contains(a, this.__getActive()))
            ) {
              var e = this.__popup.find("[autofocus]")[0];
              !this._autofocus && e ? (this._autofocus = !0) : (e = a),
                this.__focus(e);
            }
            return (
              (b.current = this),
              this.__popup.addClass(this.className + "-focus"),
              this.__zIndex(),
              this.__dispatchEvent("focus"),
              this
            );
          },
          blur: function () {
            var a = this.__activeElement,
              b = arguments[0];
            return (
              b !== !1 && this.__focus(a),
              (this._autofocus = !1),
              this.__popup.removeClass(this.className + "-focus"),
              this.__dispatchEvent("blur"),
              this
            );
          },
          addEventListener: function (a, b) {
            return this.__getEventListener(a).push(b), this;
          },
          removeEventListener: function (a, b) {
            for (var c = this.__getEventListener(a), d = 0; d < c.length; d++)
              b === c[d] && c.splice(d--, 1);
            return this;
          },
          __getEventListener: function (a) {
            var b = this.__listener;
            return b || (b = this.__listener = {}), b[a] || (b[a] = []), b[a];
          },
          __dispatchEvent: function (a) {
            var b = this.__getEventListener(a);
            this["on" + a] && this["on" + a]();
            for (var c = 0; c < b.length; c++) b[c].call(this);
          },
          __focus: function (a) {
            try {
              this.autofocus && !/^iframe$/i.test(a.nodeName) && a.focus();
            } catch (b) {}
          },
          __getActive: function () {
            try {
              var a = document.activeElement,
                b = a.contentDocument,
                c = (b && b.activeElement) || a;
              return c;
            } catch (d) {}
          },
          __zIndex: function () {
            var a = b.zIndex++;
            this.__popup.css("zIndex", a),
              this.__backdrop.css("zIndex", a - 1),
              (this.zIndex = a);
          },
          __center: function () {
            var a = this.__popup,
              b = c(window),
              d = c(document),
              e = this.fixed,
              f = e ? 0 : d.scrollLeft(),
              g = e ? 0 : d.scrollTop(),
              h = b.width(),
              i = b.height(),
              j = a.width(),
              k = a.height(),
              l = (h - j) / 2 + f,
              m = (382 * (i - k)) / 1e3 + g,
              n = a[0].style;
            (n.left = Math.max(parseInt(l), f) + "px"),
              (n.top = Math.max(parseInt(m), g) + "px");
          },
          __follow: function (a) {
            var b = a.parentNode && c(a),
              d = this.__popup;
            if ((this.__followSkin && d.removeClass(this.__followSkin), b)) {
              var e = b.offset();
              if (e.left * e.top < 0) return this.__center();
            }
            var f = this,
              g = this.fixed,
              h = c(window),
              i = c(document),
              j = h.width(),
              k = h.height(),
              l = i.scrollLeft(),
              m = i.scrollTop(),
              n = d.width(),
              o = d.height(),
              p = b ? b.outerWidth() : 0,
              q = b ? b.outerHeight() : 0,
              r = this.__offset(a),
              s = r.left,
              t = r.top,
              u = g ? s - l : s,
              v = g ? t - m : t,
              w = g ? 0 : l,
              x = g ? 0 : m,
              y = w + j - n,
              z = x + k - o,
              A = {},
              B = this.align.split(" "),
              C = this.className + "-",
              D = {
                top: "bottom",
                bottom: "top",
                left: "right",
                right: "left",
              },
              E = { top: "top", bottom: "top", left: "left", right: "left" },
              F = [
                { top: v - o, bottom: v + q, left: u - n, right: u + p },
                { top: v, bottom: v - o + q, left: u, right: u - n + p },
              ],
              G = { left: u + p / 2 - n / 2, top: v + q / 2 - o / 2 },
              H = { left: [w, y], top: [x, z] };
            c.each(B, function (a, b) {
              F[a][b] > H[E[b]][1] && (b = B[a] = D[b]),
                F[a][b] < H[E[b]][0] && (B[a] = D[b]);
            }),
              B[1] ||
                ((E[B[1]] = "left" === E[B[0]] ? "top" : "left"),
                (F[1][B[1]] = G[E[B[1]]])),
              (C += B.join("-") + " " + this.className + "-follow"),
              (f.__followSkin = C),
              b && d.addClass(C),
              (A[E[B[0]]] = parseInt(F[0][B[0]])),
              (A[E[B[1]]] = parseInt(F[1][B[1]])),
              d.css(A);
          },
          __offset: function (a) {
            var b = a.parentNode,
              d = b ? c(a).offset() : { left: a.pageX, top: a.pageY };
            a = b ? a : a.target;
            var e = a.ownerDocument,
              f = e.defaultView || e.parentWindow;
            if (f == window) return d;
            var g = f.frameElement,
              h = c(e),
              i = h.scrollLeft(),
              j = h.scrollTop(),
              k = c(g).offset(),
              l = k.left,
              m = k.top;
            return { left: d.left + l - i, top: d.top + m - j };
          },
          __lock: function () {
            var a = this,
              d = this.__popup,
              e = this.__backdrop,
              g = {
                position: "fixed",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                userSelect: "none",
                opacity: 0,
                background: this.backdropBackground,
              };
            d.addClass(this.className + "-modal"),
              (b.zIndex = b.zIndex + 2),
              this.__zIndex(),
              f ||
                c.extend(g, {
                  position: "absolute",
                  width: c(window).width() + "px",
                  height: c(document).height() + "px",
                }),
              e
                .css(g)
                .animate({ opacity: this.backdropOpacity }, 150)
                .insertAfter(d)
                .attr({ tabindex: "0" })
                .on("focus", function () {
                  a.focus();
                });
          },
          __unlock: function () {
            this.modal &&
              (this.__popup.removeClass(this.className + "-modal"),
              this.__backdrop.remove(),
              delete this.modal);
          },
        }),
        (b.zIndex = 9999),
        (b.current = null),
        b
      );
    }),
    b("dialog-config", {
      content: '<span class="ui-dialog-loading">Loading..</span>',
      title: "",
      statusbar: "",
      button: null,
      ok: null,
      cancel: null,
      okValue: "ok",
      cancelValue: "cancel",
      cancelDisplay: !0,
      width: "",
      height: "",
      padding: "",
      skin: "",
      quickClose: !1,
      cssUri: "../css/ui-dialog.css",
      innerHTML:
        '<div i="dialog" class="ui-dialog"><div class="ui-dialog-arrow-a"></div><div class="ui-dialog-arrow-b"></div><table class="ui-dialog-grid"><tr><td i="header" class="ui-dialog-header"><button i="close" class="ui-dialog-close">&#215;</button><div i="title" class="ui-dialog-title"></div></td></tr><tr><td i="body" class="ui-dialog-body"><div i="content" class="ui-dialog-content"></div></td></tr><tr><td i="footer" class="ui-dialog-footer"><div i="statusbar" class="ui-dialog-statusbar"></div><div i="button" class="ui-dialog-button"></div></td></tr></table></div>',
    }),
    b("dialog", function (a) {
      var b = a("jquery"),
        c = a("popup"),
        d = a("dialog-config"),
        e = d.cssUri;
      if (e) {
        var f = a[a.toUrl ? "toUrl" : "resolve"];
        f &&
          ((e = f(e)),
          (e = '<link rel="stylesheet" href="' + e + '" />'),
          b("base")[0] ? b("base").before(e) : b("head").append(e));
      }
      var g = 0,
        h = new Date() - 0,
        i = !("minWidth" in b("html")[0].style),
        j =
          ("createTouch" in document && !("onmousemove" in document)) ||
          /(iPhone|iPad|iPod)/i.test(navigator.userAgent),
        k = !i && !j,
        l = function (a, c, d) {
          var e = (a = a || {});
          ("string" == typeof a || 1 === a.nodeType) &&
            (a = { content: a, fixed: !j }),
            (a = b.extend(!0, {}, l.defaults, a)),
            (a._ = e);
          var f = (a.id = a.id || h + g),
            i = l.get(f);
          return i
            ? i.focus()
            : (k || (a.fixed = !1),
              a.quickClose &&
                ((a.modal = !0), e.backdropOpacity || (a.backdropOpacity = 0)),
              b.isArray(a.button) || (a.button = []),
              void 0 !== d && (a.cancel = d),
              a.cancel &&
                a.button.push({
                  id: "cancel",
                  value: a.cancelValue,
                  callback: a.cancel,
                  display: a.cancelDisplay,
                }),
              void 0 !== c && (a.ok = c),
              a.ok &&
                a.button.push({
                  id: "ok",
                  value: a.okValue,
                  callback: a.ok,
                  autofocus: !0,
                }),
              (l.list[f] = new l.create(a)));
        },
        m = function () {};
      m.prototype = c.prototype;
      var n = (l.prototype = new m());
      return (
        (l.create = function (a) {
          var d = this;
          b.extend(this, new c());
          var e = b(this.node).html(a.innerHTML);
          return (
            (this.options = a),
            (this._popup = e),
            b.each(a, function (a, b) {
              "function" == typeof d[a] ? d[a](b) : (d[a] = b);
            }),
            a.zIndex && (c.zIndex = a.zIndex),
            e.attr({
              "aria-labelledby": this._$("title")
                .attr("id", "title:" + this.id)
                .attr("id"),
              "aria-describedby": this._$("content")
                .attr("id", "content:" + this.id)
                .attr("id"),
            }),
            this._$("close")
              .css("display", this.cancel === !1 ? "none" : "")
              .attr("title", this.cancelValue)
              .on("click", function (a) {
                d._trigger("cancel"), a.preventDefault();
              }),
            this._$("dialog").addClass(this.skin),
            this._$("body").css("padding", this.padding),
            e.on("click", "[data-id]", function (a) {
              var c = b(this);
              c.attr("disabled") || d._trigger(c.data("id")),
                a.preventDefault();
            }),
            a.quickClose &&
              b(this.backdrop).on(
                "onmousedown" in document ? "mousedown" : "click",
                function () {
                  return d._trigger("cancel"), !1;
                }
              ),
            (this._esc = function (a) {
              var b = a.target,
                e = b.nodeName,
                f = /^input|textarea$/i,
                g = c.current === d,
                h = a.keyCode;
              !g ||
                (f.test(e) && "button" !== b.type) ||
                (27 === h && d._trigger("cancel"));
            }),
            b(document).on("keydown", this._esc),
            this.addEventListener("remove", function () {
              b(document).off("keydown", this._esc), delete l.list[this.id];
            }),
            g++,
            l.oncreate(this),
            this
          );
        }),
        (l.create.prototype = n),
        b.extend(n, {
          content: function (a) {
            return (
              this._$("content")
                .empty("")
                ["object" == typeof a ? "append" : "html"](a),
              this.reset()
            );
          },
          title: function (a) {
            return (
              this._$("title").text(a),
              this._$("header")[a ? "show" : "hide"](),
              this
            );
          },
          width: function (a) {
            return this._$("content").css("width", a), this.reset();
          },
          height: function (a) {
            return this._$("content").css("height", a), this.reset();
          },
          button: function (a) {
            a = a || [];
            var c = this,
              d = "",
              e = 0;
            return (
              (this.callbacks = {}),
              "string" == typeof a
                ? (d = a)
                : b.each(a, function (a, b) {
                    (b.id = b.id || b.value), (c.callbacks[b.id] = b.callback);
                    var f = "";
                    b.display === !1 ? (f = ' style="display:none"') : e++,
                      (d +=
                        '<button type="button" data-id="' +
                        b.id +
                        '"' +
                        f +
                        (b.disabled ? " disabled" : "") +
                        (b.autofocus
                          ? ' autofocus class="ui-dialog-autofocus"'
                          : "") +
                        ">" +
                        b.value +
                        "</button>");
                  }),
              this._$("footer")[e ? "show" : "hide"](),
              this._$("button").html(d),
              this
            );
          },
          statusbar: function (a) {
            return this._$("statusbar").html(a)[a ? "show" : "hide"](), this;
          },
          _$: function (a) {
            return this._popup.find("[i=" + a + "]");
          },
          _trigger: function (a) {
            var b = this.callbacks[a];
            return "function" != typeof b || b.call(this) !== !1
              ? this.close().remove()
              : this;
          },
        }),
        (l.oncreate = b.noop),
        (l.getCurrent = function () {
          return c.current;
        }),
        (l.get = function (a) {
          return void 0 === a ? l.list : l.list[a];
        }),
        (l.list = {}),
        (l.defaults = d),
        l
      );
    }),
    (window.dialog = a("dialog"));
})();
