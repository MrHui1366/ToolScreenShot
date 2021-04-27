import CSingleton from "../coffee_bean/core/CSingleton";
import { CobjPos } from "../coffee_bean/core/CData";
import FontTip from "../Prefab/FontTip";

/** 通用飘字管理类 */
export default class TipsManager extends CSingleton {

    /**飘字预制体 */
    private fontTip_prefab: Laya.Prefab;

    constructor () {
        super();
        this.fontTip_prefab = new Laya.Prefab();
        this.fontTip_prefab.json = Laya.Loader.getRes( "PrefabFile/FontTip.json" );
    }

    /**
     * 创建text飘字Tips
     * @param conten 内容 
     * @param pos  坐标
     * @param showBg 是否显示飘字背景图片
     * @param callfunc 回调(可选)
     * @param color 文本颜色(可选)
     */
    public playFontTip( content: string, pos: CobjPos, showBg: boolean, callfunc?: Laya.Handler, color?: string ) {
        let fontObj = Laya.Pool.getItemByCreateFun( "FontTip", this.fontTip_prefab.create, this.fontTip_prefab ) as Laya.Sprite;
        fontObj.pos( pos.x, pos.y );
        fontObj.zOrder = 1001;
        Laya.stage.addChild( fontObj );
        let fontTip_s = fontObj.getComponent( FontTip ) as FontTip;
        fontTip_s.playTextTips( content, showBg, callfunc, color );
    }

    /**
     * 创建html飘字Tips
     * @param text 内容
     * @param pos 坐标
     * @param showBg 是否显示背景
     * @param callfunc 回调(可选)
     */
    public playHtmlFontTip( text: string, pos: CobjPos, showBg: boolean, callfunc?: Laya.Handler ) {
        let fontObj = Laya.Pool.getItemByCreateFun( "FontTip", this.fontTip_prefab.create, this.fontTip_prefab ) as Laya.Sprite;
        fontObj.pos( pos.x, pos.y );
        fontObj.zOrder = 1001;
        Laya.stage.addChild( fontObj );
        let fontTip_s = fontObj.getComponent( FontTip ) as FontTip;
        fontTip_s.playHtmlTips( text, showBg, callfunc );
    }

}