import { ClientBaseCmd, ClientBaseData } from "./ClientBaseCmd";
import { CHTTP } from "../coffee_bean/net/CHTTP";
import Common from "../coffee_bean/utils/Common";
import { PlayerData } from "../Data/PlayerData";

/**
 * http接口---设置Timing秀开关
 * @ author:XiangHui
 * @ date: 2020-12-20 10:29
 */
export class ClientSettingSwitchCmd extends ClientBaseCmd {

    constructor () {
        super();
        this.urlLast = '/library/timing-show';
    }

    /** 写入地址 */
    private writeUrl(): string {
        return super.sendUrl();
    }

    /**
     * 发送服务器,设置Timing秀开关
     */
    public sendMsg( type: number, func: ( isShow: boolean ) => void ) {
        let obj: any = {
            userID: PlayerData.userID,
            userKey: PlayerData.userKey,
            type: type,
        };
        let data = Common.formatData( obj );

        CHTTP.Post( this.writeUrl(), data, false, ( isSuccess, msg ) => {
            let rData = this.readMsg( msg );
            if ( rData.result ) {
                func( rData.data.isShow );
            }
            else {
                this.erroTips( rData.errorMsg );
            }
        } );
    }

    /** 读取数据 */
    private readMsg( msg: any ): ClientSettingSwithData {
        let readData = msg as ClientSettingSwithData;
        return readData;
    }
}

/** TimingShow设置页数据 */
class ClientSettingSwithData extends ClientBaseData {

    /** 返回数据 */
    public data: {

        isShow: boolean;

    }
}