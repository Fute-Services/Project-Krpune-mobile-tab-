// In React Native, `require()`/import of a static asset returns a numeric module id.
declare module '*.png' { const v: number; export default v; }
declare module '*.jpg' { const v: number; export default v; }
declare module '*.jpeg' { const v: number; export default v; }
declare module '*.webp' { const v: number; export default v; }
declare module '*.gif' { const v: number; export default v; }
declare module '*.svg' { const v: number; export default v; }
declare module '*.mp4' { const v: number; export default v; }
declare module '*.pdf' { const v: number; export default v; }
declare module '*.txt' { const v: number; export default v; }

// NativeWind's global stylesheet is a side-effect import.
declare module '*.css';
