import { E_ServerType } from "../coffee_bean/core/CEnum";

/**基础数据设置 */
export class SettingData {

    /** 版本号 */
    public static versionsID: string = 'Test_v1.0';

    /** 服务器 */
    public static serverType: E_ServerType = E_ServerType.E_TEST;

    /** android客户端版本号 */
    public static androidVs: number;

    /** ios客户端版本号 */
    public static iosVs: number;

    /** 配刘海屏的高度 */
    public static screenHeight: number = 55;

    /** 是否是登录时的http消息 */
    public static isloadingSend: boolean = false;

}