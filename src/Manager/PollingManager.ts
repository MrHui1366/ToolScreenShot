import { E_MsgType } from "../coffee_bean/core/CEnum";
import CSingleton from "../coffee_bean/core/CSingleton";
import CLOG, { clog } from "../coffee_bean/utils/CLOG";
import CMsg from "../coffee_bean/utils/CMsg";
import CTime from "../coffee_bean/utils/CTime";
import { CSceneUrl, E_UI } from "../Scene/CSceneUrl";

/**
 * 游戏轮询控制器管理类
 * @ author:XiangHui
 * @ date: 2020-12-04 10:20
 */
export default class PollingManager extends CSingleton {

    /** 轮询间隔(秒) */
    private spacing: number = 60;

    /** 房间主人/农场主人 */
    private userID: number;

    /** 轮询的场景 */
    private poolScene: CSceneUrl;

    /** 轮询时间戳(秒) */
    private pollTime: number = 0;

    constructor () {
        super();
        // this.onPoll();
    }

    /** 计时器监听 */
    private onPoll() {
        Laya.stage.on( Laya.Event.BLUR, this, () => {
            clog.e( '清除轮询!' );
            this.clearPoll();
        } );
        Laya.stage.on( Laya.Event.VISIBILITY_CHANGE, this, () => {
            clog.e( '重置轮询!' );
            this.pollTime = CTime.getNowTimeStamp( false ) + this.spacing;
            this.startPoll();
        } );
    }

    //开启轮询
    public startPoll() {
        clog.e( '开启轮询!' );
        Laya.timer.loop( 1000, this, this.poolFunc );
    }

    //清除轮询
    public clearPoll() {
        Laya.timer.clear( this, this.poolFunc );
    }

    /** 轮询事件执行器 */
    private poolFunc() {
        // switch ( this.poolScene.name ) {
        //     case E_UI.E_TOWN.name:
        //         this.pollRun( this.updateTown.bind( this ) );
        //     case E_UI.E_ROOM.name:
        //         this.pollRun( this.updateRoom.bind( this ) );
        //     case E_UI.E_FARM.name:
        //         this.pollRun( this.updateFarm.bind( this ) );
        //         break;
        // }
    }

    /**
     * 执行更新
     * @param func 更新事件
     */
    private pollRun( func: () => void ) {
        let nowStamp = CTime.getNowTimeStamp( false );
        if ( nowStamp == this.pollTime ) {
            this.pollTime = nowStamp + this.spacing;
            func();
        } else {
            ( nowStamp > this.pollTime ) && ( this.pollTime = nowStamp + this.spacing );
        }
    }

    /**
     * 轮询准备
     * @param sceneName 轮询场景
     * @param userID 房间主人/农场主人
     */
    public restPool( sceneName: CSceneUrl, userID = 0 ) {
        this.poolScene = sceneName;
        this.userID = userID;
        this.pollTime = CTime.getNowTimeStamp( false ) + this.spacing;
    }

    //更新小镇
    private updateTown() {
        // ClientTownCmd.getInstance().sendMsg( ( msgData: TownData ) => {
        //     clog.e( '更新小镇!' );
        //     CMsg.eventEmit( E_MsgType.E_UpdateTown, msgData );
        // } );
    }




}