import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Ball } from '../ball';
import { Panel } from '../panel';

import './board.css';

type Props = {
    width: number;
    height: number;
    isRunning: boolean;
    onHit: (toLeft: boolean) => void;
    leftPanelColor: string;
    rightPanelColor: string;
    panelHeight?: number;
    ballRadius?: number;
    ballStep?: number;
    panelStep?: number;
    speed: number;
};

const W_KEY_CODE = 'KeyW';
const S_KEY_CODE = 'KeyS';
const UP_KEY_CODE = 'ArrowUp';
const DOWN_KEY_CODE = 'ArrowDown';

const DEFAULT_BALL_STEP = 5;
const DEFAULT_PANEL_HEIGHT = 100;
const DEFAULT_BALL_RADIUS = 8;
const DEFAULT_PANEL_STEP = 10;

export const Board = (props: Props) => {
    const {
        width,
        height,
        isRunning,
        onHit,
        leftPanelColor,
        rightPanelColor,
        speed,
        panelHeight = DEFAULT_PANEL_HEIGHT,
        ballRadius = DEFAULT_BALL_RADIUS,
        panelStep = DEFAULT_PANEL_STEP,
    } = props;

    const ballStep = (props.ballStep || DEFAULT_BALL_STEP) * speed;
    const ballFieldWidth = width - 20 * 2;

    const [ballPosition, setBallPosition] = useState({ x: width / 2, y: height / 2 });
    const [isMovingRight, setIsMovingRight] = useState(true);
    const yShift = useRef(0);

    // We read and write panels positions by reference.
    // This does not produce a component re-render, but we assume that
    // the next render will happen with ball position update interval
    const [panelTopPositions] = useState({
        left: (height - panelHeight) / 2,
        right: (height - panelHeight) / 2,
    });

    useEffect(() => {
        if (isMovingRight) {
            if (ballPosition.x >= ballFieldWidth - ballRadius) {
                const rightPanelTop = panelTopPositions.right;
                const rightPanelBottom = panelTopPositions.right + panelHeight;
                if (ballPosition.y + ballRadius < rightPanelTop || ballPosition.y - ballRadius > rightPanelBottom) {
                    onHit(false);
                } else {
                    yShift.current = getNewYShift(ballPosition.y, rightPanelTop, panelHeight, yShift.current);
                }
                setIsMovingRight(false);
            }
        } else {
            if (ballPosition.x <= ballRadius) {
                const leftPanelTop = panelTopPositions.left;
                const leftPanelBottom = panelTopPositions.left + panelHeight;
                if (ballPosition.y + ballRadius < leftPanelTop || ballPosition.y - ballRadius > leftPanelBottom) {
                    onHit(true);
                } else {
                    yShift.current = getNewYShift(ballPosition.y, leftPanelTop, panelHeight, yShift.current);
                }
                setIsMovingRight(true);
            }
        }

        if (ballPosition.y === ballRadius || ballPosition.y === height - ballRadius) {
            yShift.current = -yShift.current;
        }
    }, [ballPosition, isMovingRight, ballFieldWidth, panelHeight, onHit, ballRadius])

    useEffect(() => {
        if (!isRunning) {
            return;
        }
        const interval = setInterval(() => {
            setBallPosition(currentBallPosition => {
                const newYPosition = Math.max(
                    0 + ballRadius,
                    Math.min(height - ballRadius, currentBallPosition.y + yShift.current)
                );
                if (isMovingRight) {
                    return {
                        x: Math.min(ballFieldWidth - ballRadius, currentBallPosition.x + ballStep),
                        y: newYPosition,
                    };
                }
                return {
                    x: Math.max(ballRadius, currentBallPosition.x - ballStep),
                    y: newYPosition,
                };
            });
        }, 50);

        return () => {
            clearInterval(interval);
        };
    }, [ballFieldWidth, height, ballStep, ballRadius, isMovingRight, isRunning]);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            const lowestPossiblePosition = height - panelHeight;
            switch (event.code) {
                case W_KEY_CODE:
                    panelTopPositions.left = Math.max(0, panelTopPositions.left - panelStep);
                    break;
                case S_KEY_CODE:
                    panelTopPositions.left = Math.min(lowestPossiblePosition, panelTopPositions.left + panelStep);
                    break;
                case UP_KEY_CODE:
                    panelTopPositions.right = Math.max(0, panelTopPositions.right - panelStep);
                    break;
                case DOWN_KEY_CODE:
                    panelTopPositions.right = Math.min(lowestPossiblePosition, panelTopPositions.right + panelStep);
                    break;

                default:
                    break;
            }
        };

        // TODO: When key is pressed, update panel movement direction: -1, 0 or 1
        // Once keyup - clear direction
        // const onKeyUp = (event: KeyboardEvent) => {
        // };

        document.addEventListener('keydown', onKeyDown);
        // document.addEventListener('keyup', onKeyUp);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            // document.removeEventListener('keyup', onKeyUp);
        };
    }, [panelStep, panelHeight, height, isRunning]);

    const style = useMemo(() => ({
        width,
        height,
    }), [width, height]);

    return (
        <div className='board' style={style}>
            <div className='board__panel-container'>
                <Panel height={panelHeight} topPosition={panelTopPositions.left} color={leftPanelColor} />
            </div>
            <div className='board__ball-field'>
                <Ball radius={ballRadius} centerPositionX={ballPosition.x} centerPositionY={ballPosition.y} />
            </div>
            <div className='board__panel-container'>
                <Panel height={panelHeight} topPosition={panelTopPositions.right} color={rightPanelColor} />
            </div>
        </div>
    );
};

const getNewYShift = (
    ballPosition: number, panelTop: number, panelHeight: number, currentYShift: number
): number => {
    const MIN_Y_SHIFT = -5;
    const MAX_Y_SHIFT = 5;

    // Ball position relative to panel center
    const relativeBallPosition = ballPosition - panelTop - panelHeight / 2;
    const positionFraction = relativeBallPosition / (panelHeight / 2);
    const shiftDelta = Math.round(positionFraction * MAX_Y_SHIFT);

    // Do we need to consider current shift with higher weight?
    return Math.max(
        MIN_Y_SHIFT,
        Math.min(MAX_Y_SHIFT, currentYShift + shiftDelta),
    )
}