import CSingleton from "../../coffee_bean/core/CSingleton";
import { TableDataManager } from "./TableDataManager";

/** 时装商店读表数据类 */
export class FashionShopTableData {

    /**时装id */
    public id: number;

    /** 名称 */
    public name: string;

    /** 皮肤名称 */
    public skinName: string;

    /** 时装部位(0:头发 1:衣服 2:鞋子 3:表情) */
    public type: number;

    /** 性别(1:男 2:女) */
    public gender: number;

    /** 时装等级 */
    public level: number

    /** 介绍 */
    public des: string;

    /** 单价(单位:g) */
    public price: number

}

/** 时装商店数据读表管理类 */
export class FashionShopDataManager extends CSingleton {
    public readonly configData: FashionShopTableData[];

    constructor () {
        super();
        this.configData = TableDataManager.fashionShopConfig;
    }

    /**根据时装ID获取配置表数据 */
    public getDataById( id: number ): FashionShopTableData {
        for ( let item of this.configData ) {
            if ( id == item.id ) {
                return item;
            }
        }
        return null;
    }

    /** 
     * 根据指定类型、等级、性别,获取时装数据
     * @param type   类型(部位)
     * @param level  等级
     * @param gender 性别
     */
    public getDataByTypeAndLevel( type: number, level: number, gender: number ): FashionShopTableData {
        for ( let item of this.configData ) {
            if ( type == item.type && level == item.level && gender == item.gender ) {
                return item;
            }
        }
        return null;
    }

    /** 
     * 根据时装性别获取时装列表
     * @param gender 性别
     */
    public getListByGender( gender: number ): FashionShopTableData[] {
        let list: FashionShopTableData[] = new Array();
        for ( let item of this.configData ) {
            if ( item.gender == gender ) {
                list.push( item );
            }
        }
        return list;
    }

    /**
     * 根据时装部位获取时装列表
     * @param type (0:头发 1.衣服 2.鞋子 3.表情)
     */
    public getListByType( type: number ): FashionShopTableData[] {
        let list: FashionShopTableData[] = new Array();
        for ( let item of this.configData ) {
            if ( item.type == type ) {
                list.push( item );
            }
        }
        return list;
    }

}