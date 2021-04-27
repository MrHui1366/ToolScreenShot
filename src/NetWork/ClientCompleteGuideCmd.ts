import { CHTTP } from "../coffee_bean/net/CHTTP";
import Common from "../coffee_bean/utils/Common";
import { PlayerData } from "../Data/PlayerData";
import { ClientBaseCmd, ClientBaseData } from "./ClientBaseCmd";

/**
 * 完成Timing秀引导
 * @ author:XiangHui
 * @ date: 2021-04-23 12:19
 */
export default class ClientCompleteGuideCmd extends ClientBaseCmd {

    constructor () {
        super();
        this.urlLast = '/library/complete-guide';
    }

    /** 写入地址 */
    private writeUrl(): string {
        return super.sendUrl();
    }

    /**
     * 发送服务器,完成引导
     * @param func 回调
     */
    public sendMsg( func: () => void ) {
        let obj: any = {
            userID: PlayerData.userID,
            userKey: PlayerData.userKey,
        };
        let data = Common.formatData( obj );

        CHTTP.Post( this.writeUrl(), data, false, ( isSuccess, msg ) => {
            let rData = this.readMsg( msg );
            if ( rData.result ) {
                func();
            }
            else {
                this.erroTips( rData.errorMsg );
            }
        } );
    }

    /** 读取数据 */
    private readMsg( msg: any ): ClientBaseData {
        let readData = msg as ClientBaseData;
        return readData;
    }

}

