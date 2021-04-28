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

    /** 穿戴服装数据 */
    private clothing: Array<number>;

    /** 角色对象 */
    private Role: Role = null;

    private nowGender: number = 1;
    private bgID: number = 1;

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

    /** 初始化数据 */
    private initData() {


    }

    /** 初始化 */
    private init() {
        this.clothing = [ 0, 1, 2, 3 ];
        RoleManager.getInstance().createRole( this.role_root, this.nowGender, this.clothing );
    }

    /** 显示当前穿着的衣服 */
    private showFashion() {
        let tableData = FashionShopDataManager.getInstance().getDataById( this.clothing[ 0 ] );
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
        let pictrue = this.img_bg.drawToCanvas( this.img_bg.width, this.img_bg.height, 235, 10 );
        let dataUrl = pictrue.toBase64( "image/png", 0.9 );
        let img = document.createElement( 'img' );
        img.src = dataUrl;
        let href = dataUrl.replace( /^data:image[^;]*/, "data:image/octet-stream" );
        let a = document.createElement( 'a' );
        a.href = href;
        a.download =
            'img' +
            this.nowGender + '_' +
            this.bgID + '_' +
            this.clothing[ 0 ] + '_' +
            this.clothing[ 1 ] + '_' +
            this.clothing[ 2 ] + '_' +
            this.clothing[ 3 ] + '.png'
        a.click();
        a.remove();
    }











}