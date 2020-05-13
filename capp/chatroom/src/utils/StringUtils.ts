/**
 * 字符串处理的一些常用工具集
 * @author dodo
 * @date 2020.05.13
 */

export default class StringUtils {
    /**
     * 将 s 编码成 base64 字符串
     */
    public static encodeToBase64(s: string): string {
        return btoa(encodeURIComponent(s));
    }

    /**
     * 将 base64 字符串解码
     */
    public static decodeFromBase64(strBase64: string): string {
        try {
            return decodeURIComponent(atob(strBase64));
        } catch {
            return strBase64;
        }
    }
}
