import { ui } from "../../ui/layaMaxUI";
import { FashionShopDataManager, FashionShopTableData } from "../../Data/TableData/FashionShopTableData";
import Role from "../../Prefab/Role";
import { PlayerData } from "../../Data/PlayerData";
import CMsg from "../../coffee_bean/utils/CMsg";
import { E_MsgType } from "../../coffee_bean/core/CEnum";
import Common from "../../coffee_bean/utils/Common";
import RoleManager from "../../Manager/RoleManager";
import { ConstantDataManager } from "../../Data/TableData/ConstantTableData";
import AdornBuy, { E_AdornBuyTipType } from "../dialog/AdornBuy";
import { ClientChangeFashionCmd } from "../../NetWork/ClientChangeFashionCmd";
import { TimingInterface } from "src/Interface/TimingInterface";
import { ClientSettingSwitchCmd } from "src/NetWork/ClientSettingSwitchCmd";
import FashionShopItem from "src/Script/FashionShopItem";
import ClientMyClothingCmd from "src/NetWork/ClientMyClothingCmd";
import CTools from "src/coffee_bean/utils/CTools";
import { clog } from "src/coffee_bean/utils/CLOG";


/**
 * 时装商店
 * @ author:XiangHui
 * @ date: 2020-09-21 19:39
 */
export default class FashionShopUI extends ui.ViewFile.FashionShopUI {

    /** 本性别所有服装列表 */
    private tableData: FashionShopTableData[] = null;

    /** 舒适值换算值 */
    private comfyRate: number;

    /** 当前穿戴的时装列表 */
    private inUseArr: FashionShopTableData[] = null;

    /** 角色对象 */
    private Role: Role = null;

    /** 是否切换到最新 */
    private isCutNew: boolean;

    /** 当前分页栏下标 */
    private nowIndex: number;

    /** 分页栏按键 */
    private pageBtnList: Laya.Image[];

    /** 分页栏服装数据 */
    private pageListArr: Array<FashionShopTableData[]> = null;

    /** list数据源 */
    private listArr: FashionShopTableData[] = null;

    /** 上新时装列表 */
    private newFashionList: FashionShopTableData[] = null;

    /** 我的购买时装列表 */
    private myFashionList: FashionShopTableData[] = null;

    constructor () {
        super();
    }

    onAwake() {
        this.comfyRate = Number( ConstantDataManager.getInstance().getDataById( 41 ).content );
    }

    onEnable() {
        this.list_panel.scrollBar.hide = true;
        this.btn_back.on( Laya.Event.CLICK, this, this.backBtn );
        this.btn_save.on( Laya.Event.CLICK, this, this.updateRolePart );
        this.btn_itemBuy.on( Laya.Event.CLICK, this, this.showBuy );
        this.img_SettingBg.on( Laya.Event.CLICK, this, this.settingBtn );
        this.img_cutBg.on( Laya.Event.CLICK, this, this.cutBtn );
        this.btn_All.on( Laya.Event.CLICK, this, this.shopPagBtn, [ 0 ] );
        this.btn_hair.on( Laya.Event.CLICK, this, this.shopPagBtn, [ 1 ] );
        this.btn_clothes.on( Laya.Event.CLICK, this, this.shopPagBtn, [ 2 ] );
        this.btn_shose.on( Laya.Event.CLICK, this, this.shopPagBtn, [ 3 ] );
        this.btn_face.on( Laya.Event.CLICK, this, this.shopPagBtn, [ 4 ] );
        this.pageBtnList = [ this.btn_All, this.btn_hair, this.btn_clothes, this.btn_shose, this.btn_face ];
        this.onEvent();
    }

    /** 注册事件监听 */
    onEvent() {
        CMsg.eventOn( E_MsgType.E_ChangeFashion, this, this.upDateShopAndPart );
        CMsg.eventOn( E_MsgType.E_SelectFashionItem, this, this.setSelectItemInfo );
        CMsg.eventOn( E_MsgType.E_UpdateRoomEnergy, this, this.showEnergyComfort );
    }

    onOpened() {
        this.pageListInit();
        this.init();
    }

    /** 
     * 分页栏数据初始化
     * ps:方便后续快速页面切换,仅排序一次,性能最优
     */
    private pageListInit() {
        let tableData = FashionShopDataManager.getInstance().getListByGender( PlayerData.userInfo.gender );
        this.tableData = tableData;
        let hairArr = this.partListSort( 0, tableData );
        let clothesArr = this.partListSort( 1, tableData );
        let shoseArr = this.partListSort( 2, tableData );
        let faceArr = this.partListSort( 3, tableData );
        let allArr = this.allPartListSort( tableData );
        this.pageListArr = [ allArr, hairArr, clothesArr, shoseArr, faceArr ];
        this.newFashionList = [];
        for ( let item of tableData ) {
            if ( PlayerData.newClothing.indexOf( item.id ) != -1 )
                this.newFashionList.push( item );
        }
        this.newFashionList.sort( function ( a, b ) {
            if ( a[ "level" ] === b[ "level" ] ) {
                if ( a[ "type" ] > b[ "type" ] ) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                if ( a[ "level" ] > b[ "level" ] ) {
                    return -1;
                } else {
                    return 1;
                }
            }
        } );
    }

    /** 
     * 部位时装列表排序
     * @param index 部位下标
     * @param data 部位列表
     */
    private partListSort( index: number, data: FashionShopTableData[] ) {
        let list: FashionShopTableData[] = new Array();
        for ( let item of data ) {
            if ( item.type == index ) {
                list.push( item );
            }
        }
        list.sort( function ( a, b ) {
            if ( a[ "level" ] > b[ "level" ] ) {
                return -1;
            } else {
                return 1;
            }
        } );
        return list;
    }

    /** 所有时装部位排序 */
    private allPartListSort( data: FashionShopTableData[] ) {
        data.sort( function ( a, b ) {
            if ( a[ "type" ] === b[ "type" ] ) {
                if ( a[ "level" ] > b[ "level" ] ) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                if ( a[ "type" ] > b[ "type" ] ) {
                    return 1;
                } else {
                    return -1;
                }
            }
        } )
        return data;
    }

    /** 初始化 */
    private init() {
        let userInfo = PlayerData.userInfo;
        this.getOnUseArr();
        this.showEnergyComfort( [ userInfo.remainEnergy, userInfo.roomExperience ] );
        this.showCutBtn( true );
        this.showSettingBtn( userInfo.isShow );
        this.createRole();
        this.setSelectItemInfo( PlayerData.clothing[ 1 ].inUse );
        this.shopPagBtn( 0 );
        this.list_panel.renderHandler = new Laya.Handler( this, this.updateShopItem );
    }

    /** 显示能量、舒适度 */
    private showEnergyComfort( data: [ number, number ] ) {
        let energyText = Common.math_matrixing( data[ 0 ] )
        this.txt_energy.changeText( energyText );
        this.txt_comfort.changeText( data[ 1 ].toString() );
    }

    /**
     * 显示TimingShow设置
     * @param isShow 
     */
    private showSettingBtn( isShow: boolean ) {
        if ( isShow ) {
            this.img_SettingBg.skin = 'ui_Fashion/img_settingBg1.png';
            this.btn_Setting.x = 52;
        } else {
            this.img_SettingBg.skin = 'ui_Fashion/img_settingBg0.png';
            this.btn_Setting.x = 0;
        }
    }

    /**
     * 显示切换状态
     * @param isCutNew 是否切换到最新
     */
    private showCutBtn( isCutNew: boolean ) {
        if ( isCutNew ) {
            this.txt_cutBg.changeText( '我的' );
            this.txt_cut.text = '最新';
            this.btn_cut.x = 84;
            this.txt_cutBg.x = 26;
        } else {
            this.txt_cutBg.changeText( '最新' );
            this.txt_cut.text = '我的';
            this.btn_cut.x = 0;
            this.txt_cutBg.x = 120;
        }
        this.isCutNew = isCutNew;
    }

    /** 设置TimingShow按键 */
    private settingBtn() {
        Common.btn_Protect( this.btn_Setting );
        let type = PlayerData.userInfo.isShow ? 0 : 1;
        ClientSettingSwitchCmd.getInstance().sendMsg( type, ( isShow: boolean ) => {
            PlayerData.userInfo.isShow = isShow;
            this.showSettingBtn( isShow );
        } );
    }

    /** 切换最新,我的按键 */
    private cutBtn() {
        Common.btn_Protect( this.btn_cut );
        let isCutNew = !this.isCutNew;
        if ( isCutNew ) {
            this.showCutBtn( isCutNew );
            this.showNewClothing();
        } else {
            ClientMyClothingCmd.getInstance().sendMsg( ( msgData: Array<number> ) => {
                this.showCutBtn( isCutNew );
                this.showMyClothing( msgData );
            } )
        }
    }

    //创建角色
    private createRole() {
        let pos = { x: this.role_root.width / 2, y: this.role_root.height };
        this.Role = RoleManager.getInstance().createRole( this.role_root, pos );
    }

    /**
     * 设置选中item的详情
     * @param selectitemId 选中的服装ID
     */
    private setSelectItemInfo( selectitemId: number ) {
        let data = FashionShopDataManager.getInstance().getDataById( selectitemId );
        ( PlayerData.selectItemId != 0 ) && ( this.Role.changePartSkin( data ) );
        PlayerData.selectItemId = selectitemId;
        this.txt_itemName.text = data.name;
        this.txt_itemDes.text = data.des;
        let comfyStr = Math.floor( data.price / this.comfyRate );
        this.txt_comfyValue.changeText( comfyStr.toString() );
        this.updateBtn( data );
    }

    /**
     * 刷新按钮状态
     * @param data 选中的服装数据
     */
    private updateBtn( data: FashionShopTableData ) {
        let ownAdornData = PlayerData.clothing[ data.type ];
        let isOwned = ownAdornData.owned.indexOf( PlayerData.selectItemId ) > -1 ? true : false;
        //设置按钮显示状态
        let isUse = ownAdornData.inUse == PlayerData.selectItemId ? true : false;
        this.btn_use.visible = ( isOwned && isUse ) ? true : false;
        this.btn_save.visible = ( isOwned && !isUse ) ? true : false;
        this.btn_itemBuy.visible = !isOwned;
        //设置按钮上的购买信息
        if ( this.btn_itemBuy.visible ) {
            //计算按钮位置
            let img_energy = this.btn_itemBuy.getChildByName( 'img_energy' ) as Laya.Image;
            let txt_piece = this.btn_itemBuy.getChildByName( 'txt_piece' ) as Laya.Text;
            let txt_buy = this.btn_itemBuy.getChildByName( 'txt_buy' ) as Laya.Text;
            let discountNum = data.price * ( PlayerData.disCountInfo.disCount / 10 );
            txt_piece.text = discountNum.toString() + 'g';
            let totalWidth = img_energy.width + txt_piece.width + txt_buy.width;
            img_energy.x = ( this.btn_itemBuy.width - totalWidth ) / 4;
            txt_piece.x = img_energy.x + img_energy.width;
            txt_buy.x = txt_piece.x + txt_piece.width;
        }
    }

    /** 显示购买弹窗 */
    private showBuy() {
        let data = FashionShopDataManager.getInstance().getDataById( PlayerData.selectItemId );
        AdornBuy.showUI( E_AdornBuyTipType.E_Buy, data );
    }

    /** 保存当前时装 */
    private updateRolePart() {
        let data = FashionShopDataManager.getInstance().getDataById( PlayerData.selectItemId );
        ClientChangeFashionCmd.getInstance().sendMsg( data.id, () => {
            this.upDateShopAndPart( data );
        } );
    }

    /** 获取当前穿戴的时装列表 */
    private getOnUseArr() {
        //1.判断当前穿戴的时装和自己性别是否一致
        this.inUseArr = new Array();
        let clothingData = PlayerData.clothing;
        let gender = PlayerData.userInfo.gender;
        for ( let i = 0; i < clothingData.length; i++ ) {
            let table = FashionShopDataManager.getInstance().getDataById( clothingData[ i ].inUse );
            if ( table.gender == gender ) {
                this.inUseArr.push( table );
            } else {
                let nowTable = FashionShopDataManager.getInstance().getDataByTypeAndLevel( table.type, table.level, gender );
                this.inUseArr.push( nowTable );
            }
        }
    }

    private backBtn() {
        Common.btn_Protect( this.btn_back );
        TimingInterface.getInstance().backToApp();
    }

    /** 
     * 选中分页栏
     * @param index 分页栏下标
     */
    private shopPagBtn( index: number ) {
        if ( this.nowIndex == index ) return;
        this.updatePageList( index );
    }

    /**
     * 更新分页栏数据
     * @param index 分页栏下标
     */
    private updatePageList( index: number ) {
        this.list_panel.scrollBar.value = 0;
        this.nowIndex = index;
        if ( this.isCutNew ) {
            //最新
            if ( this.nowIndex == 0 ) {
                let newList: FashionShopTableData[] = new Array();
                newList = CTools.arrClone( this.newFashionList )
                for ( let item of this.pageListArr[ this.nowIndex ] ) {
                    let tableData = newList.find( data => data.id == item.id );
                    if ( !tableData ) newList.push( item );
                }
                this.listArr = newList;
            } else {
                this.listArr = this.pageListArr[ index ];
            }
        } else {
            //我的
            this.getMyClothingList();
        }
        this.list_panel.array = this.listArr;
        this.showPageState( index );
    }

    /**
     * 显示分页栏状态
     * @param index 分页栏下标
     */
    private showPageState( index: number ) {
        for ( let i = 0; i < this.pageBtnList.length; i++ ) {
            if ( i == index ) {
                this.pageBtnList[ i ].skin = 'ui_Fashion/img_pageBtnP' + i + '.png';
            } else {
                this.pageBtnList[ i ].skin = 'ui_Fashion/img_pageBtn' + i + '.png';
            }
        }
    }

    /**
     * 显示我的服装
     * @param msgData 购买时装ID列表
     */
    private showMyClothing( list: Array<number> ) {
        let myHasList: FashionShopTableData[] = new Array();
        for ( let item of list ) {
            let fashion = this.tableData.find( data => data.id == item );
            if ( fashion ) {
                myHasList.push( fashion );
            } else {
                let fashionData = FashionShopDataManager.getInstance().getDataById( item );
                let gender = fashionData.gender == 1 ? 2 : 1;
                let fashion = FashionShopDataManager.getInstance().getDataByTypeAndLevel( fashionData.type, fashionData.level, gender );
                let ishas = myHasList.find( data => data.id == fashion.id );
                if ( !ishas ) {
                    myHasList.push( fashion );
                }
            }
        }
        this.myFashionList = myHasList;
        this.getMyClothingList();
    }

    /** 获取我的服装列表 */
    private getMyClothingList() {
        let myHasList: FashionShopTableData[] = CTools.arrClone( this.myFashionList );
        switch ( this.nowIndex ) {
            case 0:
                this.listArr = myHasList;
                break;
            case 1:
                this.listArr = wipeFunc( myHasList, 0 );
                break;
            case 2:
                this.listArr = wipeFunc( myHasList, 1 );
                break;
            case 3:
                this.listArr = wipeFunc( myHasList, 2 );
                break;
            case 4:
                this.listArr = wipeFunc( myHasList, 3 );
                break;
        }
        this.list_panel.array = this.listArr;
        function wipeFunc( arr: FashionShopTableData[], type: number ) {
            for ( let i = arr.length - 1; i >= 0; i-- ) {
                if ( arr[ i ].type != type ) arr.splice( i, 1 );
            }
            return arr;
        }
    }

    /** 显示上新服装 */
    private showNewClothing() {
        this.updatePageList( this.nowIndex );
    }

    /** 更新商店item单元格 */
    private updateShopItem( cell: Laya.Box, index: number ): void {
        let data: FashionShopTableData = this.listArr[ index ];
        ( cell.getComponent( FashionShopItem ) as FashionShopItem ).setData( data );
    }

    /** 
     * 更新时装商店及部位
     * @param data 替换的时装属性
     */
    private upDateShopAndPart( data: FashionShopTableData ) {
        let ownAdornData = PlayerData.clothing.find( item => item.type == data.type );
        if ( ownAdornData ) {
            ownAdornData.inUse = data.id;
            if ( ownAdornData.owned.indexOf( data.id ) == -1 ) {
                ownAdornData.owned.push( data.id );
                PlayerData.newClothing.push( data.id );
            }
        }
        this.inUseArr[ data.type ] = data;
        if ( this.isCutNew ) {
            this.list_panel.array = this.pageListArr[ this.nowIndex ];
        } else {
            this.list_panel.array = this.listArr;
        }
        //替换商店页面局部时装
        this.Role.changePartSkin( data );
        this.updateBtn( data );
    }

    onDisable() {
        this.Role.DestroyAni();
        this.Role = null;
        this.inUseArr = null;
        PlayerData.selectItemId = 0;
    }

    onClosed() {
        CMsg.eventOff( E_MsgType.E_ChangeFashion, this, this.upDateShopAndPart );
        CMsg.eventOff( E_MsgType.E_SelectFashionItem, this, this.setSelectItemInfo );
        CMsg.eventOff( E_MsgType.E_UpdateRoomEnergy, this, this.showEnergyComfort );
    }


}