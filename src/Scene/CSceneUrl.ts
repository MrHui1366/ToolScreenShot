/** 场景资源类 */
export class CSceneUrl {

    /** 场景路径 */
    public url: string

    /** 场景名 */
    public name: string

}

/** UI */
export class E_UI {

    /** loading */
    public static E_LODING: CSceneUrl = {
        url: 'ViewFile/Loading.scene',
        name: 'Loading'
    }


    /** 时装商店 */
    public static E_SCREENSHOT: CSceneUrl = {
        url: 'ViewFile/ScreenShotUI.scene',
        name: 'ScreenShotUI'
    }

}

/** 弹窗 */
export class E_DIALOG {

    /** 通用弹窗 */
    public static E_POPUP: CSceneUrl = {
        url: 'DialogFile/PopUp.scene',
        name: 'PopUp'
    }

    /** 商店购买弹窗 */
    public static E_ADORN_BUY: CSceneUrl = {
        url: 'DialogFile/AdornBuy.scene',
        name: 'AdornBuy'
    }



}
