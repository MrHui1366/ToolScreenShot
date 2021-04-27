import CSingleton from "../coffee_bean/core/CSingleton";

/**
 * 通用UI动效管理类
 * @ author:XiangHui
 * @ date: 2020-12-14 17:04
 */
export default class UiEffManager extends CSingleton {

    constructor () {
        super();
    }

    /**
     * 场景运镜，缩放回弹效果
     * @param ui — ui对象
     * @param scene — 场景对象
     * @param func — 播放完毕回调
     */
    public scallSpringEff( ui: Laya.Sprite, scene: Laya.Sprite, func?: () => void ): void {
        ui.alpha = 0;
        Laya.MouseManager.enabled = false;
        scene.scale( 0.95, 0.95 );
        let viewAni = Laya.TimeLine.to( scene, { scaleX: 1, scaleY: 1 }, 600, null, 0 )
            .to( scene, { scaleX: 0.97, scaleY: 0.97 }, 150, null, 0 )
            .to( scene, { scaleX: 1, scaleY: 1 }, 150, null, 0 )
            .to( ui, { alpha: 1 }, 350, null, 0 );
        viewAni.once( Laya.Event.COMPLETE, this, () => {
            if ( func ) func();
            ( ui.alpha != 1 ) && ( ui.alpha = 1 );
            Laya.MouseManager.enabled = true;
        } );
        viewAni.play( 0, false );
    }

    /**
     * 上、下滑动效果
     * @param target 目标对象
     * @param isActive true打开，false关闭
     * @param endPoint 目标点
     * @param complete 播放完成回调
     */
    public upDownSliderEff( target: Laya.Sprite, isActive: boolean, endPoint: number, func?: () => void ) {
        ( target.mouseEnabled ) && ( target.mouseEnabled = false );
        //速率（值越大，速度越快）
        let speed = 6;
        let hasTime = endPoint / speed;
        let complete: Laya.Handler;
        if ( isActive ) {
            //打开
            complete = Laya.Handler.create( this, () => {
                target.mouseEnabled = true;
                target.visible = true;
                if ( func ) func();
            } )
        }
        else {
            //关闭
            complete = Laya.Handler.create( this, () => {
                target.mouseEnabled = false;
                target.visible = false;
                if ( func ) func();
            } )
        }
        Laya.Tween.to( target, { y: endPoint }, hasTime, Laya.Ease.linearIn, complete );
    }

    /**
     * 上、下心跳动效
     * @param target UI目标
     * @param jumpValue 跳跃值
     */
    public upDownJumpEff( target: Laya.Sprite, jumpValue: number ) {
        let posY = target.y;
        let Time_Line_move = Laya.TimeLine.to( target, { y: ( posY + jumpValue ) }, 1000 )
            .to( target, { y: ( posY - jumpValue ) }, 2000 )
            .to( target, { y: ( posY ) }, 1000 );
        Time_Line_move.play( 0, true );
    }

    /** 放大缩小动效 
     * @param target UI目标
     * @param minScale 缩放最小值
     * @param maxScacle 缩放最大值
     * @param time 缩放动画时间
    */
    public breathEff( target: Laya.Sprite, minScale: number, maxScacle: number, time: number ) {
        target.scale( maxScacle, maxScacle )
        let timeLine = Laya.TimeLine.to( target, { scaleX: minScale, scaleY: minScale }, time, null, 0 )
            .to( target, { scaleX: maxScacle, scaleY: maxScacle }, time, null, 0 );
        timeLine.play( 0, true );
    }

}