import { CHTTP } from "../coffee_bean/net/CHTTP";
import Common from "../coffee_bean/utils/Common";
import { PlayerData } from "../Data/PlayerData";
import { ClientBaseCmd, ClientBaseData } from "./ClientBaseCmd";

/**
 * 获取我购买的服装列表
 * @ author:XiangHui
 * @ date: 2021-01-08 15:13
 */
export default class ClientMyClothingCmd extends ClientBaseCmd {

    constructor () {
        super();
        this.urlLast = '/library/my-clothing';
    }

    /** 写入地址 */
    private writeUrl(): string {
        return super.sendUrl();
    }

    /**
     * 发送服务器,获取我的服装
     * @param func 回调
     */
    public sendMsg( func: ( msgData: Array<number> ) => void ) {
        let obj: any = {
            userID: PlayerData.userID,
            userKey: PlayerData.userKey,
        };
        let data = Common.formatData( obj );

        CHTTP.Post( this.writeUrl(), data, false, ( isSuccess, msg ) => {
            let rData = this.readMsg( msg );
            if ( rData.result ) {
                func( rData.data.list );
            }
            else {
                this.erroTips( rData.errorMsg );
            }
        } );
    }

    /** 读取数据 */
    private readMsg( msg: any ): ClientMyClothingData {
        let readData = msg as ClientMyClothingData;
        return readData;
    }

}

/** 我的购买服装列表 */
class ClientMyClothingData extends ClientBaseData {

    /** 返回数据 */
    public data: {

        /** 服装列表 */
        list: Array<number>;

    }


}