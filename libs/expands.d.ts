/**
 * CoffeeBean
 * 扩展
 * 
 * 在这里注册方法
 * 在coffee_bean/expand/CExpands.ts中实现方法
 */
declare module laya.display {
    export interface Node {
        /**
         * 根据相对路径获取儿子
         * @param relative_path 相对路径
         */
        getChildByRelativePath( this: laya.display.Node, relative_path: string ): laya.display.Node;
    }

    export interface Sprite {
        /**
         * 运行动效
         * @param effClass 动效类
         */
        runEffectAnimation<T extends laya.display.EffectAnimation>( this: laya.display.Sprite, effClass: { new(): T & laya.display.EffectAnimation }, isLoop: boolean ): T;
    }

    export interface EffectAnimation {
        /**
         * 停止动效播放
         * 恢复物体的父子关系
         */
        stopPlaying( this: laya.display.EffectAnimation );
    }
}

declare module laya.ui {
    export interface UIComponent {
        /**
         * 同时设置 anchor x,y
         */
        anchor( this: laya.ui.UIComponent, x: number, y: number ): laya.ui.UIComponent;
    }
}

/** vConsole控制台定义 */
declare class VConsole { }
