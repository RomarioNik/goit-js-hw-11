(function () {
  var t = function (t, i) {
    return function () {
      return t.apply(i, arguments);
    };
  };
  this.StackUp = (function () {
    function i(i) {
      (this.resizeHandler = t(this.resizeHandler, this)),
        (this.resizeComplete = t(this.resizeComplete, this)),
        this.setConfig(i);
    }
    return (
      (i.prototype.boundaryHeight = 0),
      (i.prototype.boundaryWidth = 0),
      (i.prototype.containerEl = void 0),
      (i.prototype.containerHeight = 0),
      (i.prototype.containerWidth = 0),
      (i.prototype.itemEls = void 0),
      (i.prototype.items = []),
      (i.prototype.numberOfColumns = 0),
      (i.prototype.config = {
        boundaryEl: window,
        columnWidth: 320,
        containerSelector: void 0,
        gutter: 18,
        isFluid: !1,
        itemsSelector: void 0,
        layout: 'ordinal',
        numberOfColumns: 3,
        resizeDebounceDelay: 350,
        moveItem: function (t, i, e, o) {
          return (t.style.left = i + 'px'), (t.style.top = e + 'px'), o();
        },
        scaleContainer: function (t, i, e, o) {
          return (t.style.height = e + 'px'), (t.style.width = i + 'px'), o();
        },
      }),
      (i.prototype.setConfig = function (t) {
        var i, e;
        if (t) for (i in t) (e = t[i]), (this.config[i] = e);
        return this;
      }),
      (i.prototype.initialize = function () {
        return (
          window.addEventListener('resize', this.resizeHandler),
          this.boundaryUpdate(),
          this.getEls(),
          this.populateItems(),
          this.updateNumberOfColumns(),
          this.applyLayout(),
          this.draw(),
          this
        );
      }),
      (i.prototype.boundaryUpdate = function () {
        var t, i, e;
        return (
          this.config.boundaryEl !== window
            ? ((i =
                this.config.boundaryEl.currentStyle ||
                window.getComputedStyle(this.config.boundaryEl)),
              (t = parseFloat(i.paddingLeft) + parseFloat(i.paddingRight)),
              (e = parseFloat(i.paddingTop) + parseFloat(i.paddingBottom)),
              (this.boundaryHeight = this.config.boundaryEl.offsetHeight - e),
              (this.boundaryWidth = this.config.boundaryEl.offsetWidth - t))
            : ((this.boundaryHeight = window.innerHeight),
              (this.boundaryWidth = window.innerWidth)),
          this
        );
      }),
      (i.prototype.resizeDebounceTimeout = void 0),
      (i.prototype.resizeDebounce = function (t, i) {
        return (
          clearTimeout(this.resizeDebounceTimeout),
          (this.resizeDebounceTimeout = window.setTimeout(t, i)),
          this
        );
      }),
      (i.prototype.resizeComplete = function () {
        return (
          this.calculateNumberOfColumns() !== this.numberOfColumns &&
            this.config.isFluid &&
            this.restack(),
          this
        );
      }),
      (i.prototype.resizeHandler = function () {
        return (
          this.boundaryUpdate(),
          this.resizeDebounce(
            this.resizeComplete,
            this.config.resizeDebounceDelay
          ),
          this
        );
      }),
      (i.prototype.getEls = function () {
        return (
          (this.containerEl = document.querySelector(
            this.config.containerSelector
          )),
          (this.itemEls = document.querySelectorAll(
            this.config.containerSelector + ' > ' + this.config.itemsSelector
          )),
          this
        );
      }),
      (i.prototype.appendItem = function (t) {
        return (
          (t.style.width = this.config.columnWidth + 'px'),
          this.items.push([t, t.offsetHeight, 0, 0]),
          this
        );
      }),
      (i.prototype.populateItems = function () {
        var t, i, e, o, n;
        for (
          this.items = [], n = this.itemEls, t = e = 0, o = n.length;
          e < o;
          t = ++e
        )
          (i = n[t]), this.appendItem(i);
        return this;
      }),
      (i.prototype.calculateNumberOfColumns = function () {
        var t;
        return (
          (t = this.config.isFluid
            ? Math.floor(
                (this.boundaryWidth - this.config.gutter) /
                  (this.config.columnWidth + this.config.gutter)
              )
            : this.config.numberOfColumns),
          t > this.items.length && (t = this.items.length),
          this.items.length && t <= 0 && (t = 1),
          t
        );
      }),
      (i.prototype.updateNumberOfColumns = function () {
        return (this.numberOfColumns = this.calculateNumberOfColumns()), this;
      }),
      (i.prototype.draw = function () {
        var t, i;
        return (
          (this.containerWidth =
            (this.config.columnWidth + this.config.gutter) *
            this.numberOfColumns),
          (t = this.containerHeight + this.config.gutter),
          (i = this.containerWidth + this.config.gutter),
          this.config.scaleContainer(
            this.containerEl,
            i,
            t,
            (function (t) {
              return function () {
                var i, e, o, n, r, s, u;
                for (
                  i = function () {},
                    s = t.items,
                    u = [],
                    e = n = 0,
                    r = s.length;
                  n < r;
                  e = ++n
                )
                  (o = s[e]), u.push(t.config.moveItem(o[0], o[2], o[3], i));
                return u;
              };
            })(this)
          ),
          this
        );
      }),
      (i.prototype.layout = {
        columnPointer: 0,
        ordinal: {
          stack: [],
          setup: function () {
            var t;
            return (this.stack = function () {
              var i, e, o, n;
              for (
                n = [], t = i = 0, e = this.context.numberOfColumns - 1;
                0 <= e ? i <= e : i >= e;
                t = 0 <= e ? ++i : --i
              )
                n.push(((o = 0), (t = o[0]), o));
              return n;
            }.call(this));
          },
          plot: function (t) {
            var i;
            if (
              ((i = this.context),
              (i.items[t][2] =
                i.config.gutter +
                (i.config.columnWidth + i.config.gutter) *
                  i.layout.columnPointer),
              (i.items[t][3] =
                i.config.gutter + this.stack[i.layout.columnPointer]),
              (this.stack[i.layout.columnPointer] +=
                i.items[t][1] + i.config.gutter),
              this.stack[i.layout.columnPointer] > i.containerHeight &&
                (i.containerHeight = this.stack[i.layout.columnPointer]),
              ++i.layout.columnPointer >= i.numberOfColumns)
            )
              return (i.layout.columnPointer = 0);
          },
          loop: function () {
            var t, i, e, o;
            for (
              o = [], t = i = 0, e = this.context.items.length - 1;
              0 <= e ? i <= e : i >= e;
              t = 0 <= e ? ++i : --i
            )
              o.push(this.plot(t));
            return o;
          },
        },
        optimized: {
          stack: [],
          setup: function () {
            var t;
            return (this.stack = function () {
              var i, e, o, n;
              for (
                n = [], t = i = 0, e = this.context.numberOfColumns - 1;
                0 <= e ? i <= e : i >= e;
                t = 0 <= e ? ++i : --i
              )
                n.push(((o = [t, 0]), (t = o[0]), o));
              return n;
            }.call(this));
          },
          plot: function (t) {
            var i;
            if (
              ((i = this.context),
              (i.items[t][2] =
                i.config.gutter +
                (i.config.columnWidth + i.config.gutter) * this.stack[0][0]),
              (i.items[t][3] = i.config.gutter + this.stack[0][1]),
              (this.stack[0][1] += i.items[t][1] + i.config.gutter),
              this.stack[0][1] > i.containerHeight &&
                (i.containerHeight = this.stack[0][1]),
              this.stack.sort(function (t, i) {
                return t[1] - i[1];
              }),
              ++i.layout.columnPointer >= i.numberOfColumns)
            )
              return (i.layout.columnPointer = 0);
          },
          loop: function () {
            var t, i, e, o;
            for (
              o = [], t = i = 0, e = this.context.items.length - 1;
              0 <= e ? i <= e : i >= e;
              t = 0 <= e ? ++i : --i
            )
              o.push(this.plot(t));
            return o;
          },
        },
      }),
      (i.prototype.applyLayout = function () {
        return (
          (this.layout[this.config.layout].context = this),
          this.layout[this.config.layout].setup(),
          this.items.length && this.layout[this.config.layout].loop(),
          this
        );
      }),
      (i.prototype.resetLayout = function () {
        return (
          (this.containerHeight = 0), (this.layout.columnPointer = 0), this
        );
      }),
      (i.prototype.reset = function () {
        return (
          (this.containerWidth = 0),
          (this.containerHeight = 0),
          (this.items = []),
          this.getEls().populateItems().resetLayout().restack(),
          this
        );
      }),
      (i.prototype.append = function (t, i) {
        var e;
        return (
          (e = this.items.length),
          this.appendItem(t),
          this.calculateNumberOfColumns() === this.numberOfColumns
            ? (this.layout[this.config.layout].plot(e), this.draw())
            : this.restack(),
          this
        );
      }),
      (i.prototype.restack = function () {
        return (
          this.updateNumberOfColumns().resetLayout().applyLayout().draw(), this
        );
      }),
      i
    );
  })();
}.call(this));
