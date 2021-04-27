import { ui } from "./../../ui/layaMaxUI";
import { CobjPos } from "../../coffee_bean/core/CData";
import { PlayerData } from "../../Data/PlayerData";
import CMsg from "../../coffee_bean/utils/CMsg";
import { E_FashionTypePath, E_MsgType } from "../../coffee_bean/core/CEnum";
import MaskUI from "./../view/MaskUI";
import { TimingInterface } from "../../Interface/TimingInterface";
import { FashionShopTableData } from "../../Data/TableData/FashionShopTableData";
import Common from "../../coffee_bean/utils/Common";
import CTime from "../../coffee_bean/utils/CTime";
import { BuyAdornData, ClientBuyFashionCmd } from "../../NetWork/ClientBuyFashionCmd";
import { ClientChangeFashionCmd } from "../../NetWork/ClientChangeFashionCmd";
import { ConstantDataManager } from "../../Data/TableData/ConstantTableData";
import CSceneManager from "../../Scene/CSceneManager";
import { E_DIALOG } from "../../Scene/CSceneUrl";

/** 购买装饰物,弹窗状态枚举  */
export enum E_AdornBuyTipType {

    /** 购买弹窗 */
    E_Buy,

    /** 消耗积分弹窗 */
    E_ExpendIntegral,

    /** 赚积分弹窗 */
    E_GetIntegral,
}

/**
 * 装饰购买---弹窗二级界面
 */
export default class AdornBuy extends ui.DialogFile.AdornBuyUI {

    /** UI实例 */
    private static _inst: AdornBuy = null;

    /** 回调 */
    private clickCallback: ( boolean ) => void;

    /** 当前界面弹窗状态 */
    private state: E_AdornBuyTipType;

    /** 当前展示的装饰物 */
    private adornData: FashionShopTableData;

    constructor () {
        super();
    }

    onEnable() {
        this.btn_left.on( Laya.Event.CLICK, this, this.onCancelClick );
        this.btn_right.on( Laya.Event.CLICK, this, this.onOkClick );
    }

    /**
     * 显示装饰购买弹窗
     * @param state 弹窗状态
     * @param data 装饰物属性
     * @param callback 回调函数
     */
    public static async showUI( state: E_AdornBuyTipType, data: FashionShopTableData, callback?: ( boolean ) => void ) {
        if ( AdornBuy._inst == null ) {
            AdornBuy._inst = await this.createUI();
            MaskUI.show( () => { AdornBuy._inst.onMaskClck() } );
            AdornBuy._inst.setView( state, data, callback );
        }
    }

    /** 创建UI */
    private static async createUI(): Promise<AdornBuy> {
        return new Promise<AdornBuy>(
            ( resolve, reject ) => {
                let handler = Laya.Handler.create( this, ( scene: AdornBuy ) => {
                    resolve( scene );
                } );
                CSceneManager.openAdornBuy( handler );
            } );
    }

    /**
     * 设置显示
     * @param data 装饰物属性
     * @param callback 回调函数
     */
    public setView( state: E_AdornBuyTipType, data: FashionShopTableData, callback?: ( boolean ) => void ) {
        this.state = state;
        this.adornData = data;
        //显示商店折扣倒计时
        this.showCountdown();
        let isFashionBuy = state == E_AdornBuyTipType.E_Buy ? true : false;
        this.box_info.visible = !isFashionBuy;
        this.box_fashionBuy.visible = isFashionBuy;
        switch ( state ) {
            case E_AdornBuyTipType.E_Buy:
                let _data = data as FashionShopTableData;
                this.showFashionBuy( _data );
                this.btn_left.visible = false;
                this.btn_right.width = 380;
                this.btn_right.right = 83;
                this.btn_right.label = '立即购买';
                this.setBtnLable();
                break;
            case E_AdornBuyTipType.E_ExpendIntegral:
                // '能量不足,是否使用&1积分购买能量'
                this.setHtmlText1();
                this.setHtmlText2();
                let text = Common.makeHtmlStr( "能量不足", '#54423A' );
                let text1 = Common.makeHtmlStr( "是否使用", '#54423A' );
                let text2 = Common.makeHtmlStr( PlayerData.needCredit + "积分", '#A5BE2E' );
                let text3 = Common.makeHtmlStr( "购买能量？", '#54423A' );
                this.html_energyLack.innerHTML = text;
                this.html_centerTip.innerHTML = text1 + text2 + text3;
                this.html_energyLack.x = ( this.bg.width - this.html_energyLack.contextWidth ) / 2;
                this.html_energyLack.y = ( this.bg.height - this.html_energyLack.contextHeight ) / 2;
                this.html_centerTip.x = ( this.bg.width - this.html_centerTip.contextWidth ) / 2;
                this.html_centerTip.y = ( this.bg.height - this.html_centerTip.contextHeight ) / 2 + 50;
                this.btn_left.visible = true;
                this.btn_right.width = 194;
                this.btn_right.right = 68;
                this.btn_right.label = '是';
                this.setBtnLable();
                break;
            case E_AdornBuyTipType.E_GetIntegral:
                this.setHtmlText2();
                this.html_energyLack.innerHTML = '';
                this.html_centerTip.innerHTML = '能量不足,去连线学习赚能量';
                this.html_centerTip.x = ( this.bg.width - this.html_centerTip.contextWidth ) / 2;
                this.html_centerTip.y = ( this.bg.height - this.html_centerTip.contextHeight ) / 2;
                this.btn_left.visible = false;
                this.btn_right.width = 380;
                this.btn_right.right = 83;
                this.btn_right.label = '赚能量';
                this.setBtnLable();
                break;
            default:
                console.log( "E_AdornBuyTipType is Error!" );
                break;
        }
        this.txt_name.changeText( data.name );
        this.txt_des.changeText( data.des );
        let _data = data as FashionShopTableData;
        this.img_icon.skin = this.showFashionImg( _data );
        this.clickCallback = callback;
    }


    private setBtnLable() {
        this.btn_right.anchor( 0.5, 0.5 );
        this.btn_right.labelSize = 38;
        this.btn_right.labelColors = '#ffffff,#ffffff,#ffffff';
    }

    /** 设置Html文本属性 */
    private setHtmlText1() {
        this.html_energyLack.style.width = 150;
        this.html_energyLack.style.valign = "middle";
        this.html_energyLack.style.align = "middle";
        this.html_energyLack.style.font = 'Microsoft YaHei';
        this.html_energyLack.style.bold = true;
        this.html_energyLack.style.fontSize = 30;
    }

    private setHtmlText2() {
        this.html_centerTip.style.width = 400;
        this.html_centerTip.style.valign = "middle";
        this.html_centerTip.style.align = "middle";
        this.html_centerTip.style.font = 'Microsoft YaHei';
        this.html_centerTip.style.bold = true;
        this.html_centerTip.style.fontSize = 30;
    }

    /** 特殊界面-时装商店购买显示界面 */
    private showFashionBuy( data: FashionShopTableData ) {
        let img_fashionItem = this.box_fashionBuy.getChildByName( 'img_fashionItem' ) as Laya.Image;
        img_fashionItem.skin = this.showFashionImg( data );
        let txt_itemName = this.box_fashionBuy.getChildByName( 'txt_itemName' ) as Laya.Text;
        txt_itemName.text = data.name;
        //设置舒适度展示(居中布局)
        let bgWidth = this.bg.width;
        let txt_shushidu = this.box_fashionBuy.getChildByName( 'txt_shushidu' ) as Laya.Text;
        let img_comfy = this.box_fashionBuy.getChildByName( 'img_comfy' ) as Laya.Image;
        let txt_comfyValue = this.box_fashionBuy.getChildByName( 'txt_comfyValue' ) as Laya.Text;
        let comfyRate = ConstantDataManager.getInstance().getDataById( 41 ).content;
        txt_comfyValue.text = Math.floor( data.price / Number( comfyRate ) ).toString();
        let txtWidth = txt_shushidu.width + 20 + img_comfy.width + txt_comfyValue.width;
        txt_shushidu.x = ( bgWidth - txtWidth ) / 2;
        img_comfy.x = txt_shushidu.x + txt_shushidu.width + 20;
        txt_comfyValue.x = img_comfy.x + img_comfy.width;

        //设置价格展示
        let img_energy = this.box_fashionBuy.getChildByName( 'img_energy' ) as Laya.Image;
        let txt_piece = this.box_fashionBuy.getChildByName( 'txt_piece' ) as Laya.Text;
        let disCountInfo = PlayerData.disCountInfo;
        txt_piece.text = ( data.price * ( disCountInfo.disCount / 10 ) ).toString() + 'g';
        if ( disCountInfo.disCount == 10 ) {
            img_energy.x = ( bgWidth - img_energy.width - txt_piece.width ) / 2;
            txt_piece.x = img_energy.x + img_energy.width;
        }
        else {
            //折扣价格展示
            //折扣时间倒计时
            let txt_discount = this.box_fashionBuy.getChildByRelativePath( 'box_fashionDiscount/img_discount/txt_discount' ) as Laya.Text;
            let txt_discount2 = this.box_fashionBuy.getChildByRelativePath( 'box_fashionDiscount/txt_discount2' ) as Laya.Text;
            txt_discount.changeText( disCountInfo.disCount + '折' );
            txt_discount2.text = data.price.toString() + 'g';
            img_energy.x = ( bgWidth - img_energy.width - txt_piece.width - txt_discount2.width ) / 2;
            txt_piece.x = img_energy.x + img_energy.width;
            txt_discount2.x = txt_piece.x + txt_piece.width;
        }
    }

    /** 显示时装图片 */
    private showFashionImg( data: FashionShopTableData ): string {
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
        let skinPath = typePath + _gender + data.level + '.png';
        return skinPath;
    }

    /** 取消按钮被点击 */
    private onCancelClick(): void {
        AdornBuy._inst.closeFunc();
        if ( this.clickCallback ) {
            this.clickCallback( false );
        }
    }

    /** OK按钮被点击*/
    private onOkClick(): void {
        Common.btn_Protect( this.btn_right );
        this.fashionBuyFunc();
    }

    /** 时装购买事件 */
    private fashionBuyFunc() {
        switch ( this.state ) {
            case E_AdornBuyTipType.E_Buy://购买
                ClientBuyFashionCmd.getInstance().sendMsg( this.adornData.id, 1, ( msgData: BuyAdornData ) => {
                    if ( msgData.type == 1 ) {
                        this.buyFashionOkFunc( 1, msgData );
                        AdornBuy._inst.closeFunc();
                    } else {
                        if ( msgData.buy ) {
                            //跳转获消费积分弹窗
                            PlayerData.needCredit = msgData.needCredit;
                            AdornBuy._inst.closeFunc();
                            AdornBuy.showUI( E_AdornBuyTipType.E_ExpendIntegral, this.adornData )
                        } else {
                            //跳转赚取积分弹窗
                            AdornBuy._inst.closeFunc();
                            AdornBuy.showUI( E_AdornBuyTipType.E_GetIntegral, this.adornData );
                        }
                    }
                } );
                break;
            case E_AdornBuyTipType.E_ExpendIntegral://消耗积分
                ClientBuyFashionCmd.getInstance().sendMsg( this.adornData.id, 2, ( msgData: BuyAdornData ) => {
                    this.buyFashionOkFunc( 1, msgData );
                    AdornBuy._inst.closeFunc();
                } );
                break;
            case E_AdornBuyTipType.E_GetIntegral://赚能量
                AdornBuy._inst.closeFunc();
                TimingInterface.getInstance().gotoOnlineTiming();
                break;
            default:
                AdornBuy._inst.closeFunc();
                break;
        }
    }

    /** 
     * 购买/替换时装,成功后的执行事件 
     * @param type 1:购买 2:使用
     * @param data 购买、替换成功后的data
     */
    private buyFashionOkFunc( type: number, _data?: BuyAdornData ) {
        if ( type == 1 ) {
            let data = _data as BuyAdornData;
            CMsg.eventEmit( E_MsgType.E_UpdateRoomEnergy, [ data.remainEnergy, data.roomExperience ] );
        }
        CMsg.eventEmit( E_MsgType.E_ChangeFashion, this.adornData );
    }

    /** 显示折扣倒计时 */
    private showCountdown() {
        let disCountInfo = PlayerData.disCountInfo;
        let isFashionBuy = this.state == E_AdornBuyTipType.E_Buy ? true : false;
        if ( isFashionBuy ) {
            let box_fashionDiscount = this.box_fashionBuy.getChildByName( 'box_fashionDiscount' ) as Laya.Box;
            box_fashionDiscount.visible = disCountInfo.disCount < 10 ? true : false;
        }
        else {
            let box_fitmentDiscount = this.box_info.getChildByName( 'box_fitmentDiscount' ) as Laya.Box;
            box_fitmentDiscount.visible = disCountInfo.disCount < 10 ? true : false;
        }
        if ( disCountInfo.disCount == 10 ) {
            Laya.timer.clear( this, this.discountTimer );
        }
        else {
            this.discountTimer();
            Laya.timer.loop( 60000, this, this.discountTimer );
        }
    }

    /** 折扣倒计时 */
    private discountTimer() {
        let residu = Math.abs( PlayerData.disCountInfo.endTime * 1000 - CTime.getNowTimeStamp( true ) );
        let strTime = Common.formatSecondDHMS( residu );
        this.txt_discountTime.changeText( '折扣剩余时间: ' + strTime );
    }

    /** 遮罩关闭 */
    private onMaskClck(): void {
        this.closeFunc();
    }

    /** 关闭UI */
    private closeFunc() {
        if ( AdornBuy._inst == null ) { return; }
        Laya.timer.clear( this, this.discountTimer );
        MaskUI.hide();
        CSceneManager.close( E_DIALOG.E_ADORN_BUY );
        AdornBuy._inst = null;
    }

}