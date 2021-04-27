import Common from "../../coffee_bean/utils/Common";

/** 
 * 遮罩界面
 * 本遮罩用来遮挡有dialog出现时的弹窗页面
 */
export default class MaskUI extends Laya.View {

    /** UI实例 */
    private static _inst: MaskUI = null;

    /** Mask点击事件 */
    private clickFunc: () => void;

    /** 构造函数 */
    constructor () {
        super();
        this.init();
    }

    onEnable() {
        this.on( Laya.Event.CLICK, this, this.onClickFunc );
    }

    private init() {
        Laya.stage.addChild( this );
        // 设置View尺寸
        Common.setFullSize( this );
        this.alpha = 0.5;
        this.mouseThrough = false;
        this.mouseEnabled = true;
        this.zOrder = 990;
        // 创建Box背景颜色层
        let boxBg = new Laya.Box();
        boxBg.bgColor = "#000000";
        Common.setFullSize( boxBg );
        this.addChild( boxBg );
    }

    /** 显示*/
    public static show( clickFunc?: () => void ): void {
        this.openUI( true, clickFunc );
    }

    /** 隐藏 */
    public static hide(): void {
        this.openUI( false );
    }

    /** 打开UI */
    private static async openUI( visible: boolean, clickFunc?: () => void ) {
        if ( MaskUI._inst == null ) {
            MaskUI._inst = await this.createUI();
        }
        if ( visible ) {
            MaskUI._inst.visible = true;
            if ( clickFunc ) MaskUI._inst.addEventFunc( clickFunc );
        } else {
            MaskUI._inst.visible = false;
            if ( clickFunc ) MaskUI._inst.offEventFunc();
        }
    }

    /** 创建UI */
    private static async createUI(): Promise<MaskUI> {
        return new Promise<MaskUI>(
            ( resolve, reject ) => {
                let inst = new MaskUI();
                resolve( inst );
            } );
    }

    /** 添加点击事件 */
    private addEventFunc( clickFunc: () => void ) {
        this.clickFunc = clickFunc;
        this.on( Laya.Event.CLICK, this, this.onClickFunc );
    }

    /** 移除点击事件 */
    private offEventFunc() {
        this.off( Laya.Event.CLICK, this, this.onClickFunc );
    }

    /** 点击事件 */
    private onClickFunc() {
        if ( this.clickFunc ) { this.clickFunc(); }
    }

    onClosed() {
        MaskUI._inst = null;
    }

}

