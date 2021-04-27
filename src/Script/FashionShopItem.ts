import CLOG from "src/coffee_bean/utils/CLOG";
import { E_FashionTypePath, E_MsgType } from "../coffee_bean/core/CEnum";
import CMsg from "../coffee_bean/utils/CMsg";
import { PlayerData } from "../Data/PlayerData";
import { FashionShopDataManager, FashionShopTableData } from "../Data/TableData/FashionShopTableData";

/**
 * 时装商店单项item控制脚本
 * @ author:XiangHui
 * @ date: 2020-09-23 16:14
 */
export default class FashionShopItem extends Laya.Script {

    /** 装饰物背景 */
    private img_AdornBg: Laya.Image;

    /** 装饰物 */
    private img_Adorn: Laya.Image;

    /** 使用中图标 */
    private img_InUse: Laya.Image;

    /** 已拥有 */
    private img_has: Laya.Image;

    /** 能量图标 */
    private img_icon: Laya.Image;

    /** 单价 */
    private txt_price: Laya.Label;

    /** 装饰物属性 */
    private data: FashionShopTableData = null;

    /** 是否拥有 */
    private ishas: boolean;

    /** 是否穿戴 */
    private isPutOn: boolean;

    /** 折扣图片 */
    private img_discount: Laya.Image;

    /** 折扣文本 */
    private txt_discount: Laya.Text;

    constructor () {
        super();
    }

    onEnable() {
        this.img_AdornBg = this.owner.getChildByName( 'img_AdornBg' ) as Laya.Image;
        this.img_Adorn = this.img_AdornBg.getChildByName( 'img_Adorn' ) as Laya.Image;
        this.img_InUse = this.owner.getChildByName( 'img_InUse' ) as Laya.Image;
        this.img_has = this.owner.getChildByName( 'img_has' ) as Laya.Image;
        this.img_icon = this.owner.getChildByName( 'img_icon' ) as Laya.Image;
        this.txt_price = this.owner.getChildByName( 'txt_price' ) as Laya.Label;
        this.img_discount = this.owner.getChildByName( 'img_discount' ) as Laya.Image;
        this.txt_discount = this.img_discount.getChildByName( 'txt_discount' ) as Laya.Text;
        this.img_Adorn.on( Laya.Event.CLICK, this, this.onClickFunc );
    }

    /**
     * 初始化
     * @param data 家具属性
     */
    public setData( data: FashionShopTableData ) {
        if ( !data ) return;
        this.data = data;
        let _gender: string = PlayerData.userInfo.gender == 1 ? 'M' : 'W';
        let typePath: string;
        switch ( data.type ) {
            case 0:
                typePath = E_FashionTypePath.E_Fashion_Hair;
                break;
            case 1:
                typePath = E_FashionTypePath.E_Fashion_Clothes;
                break;
            case 2:
                typePath = E_FashionTypePath.E_Fashion_Shoe;
                break;
            case 3:
                typePath = E_FashionTypePath.E_Fashion_Face;
                break;
            default:
                console.log( data.type + ':is inexistence!' );
                break;
        }
        this.img_Adorn.skin = typePath + _gender + data.level + '.png';
        //是否已穿戴
        this.isPutOn = this.judgeFunc( 1, data );
        this.img_InUse.visible = this.isPutOn ? true : false;
        //是否已拥有
        this.ishas = this.judgeFunc( 2, data );
        this.img_has.visible = this.ishas ? true : false;
        let disCountInfo = PlayerData.disCountInfo;
        if ( this.ishas ) {
            this.img_icon.visible = false;
            this.txt_price.visible = false;
        } else {
            if ( disCountInfo.disCount == 10 ) {
                this.txt_price.text = data.price + 'g';
            } else {
                this.txt_price.text = data.price * ( disCountInfo.disCount / 10 ) + 'g';
            }
            this.img_icon.visible = true;
            this.txt_price.visible = true;
        }
        //是否有折扣
        this.img_discount.visible = ( !this.ishas && disCountInfo.disCount < 10 ) ? true : false;
        ( this.img_discount.visible ) && ( this.txt_discount.changeText( disCountInfo.disCount + '折' ) );
    }

    /** 
     * 是否佩戴或是否拥有
     * @param type  1:穿戴  2:拥有
     * @param data  装饰物数据
     */
    private judgeFunc( type: number, data: FashionShopTableData ): boolean {
        if ( type == 1 ) {
            let inUse = PlayerData.clothing[ data.type ].inUse == data.id ? true : false;
            return inUse;
        } else {
            let index = PlayerData.clothing[ data.type ].owned.indexOf( data.id );
            return index > -1;
        }
    }

    /** 点击事件 */
    private onClickFunc() {
        //点击选中item
        if ( PlayerData.selectItemId != this.data.id ) {
            let data = FashionShopDataManager.getInstance().getDataById( this.data.id );
            let name: string;
            switch ( data.type ) {
                case 0:
                    name = '头发';
                    break;
                case 1:
                    name = '衣服';
                    break;
                case 2:
                    name = '鞋子';
                    break;
                case 3:
                    name = '表情';
                    break;
                default:
                    break;
            }
            CLOG.E( '选中时装ID:{0},名称:{1},部位:{2}', data.id, data.name, name );
            CMsg.eventEmit( E_MsgType.E_SelectFashionItem, this.data.id );
        }
    }

    onUpdate() {
        if ( this.data ) {
            if ( PlayerData.selectItemId == this.data.id ) {
                this.img_AdornBg.skin = 'ui_Fashion/img_itemPitch.png';
            } else {
                this.img_AdornBg.skin = 'ui_Fashion/img_itemBg.png';
            }
        }
    }

    onDisable() {
        this.data = null;
    }

}