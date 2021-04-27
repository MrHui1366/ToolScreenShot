import { FashionShopDataManager, FashionShopTableData } from "../Data/TableData/FashionShopTableData";
import CLOG from "src/coffee_bean/utils/CLOG";
import { PlayerData } from "src/Data/PlayerData";

/** 角色动画名枚举 */
enum E_RoleAniName {

    /** 站立待机 */
    stayId = 'part_stand_stay',

    /** 站立挠头 */
    touchId = 'part_touch_stay',
}

/** 角色spine层级 */
const roleZoderArr = [ 101, 102, 103, 104, 105, 106, 107, 108, 109, 110 ];

/**
 * 角色对象
 * @ author:XiangHui
 * @ date: 2020-12-26 14:04
 */
export default class Role extends Laya.Script {

    /**脚本所属节点 */
    private _owner: Laya.Sprite;

    /** 
     * 模板数组
     * [辫子,腿左,鞋子左,裤子左,腿右,鞋子右,裤子右,衣服,脸,头发]
     */
    private mF_parts: Array<Laya.SpineTemplet>;

    /**
     * spine数组
     * [辫子,腿左,鞋子左,裤子左,腿右,鞋子右,裤子右,衣服,脸,头发]
     */
    private sk_parts: Array<Laya.SpineSkeleton>;

    /** 是否可以点击 */
    private isClick: boolean = true;

    /** 部位加载完成数量 */
    private loadCompleteNum: number = 0;

    constructor () {
        super();
    }

    onEnable() {
        this._owner = this.owner as Laya.Sprite;
        this._owner.on( Laya.Event.CLICK, this, this.click_ShopRole );
    }

    /**
     * 创建角色
     * @param gender 性别(1:男 2:女)
     */
    public createRoleSpine( gender: number ) {
        this.mF_parts = [];
        this.sk_parts = [];
        let pathArr = this.getRolePath( gender );
        for ( let i = 0; i < roleZoderArr.length; i++ ) {
            let mF = new Laya.SpineTemplet();
            mF.on( Laya.Event.COMPLETE, this, this.loadPart, [ i ] );
            mF.loadAni( pathArr[ i ] );
            this.mF_parts.push( mF );
        }
    }

    /**
     * 单个部位模板加载完毕
     * @param index 部位索引
     */
    private loadPart( index: number ) {
        let sk_part = this.mF_parts[ index ].buildArmature();
        this.sk_parts.push( sk_part );
        this._owner.addChild( sk_part );
        sk_part.zOrder = roleZoderArr[ index ];
        let skinName = this.getPartSkinName( index );
        sk_part.showSkinByName( skinName );
        this.loadCompleteNum++;
        if ( this.loadCompleteNum == roleZoderArr.length ) {
            this.startPlayPartAni( E_RoleAniName.stayId, true );
        }
    }

    /** 
     * 开始播放角色所有部位动作
     * @param  aniName 动画名称
     * @param  isLoop 是否循环
     * @param  callBack 播放完毕回调(可选)
     */
    private startPlayPartAni( aniName: string, isLoop: boolean, callBack?: () => void ) {
        //部位全部加载完毕开始播放动画
        for ( let i = 0; i < this.sk_parts.length; i++ ) {
            let sk_part = this.sk_parts[ i ];
            sk_part.play( aniName, isLoop );
        }
        for ( let i = 0; i < this.sk_parts.length; i++ ) {
            let sk_part = this.sk_parts[ i ];
            sk_part.stop();
        }
    }

    /** 
     * 获取角色部位的皮肤名称
     * @param partIndex 部件索引
     */
    private getPartSkinName( partIndex: number ): string {
        let skinIndex: number;
        switch ( partIndex ) {
            case 0:
                skinIndex = 0;
                break;
            case 1:
                skinIndex = 0;
                break;
            case 2://鞋子
                skinIndex = 2;
                break;
            case 3:
                skinIndex = 1;
                break;
            case 4:
                skinIndex = 0;
                break;
            case 5:
                skinIndex = 2;
                break;
            case 6://衣服
                skinIndex = 1;
                break;
            case 7:
                skinIndex = 1;
                break;
            case 8:
                skinIndex = 3;
                break;
            case 9:
                skinIndex = 0;
                break;
        }
        let nowUseID = PlayerData.clothing[ skinIndex ];
        let nowTableData = FashionShopDataManager.getInstance().getDataById( nowUseID );
        return nowTableData.skinName;
    }

    /** 
     * 获取角色动画名路径
     * @param sex 角色性别(1男2女)
     */
    private getRolePath( sex: number ): Array<string> {
        let path = sex == 1 ? 'SpineRes/Role/man/' : 'SpineRes/Role/woman/';
        let path0 = path + 'part_braid_' + sex + '.json';
        let path1 = path + 'part_tuiz_' + sex + '.json';
        let path2 = path + 'part_shoez_' + sex + '.json';
        let path3 = path + 'part_paintz_' + sex + '.json';
        let path4 = path + 'part_tuiy_' + sex + '.json';
        let path5 = path + 'part_shoey_' + sex + '.json';
        let path6 = path + 'part_painty_' + sex + '.json';
        let path7 = path + 'part_clothes_' + sex + '.json';
        let path8 = path + 'part_face_' + sex + '.json';
        let path9 = path + 'part_hair_' + sex + '.json';
        let pathArr = [ path0, path1, path2, path3, path4, path5, path6, path7, path8, path9 ];
        return pathArr;
    }

    /** 
     * 替换局部时装
     * @param data 时装属性
     */
    public changePartSkin( data: FashionShopTableData ) {
        CLOG.E( '换装----部位：{0},ID：{1},名称：{2},动画名字:{3}', data.type, data.id, data.name, data.skinName );
        switch ( data.type ) {
            case 0://头发
                this.sk_parts[ 0 ].showSkinByName( data.skinName );
                this.sk_parts[ 9 ].showSkinByName( data.skinName );
                break;
            case 1://衣服
                this.sk_parts[ 3 ].showSkinByName( data.skinName );
                this.sk_parts[ 6 ].showSkinByName( data.skinName );
                this.sk_parts[ 7 ].showSkinByName( data.skinName );
                break;
            case 2://鞋子
                this.sk_parts[ 2 ].showSkinByName( data.skinName );
                this.sk_parts[ 5 ].showSkinByName( data.skinName );
                break;
            case 3://表情
                this.sk_parts[ 8 ].showSkinByName( data.skinName );
                break;
            default:
                console.log( data.type + ',changePartskin is error!' );
                break;
        }
    }

    /** 点击事件--商店中的角色 */
    private click_ShopRole() {
        if ( this.isClick ) {
            this.isClick = false;
            let touchAniNames = E_RoleAniName.touchId;
            this.startPlayPartAni( touchAniNames, false, () => {
                this.startPlayPartAni( E_RoleAniName.stayId, true );
                this.isClick = true;
            } );
        }
    }

    /** 销毁当前角色 */
    public DestroyAni() {
        this._owner.removeSelf();
        this.recycle();
    }

    /** 回收 */
    private recycle() {
        this.sk_parts[ 7 ].offAll();
        for ( let obj of this.sk_parts ) { obj.stop(); }
        Laya.Pool.recover( 'Role', this._owner );
    }

}