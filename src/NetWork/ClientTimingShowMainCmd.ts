import { PlayerData } from "../Data/PlayerData";
import { CHTTP } from "../coffee_bean/net/CHTTP";
import { ClientBaseCmd, ClientBaseData } from "./ClientBaseCmd";
import CLOG from "../coffee_bean/utils/CLOG";
import Common from "../coffee_bean/utils/Common";
import { TimingInterface } from "../Interface/TimingInterface";
import { SettingData } from "src/Data/SettingData";

/**
 * http接口---进入TimingShow主页
 * @ author:XiangHui
 * @ date: 2020-12-22 15:09
 */
export class ClientTimingShowMainCmd extends ClientBaseCmd {

    constructor () {
        super();
        this.urlLast = '/library/timing-show-clothing';
    }

    /** 写入地址 */
    private writeUrl(): string {
        return super.sendUrl();
    }

    /** 发送服务器，登录TimingShow个人设置页 */
    public async sendMsg(): Promise<void> {
        let obj: any = {
            userID: PlayerData.userID,
            userKey: PlayerData.userKey,
        };
        let data = Common.formatData( obj );

        return new Promise<void>( ( resolve, reject ) => {
            CLOG.I( "游戏登录!" );
            CHTTP.Post( this.writeUrl(), data, false, ( isSuccess, msg ) => {
                let rData = this.readMsg( msg );
                if ( rData.result ) {
                    PlayerData.localCache( rData.data );
                    SettingData.isloadingSend = false;
                    resolve();
                }
                else {
                    this.erroTips( rData.errorMsg, 8, ( isok ) => { TimingInterface.getInstance().backToApp() } );
                    reject();
                }
            } );
        } )
    }

    /** 读取数据 */
    private readMsg( msg: any ): ClientTimingShowData {
        let readData = msg as ClientTimingShowData;
        return readData;
    }

}

/** 接收服务器数据 */
class ClientTimingShowData extends ClientBaseData {

    /** 接收数据 */
    public data: TimingShowData;

}

/** TimingShow主页数据 */
export class TimingShowData {

    /** 穿戴服装数据 */
    public clothing: Array<ClothingData>;

    /** 折扣数据 */
    public disCountInfo: DisCountInfo;

    /** 用户数据 */
    public userInfo: userInfo;

    /** 新上架服装列表 */
    public newClothing: Array<number>;
}

/** 穿戴服装数据 */
export class ClothingData {

    /** 拥有列表 */
    public owned: Array<number>;

    /** 服装ID */
    public inUse: number;

    /** 部位ID */
    public type: number;
}

/** 用户数据 */
export class userInfo {

    /** 舒适度 */
    public roomExperience: number;

    /** 总能量 */
    public remainEnergy: number;
    public isShow: boolean;

    /** 性别（1:男 2:女） */
    public gender: number;

    public isGuide: boolean;
}

/** 折扣数据 */
export class DisCountInfo {
    public disCount: number;
    public endTime: number;
}

