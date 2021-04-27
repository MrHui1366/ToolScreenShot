import CLOG from "../utils/CLOG";

/**
 * 异步封装
 * @export
 * @class CAsync
 */
export default class CAsync {

    /**
     * 等待 直到条件函数结果为真
     * @param conditionfunc 条件函数,能否返回真假的函数
     */
    public static async waitUntil( conditionfunc: () => boolean ): Promise<void> {
        return new Promise<void>( ( resolve, reject ) => {
            let runtime = 0;
            let timer = setInterval( () => {
                runtime++;
                if ( runtime > 1800 ) {
                    CLOG.W( "async wait until is run too long!! please make sure the condition can return true!!!" );
                    runtime = 0;
                }
                if ( conditionfunc() ) {
                    clearInterval( timer );
                    resolve();
                }
            }, 1000 / 60 );
        } );
    }

    /**
     * 异步等待
     * await CTime.waitTime(1000);  //等待1秒
     * @param millsec 等待的毫秒数
     */
    public static async waitTime( millsec: number ): Promise<void> {
        return new Promise<void>( ( resolve, reject ) => {
            setTimeout( () => resolve(), millsec );
        } );
    }

}