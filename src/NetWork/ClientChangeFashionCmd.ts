import { CHTTP } from "../coffee_bean/net/CHTTP";
import Common from "../coffee_bean/utils/Common";
import { PlayerData } from "../Data/PlayerData";
import { ClientBaseCmd, ClientBaseData } from "./ClientBaseCmd";

/**
 * http接口---替换时装
 * @ author:XiangHui
 * @ date: 2020-09-15 19:32
 */
export class ClientChangeFashionCmd extends ClientBaseCmd {

    constructor () {
        super();
        this.urlLast = '/library/change-clothing';
    }

    /**写入地址 */
    private writeUrl(): string {
        return super.sendUrl();
    }

    /**
     * 发送服务器，替换时装
     * @param relationID 时装ID
     * @param func 回调函数
     */
    public sendMsg( relationID: number, func: () => void ) {
        let obj: any = {
            userID: PlayerData.userID,
            userKey: PlayerData.userKey,
            relationID: relationID
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



