import { ConstantTableData } from "./ConstantTableData";
import { ErrorTableData } from "./ErrorTableData";
import { FashionShopTableData } from './FashionShopTableData';

/**Json表配置文件 */
export class TableDataManager {

    /** 报错提示配置表 */
    public static errorConfig: ErrorTableData[];

    /** 常量配置表 */
    public static constantConfig: ConstantTableData[];

    /** 时装商店配置表 */
    public static fashionShopConfig: FashionShopTableData[];


    /**缓存第一阶段Json配置表 */
    public static readOneTable() {
        this.errorConfig = Laya.loader.getRes( "JsonConfig/errorConfig.json" );
        this.constantConfig = Laya.loader.getRes( "JsonConfig/constantConfig.json" );
    }

    /**缓存第二阶段Json配置表 */
    public static readTwoTable() {
        this.fashionShopConfig = Laya.loader.getRes( "JsonConfig/fashionShopConfig.json" );
    }

}