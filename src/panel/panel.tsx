import React from 'react';

import './panel.css';

type Props = {
    height: number;
    topPosition: number;
    color: string;
};

export const Panel = (props: Props) => {
    const {
        height,
        topPosition,
        color,
    } = props;

    const style = {
        height,
        top: topPosition,
        backgroundColor: color,
    };

    return (
        <div className='panel' style={style} />
    );
}