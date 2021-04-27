import CSingleton from "../../coffee_bean/core/CSingleton";
import { TableDataManager } from "./TableDataManager";

/**常量数据类 */
export class ConstantTableData {
    /**id */
    public id: number = 0;

    /**内容 */
    public content: string = "";

}


/**常量数据读表管理类 */
export class ConstantDataManager extends CSingleton {
    public readonly configData: ConstantTableData[];

    constructor () {
        super();
        this.configData = TableDataManager.constantConfig;
    }

    /**根据id 获取配置表数据 */
    public getDataById( id: number ): ConstantTableData {
        for ( let item of this.configData ) {
            if ( id == item.id ) {
                return item;
            }
        }
        return null;
    }




} 