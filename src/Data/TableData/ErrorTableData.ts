import CSingleton from "../../coffee_bean/core/CSingleton";
import { TableDataManager } from "./TableDataManager";

/**异常报错数据类 */
export class ErrorTableData {

    /**id */
    public id: number = 0;

    /**文本 */
    public text: string = "";

    /**按键1的文字 */
    public btn1: string = "";

    /**按键2的文字 */
    public btn2: string = "";


}

/**异常报错数据读表管理类 */
export class ErrorDataManager extends CSingleton {
    public readonly configData: ErrorTableData[];

    constructor () {
        super();
        this.configData = TableDataManager.errorConfig;
    }

    /**根据id获取配置表数据 */
    public getDataById( id: number ): ErrorTableData {
        for ( let item of this.configData ) {
            if ( id == item.id ) {
                return item;
            }
        }
        return null;
    }
}