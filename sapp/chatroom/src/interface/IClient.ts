/**
 * 网关 Client 接口定义
 * @author dodo
 * @date 2020.04.30
 */

export default interface IClient {
    /// 发送 Buffer
    sendBuffer(buf: Buffer): void;

    /// 发送 String
    sendString(s: string): void;

    /// 应用测试的 ping/pong 接口
    ping(): void;
    pong(): void;

    /// 客户端标识 Id
    clientId: string;
}
