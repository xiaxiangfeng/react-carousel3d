function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { cloneElement, useCallback, useEffect, useRef } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
var cancelFrame = window.cancelAnimationFrame;
var requestFrame = window.requestAnimationFrame;

function time() {
  return performance.now();
}

function moveTo(item, x, y, scale) {
  var style = item.style;
  style.zIndex = "".concat(scale * 100 | 0);
  style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
}

function renderItem(item, _ref) {
  var rotation = _ref.rotation,
      farScale = _ref.farScale,
      xOrigin = _ref.xOrigin,
      yOrigin = _ref.yOrigin,
      xRadius = _ref.xRadius,
      yRadius = _ref.yRadius;
  var sin = Math.sin(rotation);
  var scale = farScale + (1 - farScale) * (sin + 1) * 0.5;
  moveTo(item, xOrigin + scale * (Math.cos(rotation) * xRadius - item.offsetHeight * 0.5), yOrigin + scale * sin * yRadius, scale);
}

function render(items, _ref2) {
  var rotation = _ref2.rotation,
      farScale = _ref2.farScale,
      xOrigin = _ref2.xOrigin,
      yOrigin = _ref2.yOrigin,
      xRadius = _ref2.xRadius,
      yRadius = _ref2.yRadius;
  var count = items.length;
  var spacing = 2 * Math.PI / count;
  var radians = rotation;

  for (var i = 0; i < count; i++) {
    renderItem(items[i], {
      rotation: radians,
      farScale: farScale,
      xOrigin: xOrigin,
      yOrigin: yOrigin,
      xRadius: xRadius,
      yRadius: yRadius
    });
    radians += spacing;
  }
}

function itemsRotated(itemCount, rotation) {
  return itemCount * (Math.PI / 2 - rotation) / (2 * Math.PI);
}

function floatIndex(itemCount, rotation) {
  var count = itemCount;
  var floatIndex = itemsRotated(itemCount, rotation) % count; // Make sure float-index is positive

  return floatIndex < 0 ? floatIndex + count : floatIndex;
} // Spin the carousel.  Count is the number (+-) of carousel items to rotate


function go(count, destRotation, itemCount) {
  return destRotation += 2 * Math.PI / itemCount * count;
}

function play(destRotation, rotation, speed, fn) {
  var timer = 0;
  var lastTime = 0;
  if (timer === 0) scheduleNextFrame();

  function playFrame() {
    var rem = destRotation - rotation;
    var now = time();
    var dt = (now - lastTime) * 0.002;
    lastTime = now;

    if (Math.abs(rem) < 0.003) {
      rotation = destRotation;
      cancelFrame(timer);
      timer = 0;
    } else {
      // Rotate asymptotically closer to the destination
      rotation = destRotation - rem / (1 + speed * dt);
      scheduleNextFrame();
    }

    fn(rotation, timer);
  }

  function scheduleNextFrame() {
    lastTime = time();
    timer = requestFrame(playFrame);
  }
}

function xy(box, data) {
  var boxWidth = box.offsetWidth || 0;
  var boxHeight = box.offsetHeight || 0;
  var xOrigin = data.xOrigin || boxWidth * 0.5;
  var yOrigin = data.yOrigin || boxHeight * 0.1;
  var xRadius = data.xRadius || boxWidth / 2.3;
  var yRadius = data.yRadius || boxHeight / 6;
  return {
    xOrigin: xOrigin,
    yOrigin: yOrigin,
    xRadius: xRadius,
    yRadius: yRadius
  };
}

function content(items, onClick) {
  var style = {
    display: 'inline-block',
    position: 'absolute',
    transformOrigin: '0 0'
  };
  return items.map(function (item, index) {
    return /*#__PURE__*/cloneElement(item, {
      index: index,
      onClick: onClick,
      style: _objectSpread(_objectSpread({}, item.props.style), style)
    });
  });
}

function Carousel(props) {
  var children = props.children,
      height = props.height,
      width = props.width,
      autoPlay = props.autoPlay;
  var boxRef = useRef(null);
  var playTimer = useRef(0);
  var rotation = useRef(Math.PI / 2);
  var destRotation = useRef(Math.PI / 2);
  var farScale = 0.5;
  var speed = 4;
  var carousel = useCallback(function (index) {
    destRotation.current = go(index, destRotation.current, children.length);
    play(destRotation.current, rotation.current, speed, function (data, timer) {
      var _boxRef$current;

      if (!boxRef.current) return;
      playTimer.current = timer;
      rotation.current = data;

      var _xy = xy(boxRef.current, props),
          xOrigin = _xy.xOrigin,
          yOrigin = _xy.yOrigin,
          xRadius = _xy.xRadius,
          yRadius = _xy.yRadius;

      render((_boxRef$current = boxRef.current) === null || _boxRef$current === void 0 ? void 0 : _boxRef$current.children, {
        rotation: data,
        farScale: farScale,
        xOrigin: xOrigin,
        yOrigin: yOrigin,
        xRadius: xRadius,
        yRadius: yRadius
      });
    });
  }, []);
  useEffect(function () {
    var _boxRef$current2;

    var autoPlayTimer;
    var children = ((_boxRef$current2 = boxRef.current) === null || _boxRef$current2 === void 0 ? void 0 : _boxRef$current2.children) || [];

    var _xy2 = xy(boxRef.current, props),
        xOrigin = _xy2.xOrigin,
        yOrigin = _xy2.yOrigin,
        xRadius = _xy2.xRadius,
        yRadius = _xy2.yRadius;

    render(children, {
      rotation: rotation.current,
      farScale: farScale,
      xOrigin: xOrigin,
      yOrigin: yOrigin,
      xRadius: xRadius,
      yRadius: yRadius
    });

    if (autoPlay) {
      autoPlayTimer = setInterval(function () {
        carousel(1);
      }, 2000);
    }

    return function () {
      clearInterval(autoPlayTimer);
      cancelFrame(playTimer.current);
    };
  }, []);
  var itemClick = useCallback(function (e) {
    var idx = e.currentTarget.getAttribute('index');
    var count = children.length;
    var diff = idx - floatIndex(count, rotation.current) % count;
    if (!diff) return; // Normalise "diff" to represent the shortest way to rotate item to front

    if (2 * Math.abs(diff) > count) diff += diff > 0 ? -count : count; // Suppress default browser action if the item isn't roughly in front

    if (Math.abs(diff) > 0.5) e.preventDefault();
    carousel(-diff);
  }, []);
  return /*#__PURE__*/_jsx("div", {
    onClick: function onClick(e) {},
    ref: boxRef,
    style: {
      position: 'relative',
      height: height,
      width: width
    },
    children: content(children, itemClick)
  });
}

export default Carousel;