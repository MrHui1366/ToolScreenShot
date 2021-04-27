import { CobjPos } from "src/coffee_bean/core/CData";
import { PlayerData } from "src/Data/PlayerData";
import { FashionShopDataManager, FashionShopTableData } from "src/Data/TableData/FashionShopTableData";
import RoleManager from "src/Manager/RoleManager";
import Role from "src/Prefab/Role";
import { ui } from "src/ui/layaMaxUI";

/**
 * 换装截图工具
 * @ author:XiangHui
 * @ date: 2021-04-27 19:34
 */
export default class ScreenShotUI extends ui.ViewFile.ScreenShotUIUI {

    /** List数据源 */
    private listAtt: FashionShopTableData[];

    private manList: FashionShopTableData[];

    private womanList: FashionShopTableData[];

    /** 角色对象 */
    private Role: Role = null;

    private nowGender: number = 1;

    constructor () {
        super();
    }

    onEnable() {
        this.manList = FashionShopDataManager.getInstance().getListByGender( 1 );
        this.womanList = FashionShopDataManager.getInstance().getListByGender( 2 );
        this.btn_start.on( Laya.Event.CLICK, this, this.startBtn );
        this.btn_stop.on( Laya.Event.CLICK, this, this.stopBtn );
    }

    onOpened() {
        this.init();
    }

    /** 初始化 */
    private init() {
        PlayerData.clothing = [ 0, 1, 2, 3 ];
        let pos = { x: this.role_root.width / 2, y: this.role_root.height };
        RoleManager.getInstance().createRole( this.role_root, pos, this.nowGender );


    }

    /** 显示当前穿着的衣服 */
    private showFashion() {
        let tableData = FashionShopDataManager.getInstance().getDataById( PlayerData.clothing[ 0 ] );
        this.img_hair.skin = '';
        this.img_clothes.skin = '';
        this.img_shoes.skin = '';
        this.img_face.skin = '';

    }

    /** 换装 */
    private changeFashion() {


    }

    /** 开始 */
    private startBtn() {
        console.log( '点击了开始!!!' );
        this.screenShot();

    }

    /** 停止 */
    private stopBtn() {
        console.log( '点击了停止!!!' );

    }

    /** 截图 */
    private screenShot() {
        let pictrue = this.role_root.drawToCanvas( this.role_root.width, this.role_root.height, 0, 0 );
        let dataUrl = pictrue.toBase64( "image/png", 0.9 );
        let img = document.createElement( 'img' );
        img.src = dataUrl;
        let href = dataUrl.replace( /^data:image[^;]*/, "data:image/octet-stream" );
        let a = document.createElement( 'a' );
        a.href = href;
        a.download =
            'img' +
            PlayerData.clothing[ 0 ] + '_' +
            PlayerData.clothing[ 1 ] + '_' +
            PlayerData.clothing[ 2 ] + '_' +
            PlayerData.clothing[ 3 ] + '.png'
        a.click();
        a.remove();
    }











}