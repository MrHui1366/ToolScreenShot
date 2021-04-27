import { E_MsgType } from "../core/CEnum";
import CLOG from "../utils/CLOG";
import CTools from "../utils/CTools";


// Laya的自定义事件：都是基于事件基类 Laya.EventDispatcher
// 自定义事件，必不可少的要素：
// 1.必须要实例化一个EventDispatcher 事件管理器对象。
// 2.必须要先注册监听某个事件，才能去派发事件。(否则无意义)
// 3.如果该消息没有被注册事件处理，不得派发事件。
// 4.派发事件，和监听的事件必须是一 一对应的，也就是监听的消息类型要一致。
// 5.页面关闭后，要记得销毁该注册事件。

/**
 * CoffeeBean
 * 消息库封装
 */
export default class CMsg {

    /** 可调度事件基类 */
    private static eventDispatcher: Laya.EventDispatcher = new Laya.EventDispatcher();

    /**
     * 注册一个事件监听
     * (可重复监听同一类型消息)
     * @param type  事件类型（消息名字）
     * @param caller  作用域
     * @param listener  监听器
     * @param args  参数
     */
    public static eventOn( type: E_MsgType, caller: any, listener: Function, args?: any[] ): void {
        CLOG.I( "eventOn event msg:{0}", type );

        //安全检查
        if ( CTools.isEmptyOrNull( type ) ) {
            CLOG.E( "msg is null or empty:{0}", type );
            return;
        }
        CMsg.eventDispatcher.on( type, caller, listener, ( args == null ) ? null : ( [ args ] ) );
    }

    /**
     * 派发一个事件消息
     * @param type 事件类型（消息名字）
     * @param args 回调参数
     */
    public static eventEmit( type: E_MsgType, args?: any ): void {
        // CLOG.I( "eventEmit event msg:{0}", type );

        //安全检查
        if ( CTools.isEmptyOrNull( type ) ) {
            CLOG.E( "msg is null or empty:{0}", type );
            return;
        }

        //没有注册监听该事件
        if ( !CMsg.eventDispatcher.hasListener( type ) ) {
            CLOG.E( "msg The message types are not registered:{0}", type );
            return;
        }
        CMsg.eventDispatcher.event( type, [ args ] );
    }

    /**
     * 注册一个只监听一次的事件监听
     * @param type  事件类型（消息名字）
     * @param caller  作用域
     * @param listener  监听器
     * @param args  参数
     */
    public static eventOnce( type: E_MsgType, caller: any, listener: Function, args?: any[] ): void {
        CLOG.I( "eventOn once event msg:{0}", type );

        //安全检查
        if ( CTools.isEmptyOrNull( type ) ) {
            CLOG.E( "msg is null or empty:{0}", type );
            return;
        }

        //已注册该事件监听
        if ( CMsg.eventDispatcher.hasListener( type ) ) {
            CLOG.E( "msg The message type has been registered:{0}", type );
            return;
        }
        CMsg.eventDispatcher.once( type, caller, listener, ( args == null ) ? null : ( [ args ] ) );
    }

    /**
     * 从 EventDispatcher ,移除一个事件监听。
     * @param type		事件的类型。
     * @param caller	事件侦听函数的执行域。
     * @param listener	事件侦听函数。
     * @param onceOnly	（可选）如果值为 true ,则只移除通过 once 方法添加的侦听器。
     * @return 此 EventDispatcher 对象。
     */
    public static eventOff( type: E_MsgType, caller: any, listener: Function, onceOnly?: boolean ): void {
        CLOG.I( "remove one event msg:{0}", type );

        //安全检查
        if ( CTools.isEmptyOrNull( type ) ) {
            CLOG.E( "msg is null or empty:{0}", type );
            return;
        }

        //没有注册该事件监听
        if ( !CMsg.eventDispatcher.hasListener( type ) ) {
            CLOG.E( "msg The message types are not registered:{0}", type );
            return;
        }
        CMsg.eventDispatcher.off( type, caller, listener, onceOnly );
    }

    /**
     * 移除一个指定类型的所有事件监听
     * @param type 事件类型（消息名字）
     */
    public static eventOffAll( type?: E_MsgType ): void {
        CLOG.I( "remove All event msg:{0}", type );

        //安全检查
        if ( CTools.isEmptyOrNull( type ) ) {
            CLOG.E( "msg is null or empty:{0}", type );
            return;
        }

        //没有注册该事件监听
        if ( !CMsg.eventDispatcher.hasListener( type ) ) {
            CLOG.E( "msg The message types are not registered:{0}", type );
            return;
        }
        CMsg.eventDispatcher.offAll( type );
    }

}