## Carousel

Demo:

```tsx
import React from 'react';
import { Carousel } from 'react-carousel3';

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
