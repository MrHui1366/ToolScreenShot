import { CobjScale } from "../coffee_bean/core/CData";

/** button点击效果,带缩放效果*/
export default class ButtonEff extends Laya.Script {

    /** @prop {name:isOpnEff,tips:"是否开启按键特效",type:boolean,default:true}*/
    private isOpnEff: boolean = true;

    /** @prop {name:scaleTime,tips:"特效播放时长",type:number,default:100}*/
    private scaleTime: number = 100;

    private button: Laya.Button;

    private nowScale: CobjScale;

    constructor () {
        super();
    }

    onEnable() {
        this.button = this.owner as Laya.Button;
        if ( this.isOpnEff ) {
            this.button.on( Laya.Event.MOUSE_DOWN, this, this.scaleSmall );
        }
    }

    private scaleBig(): void {
        Laya.Tween.to( this.button, { scaleX: this.nowScale.scaleX, scaleY: this.nowScale.scaleY }, this.scaleTime );
    }

    private scaleSmall(): void {
        //先记录当前的缩放值
        this.nowScale = { scaleX: this.button.scaleX, scaleY: this.button.scaleY }
        this.button.on( Laya.Event.MOUSE_UP, this, this.scaleBig );
        this.button.on( Laya.Event.MOUSE_OUT, this, this.scaleBig );
        Laya.Tween.to( this.button, { scaleX: this.nowScale.scaleX * 0.8, scaleY: this.nowScale.scaleY * 0.8 }, this.scaleTime );
    }

}
