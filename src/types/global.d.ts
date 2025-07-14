declare module 'he' {
    export function escape(text: string): string;
    export function unescape(text: string): string;
    export function encode(text: string, options?: any): string;
    export function decode(text: string, options?: any): string;
}
