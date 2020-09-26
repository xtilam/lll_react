import React from 'react';
export default function CancelSVG(props: any) {
    return <svg style={{ ...props.style, fill: props.color || undefined }} className={props.className} id={props.id} onClick={props.onClick}
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 413.348 413.348">
        <g style={{transform: 'translate(10%, 10%) scale(.8)'}}>
            <path d="m413.348 24.354-24.354-24.354-182.32 182.32-182.32-182.32-24.354 24.354 182.32 182.32-182.32 182.32 24.354 24.354 182.32-182.32 182.32 182.32 24.354-24.354-182.32-182.32z" />
        </g>
    </svg>
}