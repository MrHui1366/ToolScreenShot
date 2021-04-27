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

    /** 引导页 */
    public static E_GUIDE: CSceneUrl = {
        url: 'ViewFile/Guide.scene',
        name: 'Guide'
    }

    /** 时装商店 */
    public static E_FASHION_SHOP: CSceneUrl = {
        url: 'ViewFile/FashionShop.scene',
        name: 'FashionShop'
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
