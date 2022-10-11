import { ReactElement } from 'react';
declare type DefaultRecordType = Record<string, any>;
interface CarouselProps<RecordType = unknown> extends xyData {
    children: ReactElement[];
    height: number;
    width: number;
    autoPlay?: boolean;
    farScale?: number;
}
interface xyData {
    xOrigin?: number;
    yOrigin?: number;
    xRadius?: number;
    yRadius?: number;
}
declare function Carousel<RecordType extends DefaultRecordType>(props: CarouselProps<RecordType>): JSX.Element;
export default Carousel;
