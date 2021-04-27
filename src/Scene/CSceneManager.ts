import { CSceneUrl, E_DIALOG, E_UI } from "./CSceneUrl";

/**
 * 场景管理类
 * @ author:XiangHui
 * @ date: 2021-01-30 15:29
 */
export default class CSceneManager {

    /**
     * 加载并打开场景
     * @param scene 场景地址
     * @param closeOther 是否关闭其他场景，默认为true,【注意】被关闭的场景，如果没有设置autoDestroyAtRemoved=true，则资源可能不能被回收，需要自己手动回收
     * @param param 打开页面的参数，会传递给onOpened方法（可选）
     * @param complete 打开完成回调，返回场景实例（可选）
     * @param progress 加载进度回调（可选）
     */
    public static open( sceneUrl: CSceneUrl, closeOther?: boolean, param?: any, complete?: laya.utils.Handler, progress?: laya.utils.Handler ) {
        Laya.Scene.open( sceneUrl.url, closeOther, param, complete, progress );
    }

    /** 关闭场景 */
    public static close( sceneUrl: CSceneUrl ) {
        Laya.Scene.close( sceneUrl.url, sceneUrl.name );
    }

    /** 
     * 判断某个场景是否打开
     * @param data 场景
     * @return 结果
     */
    public static sceneIsOpen( data: CSceneUrl ): boolean {
        let list = Laya.Scene.unDestroyedScenes;
        for ( let i = 0, n = list.length; i < n; i++ ) {
            let scene = list[ i ];
            if ( scene && scene.parent && scene.name == data.name ) {
                return true;
            }
        }
        return false;
    }

    /** 
     * 获取某个场景实例对象
     * @param name 场景名
     * @return 结果
     */
    public static getSceneObj( name: string ): any {
        let list = Laya.Scene.unDestroyedScenes;
        for ( let i = 0, n = list.length; i < n; i++ ) {
            let scene = list[ i ];
            if ( scene && scene.parent && scene.name == name ) {
                return scene;
            }
        }
        return null;
    }

    /** 打开截图 */
    public static openScreenShot() {
        this.open( E_UI.E_SCREENSHOT );
    }

    /** 
     * 打开购买弹窗
     * @param complete 回调
     */
    public static openAdornBuy( complete?: Handler ) {
        this.open( E_DIALOG.E_ADORN_BUY, false, null, complete );
    }

}