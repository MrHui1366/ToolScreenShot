import Common from "src/coffee_bean/utils/Common";
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

    /** 头发列表 */
    private hairList: FashionShopTableData[];

    /** 衣服列表 */
    private clothesList: FashionShopTableData[];

    /** 鞋子列表 */
    private shoesList: FashionShopTableData[];

    /** 表情列表 */
    private faceList: FashionShopTableData[];

    /** 头发下标 */
    private hariIndex: number = 0;

    /** 衣服下标 */
    private clothesIndex: number = 0;

    /** 鞋子下标 */
    private shoesIndex: number = 0;

    /** 表情下标 */
    private faceIndex: number = 0;

    /** 穿戴服装数据 */
    private clothing: Array<number>;

    /** 角色对象 */
    private Role: Role = null;

    /** 当前性别 */
    private nowGender: number = 1;

    /** 当前背景ID */
    private bgID: number = 1;

    private BgNumCount = 10;

    private skinNumCount = 8;


    constructor () {
        super();
    }

    onEnable() {
        this.initData();
        this.btn_start.on( Laya.Event.CLICK, this, this.startBtn );
        this.btn_stop.on( Laya.Event.CLICK, this, this.stopBtn );
    }

    onOpened() {
        this.init();
    }

    /** 初始化数据 */
    private initData() {
        this.hairList = [];
        this.clothesList = [];
        this.shoesList = [];
        this.faceList = [];
        let tableData = FashionShopDataManager.getInstance().getListByGender( this.nowGender );
        this.hairList = eleectPar( 0, tableData );
        this.clothesList = eleectPar( 1, tableData );
        this.shoesList = eleectPar( 2, tableData );
        this.faceList = eleectPar( 3, tableData );
        function eleectPar( index: number, data: FashionShopTableData[] ) {
            let list: FashionShopTableData[] = new Array();
            for ( let i = 0; i < data.length; i++ ) {
                if ( data[ i ].type == index ) list.push( data[ i ] );
            }
            return list;
        }
    }

    /** 初始化 */
    private init() {
        let hariID = this.hairList[ this.hariIndex ].id;
        let clothesID = this.clothesList[ this.clothesIndex ].id;
        let shoesID = this.shoesList[ this.shoesIndex ].id;
        let faceID = this.faceList[ this.faceIndex ].id;
        this.clothing = [ hariID, clothesID, shoesID, faceID ];
        this.Role = RoleManager.getInstance().createRole( this.role_root, this.nowGender, this.clothing );
        this.showFashion();
    }

    /** 显示当前穿着的衣服 */
    private showFashion() {
        let _gender: string = this.nowGender == 1 ? 'M' : 'W';
        this.img_hair.skin = 'FashionShop/img_hair_' + _gender + this.hairList[ this.hariIndex ].level + '.png';
        this.img_clothes.skin = 'FashionShop/img_clothes_' + _gender + this.clothesList[ this.clothesIndex ].level + '.png';
        this.img_shoes.skin = 'FashionShop/img_shoe_' + _gender + this.shoesList[ this.shoesIndex ].level + '.png';
        this.img_face.skin = 'FashionShop/img_face_' + _gender + this.faceList[ this.faceIndex ].level + '.png';
    }

    /** 换装 */
    private changeFashion() {
        let data: any = [];
        this.Role.changePartSkin( data );
    }

    /** 开始 */
    private startBtn() {
        Common.btn_Protect( this.btn_start );
        Laya.timer.loop( 200, this, this.startFunc )
    }

    /** 开始执行 */
    private startFunc() {
        this.screenShot();

        // if ( this.nowGender == 1 ) {
        //     if (
        //         this.hariIndex == this.skinNumCount &&
        //         this.clothesIndex == this.skinNumCount &&
        //         this.shoesIndex == this.skinNumCount &&
        //         this.faceIndex == this.skinNumCount && this.bgID == this.BgNumCount ) {


        //     }


        // } else {


        // }




    }

    /** 停止 */
    private stopBtn() {
        Common.btn_Protect( this.btn_stop );
        Laya.timer.clear( this, this.startFunc );
    }

    /** 截图 */
    private screenShot() {
        let pictrue = this.img_bg.drawToCanvas( this.img_bg.width, this.img_bg.height, this.img_bg.x, this.img_bg.y );
        let dataUrl = pictrue.toBase64( "image/png", 0.9 );
        // let img = document.createElement( 'img' );
        // img.src = dataUrl;
        // let href = dataUrl.replace( /^data:image[^;]*/, "data:image/octet-stream" );
        // let a = document.createElement( 'a' );
        // a.href = href;
        // a.download =
        //     'img' +
        //     this.nowGender + '_' +
        //     this.bgID + '_' +
        //     this.clothing[ 0 ] + '_' +
        //     this.clothing[ 1 ] + '_' +
        //     this.clothing[ 2 ] + '_' +
        //     this.clothing[ 3 ] + '.png'
        // a.click();
        // a.remove();


        // var href = dataUrl.replace( /^data:image[^;]*/, "data:image/octet-stream" );
        // document.location.href = href;

        // var a = document.createElement( 'a' ); // 创建一个a节点插入的document
        // a.href = dataUrl;
        // a.download = 'asd.png';
        // a.click();
        // a.remove();

        // function savePicture() {
        //     // 创建下载任务
        //     picurl = 'asd.png';
        //     //图片保存到手机后的路径
        let picname = "_downloads/erwei.png";
        var dtask = Laya.Browser.window.plus.downloader.createDownload( dataUrl, {}, function ( d, status ) {
            // 下载完成
            if ( status == 200 ) {
                Laya.Browser.window.plus.gallery.save( picname, function () {
                    //保存到相册方法

                }, function () {

                } );
            } else {
                console.log( '保存失败!' );
            }
        } );
        // dtask.addEventListener( "statechanged", onStateChanged, false );
        dtask.start();//开始下载

    }











}