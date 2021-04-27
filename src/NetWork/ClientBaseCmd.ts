import { SettingData } from './../Data/SettingData';
import CSingleton from '../coffee_bean/core/CSingleton';
import { ConstantDataManager } from '../Data/TableData/ConstantTableData';
import { E_ServerType } from '../coffee_bean/core/CEnum';
import { ErrorDataManager } from '../Data/TableData/ErrorTableData';
import PopUp from '../View/dialog/PopUp';

/** 客户端http服务端交互协议--基类 */
export class ClientBaseCmd extends CSingleton {

    /**服务器接口地址前缀 */
    private _urlFirst: string = "";

    /**服务器接口地址后缀 */
    private _urlLast: string = "";

    /**设置接口后缀 */
    public set urlLast( url: string ) { this._urlLast = url; }

    constructor () {
        super();
        this.init();
    }

    /**初始化 */
    private init() {
        let tips: number = SettingData.serverType == E_ServerType.E_TEST ? E_ServerType.E_TEST : E_ServerType.E_PROD;
        this._urlFirst = ConstantDataManager.getInstance().getDataById( tips ).content;
    }

    /**发送的url */
    public sendUrl(): string {
        return this._urlFirst + this._urlLast;
    }

    /**
     * 异常弹窗提示
     * @param errorMsg 提示语 
     * @param index  异常按键ID
     * @param func 弹窗确定回调
     */
    public erroTips( errorMsg: string, index = 8, func?: ( boolean ) => void ) {
        let ErrorData = ErrorDataManager.getInstance().getDataById( index );
        PopUp.showUI( errorMsg, ErrorData.btn1, null, func );
    }

}

/*接收服务器数据---基类 */
export class ClientBaseData {

    /**通讯结果 */
    public result: boolean;

    /**错误代码 */
    public errorCode: number;

    /**报错信息 */
    public errorMsg: string;

}