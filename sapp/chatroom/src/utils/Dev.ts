/**
 * 开发时使用的一些常用工具
 * @author dodo
 * @date 2020.04.30
 */

export default class Dev {
    /// TODO
    public static TODO(): void {
        console.warn("TODO...");
    }

    /// DEPRECATED
    public static DEPRECATED(msg?: string): void {
        if (msg) {
            console.warn("[DEPRECATED]: " + msg);
        } else {
            console.warn("[DEPRECATED]");
        }
    }

    /// print
    public static print(TAG: string, ...restOfMessages: string[]) {
        console.log(`[${TAG.toUpperCase()}] ${restOfMessages.join(" ")}`);
    }
}
