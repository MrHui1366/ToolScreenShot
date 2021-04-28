import { FashionShopTableData } from './FashionShopTableData';

/**Json表配置文件 */
export class TableDataManager {

    /** 时装商店配置表 */
    public static fashionShopConfig: FashionShopTableData[];


    /**缓存第二阶段Json配置表 */
    public static readTwoTable() {
        this.fashionShopConfig = Laya.loader.getRes( "JsonConfig/fashionShopConfig.json" );
    }

}