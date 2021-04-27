/**
 * 扩展实现
 * 在libs/expands.d.ts 中注册方法
 * 在这里实现方法
 */

/**
 * 加载扩展方法
 * 通过export 和空方法调用
 * 来让编译器把本文件编译进代码
 */
export function loadExpands() { }


/**
 * 扩展
 * 新增 getChildByRelativePath 方法
 * 可通过相对路径来获得相对于本节点的子节点
 * @param relative_path 相对路径
 */
Laya.Node.prototype.getChildByRelativePath = function ( this: laya.display.Node, relative_path: string ): laya.display.Node {
    let childnames = relative_path.split( "/" );
    let child = this;
    let index = 0;
    while ( index < childnames.length ) {
        child = child.getChildByName( childnames[ index++ ] );
    }
    if ( child == null ) {
    }
    return child;
};

/**
 * 扩展
 * @param effClass 继承自EffectAnimation的动效类
 * @param isLoop 是否循环
 */
Laya.Sprite.prototype.runEffectAnimation = function <T extends Laya.EffectAnimation>( this: laya.display.Sprite, effClass: { new(): T & Laya.EffectAnimation }, isLoop: boolean ): T {
    let effect = new effClass() as T;
    effect.target = this;

    /**
     * 临时创建节点装载对象
     */
    let sp = new laya.display.Sprite();
    sp.pos( this.x, this.y );
    sp.zOrder = this.zOrder;
    this.parent.addChild( sp );

    this.pos( 0, 0 );
    sp.addChild( this );

    effect.play( 0, isLoop );
    if ( !isLoop ) {
        effect.on( Laya.Event.COMPLETE, null, () => {
            effect.stopPlaying();
        } );
    }

    return effect;
};

/**
 * 停止播放
 */
Laya.EffectAnimation.prototype.stopPlaying = function ( this: Laya.EffectAnimation ): void {
    let target = this.target;
    let targetContain = target.parent;
    targetContain.parent.addChild( target );
    target.pos( targetContain.x, targetContain.y );
    targetContain.destroy();
}

/**
 * 同时设置组件锚点
 */
Laya.UIComponent.prototype.anchor = function ( this: laya.ui.UIComponent, x: number, y: number ): laya.ui.UIComponent {
    this.anchorX = x;
    this.anchorY = y;
    return this;
}
