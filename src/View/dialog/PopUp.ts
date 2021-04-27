import { ui } from "../../ui/layaMaxUI";
import { E_DIALOG } from "../../Scene/CSceneUrl";
import MaskUI from "../view/MaskUI";

/** 弹窗二级界面 */
export default class PopUp extends ui.DialogFile.PopUpUI {

    /** UI实例 */
    private static _inst: PopUp = null;

    /** 回调 */
    private clickCallback: ( boolean ) => void;

    constructor () {
        super();
    }

    onEnable() {
        this.ensure_btn.on( Laya.Event.CLICK, this, this.onOkClick );
        this.close_btn.on( Laya.Event.CLICK, this, this.onCancelClick );
    }

    /**
     * 显示通用弹出框
     * @param content 文本内容
     * @param ok 确定按钮图片路径
     * @param cancel 取消按钮图片路径(可选)
     * @param callback 回调函数(可选)
     * @param isHtml 是否是html文本(默认为false)
     */
    public static async showUI( content: string, ok: string, cancel?: string, callback?: ( boolean ) => void, isHtml = false ) {
        if ( PopUp._inst == null ) {
            MaskUI.show();
            PopUp._inst = await this.createUI();
            PopUp._inst.setView( content, ok, cancel, callback, isHtml );
        }
    }

    /** 创建UI */
    private static async createUI(): Promise<PopUp> {
        return new Promise<PopUp>(
            ( resolve, reject ) => {
                let handler = Laya.Handler.create( this, ( scene: PopUp ) => {
                    resolve( scene );
                } );
                Laya.Scene.open( E_DIALOG.E_POPUP.url, false, null, handler );
            }
        );
    }

    /** 关闭UI */
    private closeFunc() {
        if ( PopUp._inst == null ) { return; }
        MaskUI.hide();
        Laya.Scene.close( E_DIALOG.E_POPUP.url, E_DIALOG.E_POPUP.name );
    }

    /**
     * 设置显示
     * @param content 文本内容
     * @param ok 确定按钮文字
     * @param cancel 取消按钮文字
     * @param callback 回调函数
     * @param isHtml 是否是html文本(默认为false)
     */
    private setView( content: string, ok: string, cancel?: string, callback?: ( boolean ) => void, isHtml = false ) {
        if ( cancel ) {
            this.close_btn.visible = true;
            this.close_btn.left = 59;
            this.close_txt.changeText( cancel );
            this.ensure_btn.centerX = NaN;
            this.ensure_btn.right = 59;

        } else {
            this.close_btn.visible = false;
            this.ensure_btn.right = NaN;
            this.ensure_btn.centerX = 0;
        }
        this.ensure_txt.changeText( ok );
        if ( isHtml ) {
            this.txt_popUp.visible = false;
            this.txt_popUp.text = '';
            this.txt_html.visible = true;
            this.htmlTextInit();
            this.txt_html.innerHTML = content;
            this.txt_html.x = this.txt_popUp.x;
            this.txt_html.y = this.txt_popUp.y + 20;
        } else {
            this.txt_html.visible = false;
            this.txt_html.innerHTML = '';
            this.txt_popUp.visible = true;
            this.txt_popUp.text = content;
        }
        this.clickCallback = callback;
    }

    /** html文本初始化 */
    private htmlTextInit() {
        //设置文本样式
        this.txt_html.style.width = 446;
        this.txt_html.style.height = 120;
        this.txt_html.style.valign = "bottom";
        this.txt_html.style.align = "center";
        this.txt_html.style.font = "Arial";
        this.txt_html.style.wordWrap = true;
        this.txt_html.style.fontSize = 30;
        this.txt_html.style.leading = 5;
    }

    /** 取消按钮被点击 */
    private onCancelClick(): void {
        PopUp._inst.closeFunc();
        if ( this.clickCallback ) {
            this.clickCallback( false );
        }
    }

    /** OK按钮被点击*/
    private onOkClick(): void {
        PopUp._inst.closeFunc();
        if ( this.clickCallback ) {
            this.clickCallback( true );
        }
    }

    onClosed() {
        this.clickCallback = null;
        PopUp._inst = null;
    }

}