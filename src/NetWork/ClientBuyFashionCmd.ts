import { CHTTP } from "../coffee_bean/net/CHTTP";
import Common from "../coffee_bean/utils/Common";
import { PlayerData } from "../Data/PlayerData";
import { ClientBaseCmd, ClientBaseData } from "./ClientBaseCmd";

/**
 * http接口---购买时装
 * @ author:XiangHui
 * @ date: 2020-09-15 19:36
 */
export class ClientBuyFashionCmd extends ClientBaseCmd {

    constructor () {
        super();
        this.urlLast = '/library/buy-clothing';
    }

    /** 写入地址 */
    private writeUrl(): string {
        return super.sendUrl();
    }

    /**
     * 发送服务器，购买时装
     * @param relationID 时装ID
     * @param buyType 能量:1,积分:2
     * @param func 回调函数
     */
    public sendMsg( relationID: number, buyType: number, func: ( msgData: BuyAdornData ) => void ) {
        let obj: any = {
            userID: PlayerData.userID,
            userKey: PlayerData.userKey,
            relationID: relationID,
            buyType: buyType,
        };
        let data = Common.formatData( obj );

        CHTTP.Post( this.writeUrl(), data, true, ( isSuccess, msg ) => {
            let rData = this.readMsg( msg );
            if ( rData.result ) {
                func( rData.data );
            } else {
                this.erroTips( rData.errorMsg );
            }
        } );
    }

    /** 读取数据 */
    private readMsg( msg: any ): ClientBuyFashionData {
        let readData = msg as ClientBuyFashionData;
        return readData;
    }
}

/** 接收服务器数据 */
export class ClientBuyFashionData extends ClientBaseData {

    /**返回数据 */
    public data: BuyAdornData;
}

/** 购买家具/时装，返回的数据对象 */
export class BuyAdornData {

    /** 1:购买成功 2：能量不够 */
    public type: number;

    //用户积分
    public userCredit: number;

    /** 需要积分 */
    public needCredit: number;

    /** 是否可以积分购买 */
    public buy: boolean;

    /** 总能量(毫克) */
    public remainEnergy: number;

    /** 舒适度 */
    public roomExperience: number;

}