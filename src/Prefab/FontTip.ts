/**
 * 飘字提示对象
 * @ author:XiangHui
 * @ date: 2020-07-29 10:19
 */
export default class FontTip extends Laya.Script {

    /** 飘字对象节点 */
    private _owner: Laya.Sprite;

    /** 背景 */
    private img_bg: Laya.Image;

    /** 内容 */
    private tipFont: Laya.Label;

    /**图文混排文字内容 */
    private imageText: Laya.HTMLDivElement;

    constructor () {
        super();
    }

    onEnable() {
        this._owner = this.owner as Laya.Sprite;
        this.img_bg = this.owner.getChildByName( "img_bg" ) as Laya.Image;
        this.tipFont = this.owner.getChildByName( "tipFont" ) as Laya.Label;
        this.imageText = this.owner.getChildByName( "imageText" ) as Laya.HTMLDivElement;
    }

    /**
     * 播放Text飘字效果
     * @param text 内容
     * @param showBg 是否显示背景图片
     * @param callfunc 回调
     * @param color 文本颜色
     */
    public playTextTips( text: string, showBg: boolean, callfunc?: Laya.Handler, color?: string ) {
        this.tipFont.text = text;
        this.tipFont.color = color ? color : "#ffffff";
        //设置背景宽度
        this.img_bg.visible = showBg;
        ( this.img_bg.visible ) && ( this.img_bg.width = this.tipFont.width );
        let initScale = Laya.stage.width * 0.95 / this.img_bg.width;
        let bigScale = Laya.stage.width * 0.8 / this.img_bg.width;
        let scaleRate = this.img_bg.width / Laya.stage.width;
        let smallScale = bigScale - ( scaleRate > 0.8 ? 0.1 : 0.2 );
        this._owner.scale( initScale, initScale );
        let waveFont = Laya.TimeLine.to( this._owner, { scaleX: bigScale, scaleY: bigScale }, 300, null, 0 )
            .to( this._owner, { scaleX: smallScale, scaleY: smallScale }, 200, null, 0 )
            .to( this._owner, { y: this._owner.y - 100, scaleX: smallScale, scaleY: smallScale }, 600, null, 0 )
            .to( this._owner, { alpha: 0 }, 0, null, 0 );
        //飘字完成后，执行事件
        waveFont.once( Laya.Event.COMPLETE, this, () => {
            if ( callfunc ) callfunc.run();
            this.destroyTarget();
        } );
        waveFont.play( 0, false );
    }

    /**
     * 播放html飘字效果
     * @param text 内容
     * @param showBg 是否显示背景图片
     * @param callfunc 回调
     */
    public playHtmlTips( text: string, showBg: boolean, callfunc?: Laya.Handler ) {
        //设置文本样式
        this.imageText.style.width = 650;
        this.imageText.style.height = 58;
        this.imageText.style.valign = "bottom";
        this.imageText.style.align = "left";
        this.imageText.style.font = "Arial";
        this.imageText.style.wordWrap = true;
        this.imageText.style.fontSize = 25;
        this.tipFont.changeText( "" );
        this.imageText.innerHTML = text;
        this.imageText.pos( -this.imageText.contextWidth / 2, -this.imageText.contextHeight / 2 );
        //设置提示文本的背景宽度
        this.img_bg.visible = showBg;
        ( this.img_bg.visible ) && ( this.img_bg.width = this.imageText.contextWidth );
        //播放动画
        let waveFont = Laya.TimeLine.to( this._owner, { y: ( this._owner.y - 200 ) }, 1500, null, 0 )
            .to( this._owner, { alpha: 0 }, 0, null, 0 );
        //飘字完成后，执行事件
        waveFont.once( Laya.Event.COMPLETE, this, () => {
            if ( callfunc ) callfunc.run();
            this.destroyTarget();
        } );
        waveFont.play( 0, false );
    }

    /** 回收 */
    private destroyTarget() {
        this._owner.removeSelf();
    }

    /** 重置 */
    private resetTips() {
        this.imageText.innerHTML = "";
        this._owner.alpha = 1;
        this._owner.scale( 1, 1 );
        this._owner.pos( 0, 0 );
    }

    onDisable() {
        this.resetTips();
        Laya.Pool.recover( "FontTip", this._owner );
    }

}