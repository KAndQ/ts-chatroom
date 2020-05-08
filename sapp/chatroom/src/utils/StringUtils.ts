/**
 * 字符串的相关处理
 * @author dodo
 * @date 2020.05.08
 */

export default class StringUtils {
    /**
     * name 检查
     */
    public static checkName(name: string): string {
        return name.trim();
    }

    /**
     * password 检查
     */
    public static checkPassword(password: string): string {
        return password.trim();
    }
}
