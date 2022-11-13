import React from 'react';

import './ball.css'

type Props = {
    radius: number;
    centerPositionX: number;
    centerPositionY: number;
};

export const Ball = (props: Props) => {
    const {
        radius,
        centerPositionX,
        centerPositionY,
    } = props;

    const style = {
        borderRadius: radius,
        width: radius * 2,
        height: radius * 2,
        left: centerPositionX - radius,
        top: centerPositionY - radius,
    }

    return (
        <div className='ball' style={style} />
    );
}