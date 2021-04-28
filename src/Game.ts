import CLOG, { clog } from "./coffee_bean/utils/CLOG";
import { CRes, ResInfo } from './coffee_bean/utils/CRes';
import CMsg from './coffee_bean/utils/CMsg';
import { TableDataManager } from "./Data/TableData/TableDataManager";
import { E_MsgType, E_ServerType } from './coffee_bean/core/CEnum';
import CTime from './coffee_bean/utils/CTime';
import CSceneManager from './Scene/CSceneManager';
import { E_UI } from './Scene/CSceneUrl';

/** vConsole控制台定义 */
declare class VConsole { }

/** 游戏控制类*/
export default class Game {

    /** 加载起始时间戳 */
    private static loadTimeStamp = 0;

    /** 开始游戏 */
    public static start(): void {

        CLOG.enable();
        var vConsole = new VConsole();
        this.loadTimeStamp = CTime.getNowTimeStamp( false );
        clog.e( '开始加载!' );

        //加载第一阶段合并文件
        CRes.cPreload( [
            { url: "preLoad/pre_loading.json", type: "plf", cache: true }
        ], Laya.Handler.create( this, this.preloadResOne ), null );
    }

    /**第一阶段加载资源 */
    private static preloadResOne(): void {
        //预先加载loading界面资源, 通讯配置表 / 常量表 / 报错表
        let resAry = new Array<ResInfo>();
        resAry.push( { url: "res/atlas/ui_loading.atlas", type: Laya.Loader.ATLAS, cache: false } );
        resAry.push( { url: "ViewFile/Loading.json", type: Laya.Loader.JSON, cache: false } );
        let completeHandler = Laya.Handler.create( this, this.loadingStart );
        CRes.cPreload( resAry, completeHandler, null );
    }

    /**进入loading界面 */
    private static loadingStart(): void {

        //本地测试
        CSceneManager.open( E_UI.E_LODING, true, null, Laya.Handler.create( this, this.onLoadingSceneComplete ) );
    }

    /** 加载Loading场景完成 */
    private static async onLoadingSceneComplete(): Promise<void> {
        //关闭多点触控
        Laya.MouseManager.multiTouchEnabled = false;

        //加载第二阶段合并文件
        CRes.cPreload( [
            { url: "preLoad/pre_AllRes.json", type: "plf", cache: true }
        ], Laya.Handler.create( this, this.preloadResTwo ), null );
    }

    /** 第二段预加载游戏资源*/
    private static preloadResTwo(): void {
        let resAry = new Array<ResInfo>();
        let spineArr: Array<string> = [
            "SpineRes/Role/man/part_braid_1",
            "SpineRes/Role/man/part_hair_1",
            "SpineRes/Role/man/part_face_1",
            "SpineRes/Role/man/part_clothes_1",
            "SpineRes/Role/man/part_paintz_1",
            "SpineRes/Role/man/part_painty_1",
            "SpineRes/Role/man/part_shoez_1",
            "SpineRes/Role/man/part_shoey_1",
            "SpineRes/Role/man/part_tuiz_1",
            "SpineRes/Role/man/part_tuiy_1",
            "SpineRes/Role/woman/part_braid_2",
            "SpineRes/Role/woman/part_hair_2",
            "SpineRes/Role/woman/part_face_2",
            "SpineRes/Role/woman/part_clothes_2",
            "SpineRes/Role/woman/part_paintz_2",
            "SpineRes/Role/woman/part_painty_2",
            "SpineRes/Role/woman/part_shoez_2",
            "SpineRes/Role/woman/part_shoey_2",
            "SpineRes/Role/woman/part_tuiz_2",
            "SpineRes/Role/woman/part_tuiy_2"
        ];
        for ( let item of spineArr ) {
            resAry.push( { url: item + ".png", type: Laya.Loader.IMAGE, cache: true } );
        }

        /**配置表 */
        resAry.push( { url: "JsonConfig/fashionShopConfig.json", type: Laya.Loader.JSON, cache: true } );
        /** 预制体 */
        resAry.push( { url: "PrefabFile/Role.json", type: Laya.Loader.JSON, cache: true } );
        //加载zip
        resAry.push( { url: "SpineRes/Role.zip", type: Laya.Loader.BUFFER } );
        // 普通图集
        resAry.push( { url: "res/atlas/Bg.atlas", type: Laya.Loader.ATLAS, cache: true } );
        resAry.push( { url: "res/atlas/ui_Fashion.atlas", type: Laya.Loader.ATLAS, cache: true } );
        resAry.push( { url: "res/atlas/FashionShop.atlas", type: Laya.Loader.ATLAS, cache: true } );
        // View
        resAry.push( { url: "ViewFile/ScreenShotUI.json", type: Laya.Loader.JSON, cache: true } );
        let completeHandler = Laya.Handler.create( this, this.preloadComplete );
        let progressHandler = Laya.Handler.create( this, this.preloadProgress, null, false );
        CRes.cPreload( resAry, completeHandler, progressHandler );
    }

    /** 预加载进度 */
    private static preloadProgress( progress: number ): void {
        CMsg.eventEmit( E_MsgType.E_Loading, progress );
    }

    /** 预加载完成 */
    private static async preloadComplete() {
        await this.unZipRoleRes();
        //缓存第二阶段js表
        TableDataManager.readTwoTable();
        let loadTime = CTime.getNowTimeStamp( false ) - this.loadTimeStamp;
        clog.e( '加载完毕! 耗时:' + loadTime + '秒' );
        Laya.timer.once( 1200, this, () => { CSceneManager.openScreenShot(); } )
    }

    /** 解压zip角色资源 */
    private static async unZipRoleRes(): Promise<void> {
        return new Promise<void>( ( resolve, reject ) => {
            const cZip = new JSZip();
            let zipRes = Laya.loader.getRes( 'SpineRes/Role.zip' );
            let completeNum = 0;
            cZip.loadAsync( zipRes ).then( ( data: any ) => {
                let resObj = data.files as Object;
                for ( let file in resObj ) {
                    if ( file == 'Role/' || file == 'Role/man/' || file == 'Role/woman/' ) {
                        console.log( '排除!!!' );
                    } else {
                        let exclude = file.split( "," )[ 1 ];
                        if ( exclude != 'atlas' ) {
                            data.file( file ).async( 'text' ).then( ( content: string ) => {
                                let saveUrl = 'SpineRes/' + file;
                                completeNum++;
                                Laya.loader.cacheRes( saveUrl, content );
                                if ( completeNum >= 32 ) resolve();
                            } );
                        }
                    }
                }
            } )
        } );
    }

}