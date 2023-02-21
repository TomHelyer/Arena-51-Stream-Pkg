/// <reference types="react-scripts" />

declare module '*.mp4' {
    const src: string;
    export default src;
}

declare module '*.webm' {
    const src: string;
    export default src;
}

type CasterObject = {
    name: string,
    vdo?: string,
}

type CastersObject = {
    0?: CasterObject,
    1?: CasterObject,
}