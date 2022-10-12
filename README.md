# react-carousel3d

> A 3D perspective carousel。预览地址：https://xiaxiangfeng.github.io/react-carousel3d/#/carousel

![Image text](https://xiaxiangfeng.github.io/react-carousel3d/image/Animation.gif)

## 从 NPM 下载包

```npm
npm i react-carousel3d
```

## Basic usage

Demo:

```tsx
import React from 'react';
import { Carousel } from 'react-carousel3d';

const style = {
  width: 297,
  height: 296,
};

export default () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom, #16235e 0%, #020223 100%)',
    }}
  >
    <Carousel height={460} width={980} yOrigin={42} yRadius={48} autoPlay={true}>
      <div key={1} style={style}>
        <img alt="" src="/image/1.png" />
      </div>
      <div key={2} style={style}>
        <img alt="" src="/image/2.png" />
      </div>
      <div key={3} style={style}>
        <img alt="" src="/image/3.png" />
      </div>
      <div key={4} style={style}>
        <img alt="" src="/image/4.png" />
      </div>
      <div key={5} style={style}>
        <img alt="" src="/image/5.png" />
      </div>
      <div key={6} style={style}>
        <img alt="" src="/image/6.png" />
      </div>
    </Carousel>
  </div>
);
```

### Carousel options

You may pass these options to the carousel constructor. Some of these properties may be changed during runtime via the data handle.

<table>
  <tr>
    <th>Option</th>
    <th>Description</th>
    <th>Default</th>
  </tr>
  <tr>
    <td>height</td>
    <td>container height</td>
    <td></td>
  </tr>
  <tr>
    <td>width</td>
    <td>container width</td>
    <td></td>
  </tr>
  <tr>
    <td>xOrigin</td>
    <td>Center of the carousel (x coordinate)</td>
    <td>(container width / 2)</td>
  </tr>
  <tr>
    <td>yOrigin</td>
    <td>Center of the carousel (y coordinate)</td>
    <td>(container height / 10)</td>
  </tr>
  <tr>
    <td>xRadius</td>
    <td>Half the width of the carousel</td>
    <td>(container width / 2.3)</td>
  </tr>
  <tr>
    <td>yRadius</td>
    <td>Half the height of the carousel</td>
    <td>(container height / 6)</td>
  </tr>
  <tr>
    <td>autoPlay</td>
    <td>auto play</td>
    <td>false</td>
  </tr>
</table>

## Getting Started

Install dependencies,

```bash
$ npm i
```

Start the dev server,

```bash
$ npm start
```

Build documentation,

```bash
$ npm run docs:build
```

Run test,

```bash
$ npm test
```

Build library via `father`,

```bash
$ npm run build
```
