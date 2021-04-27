import { makeArrayWithData } from "./CFunction";
import CLOG from "../utils/CLOG";

/**
 * 数据结构 —— 队列
 * @export
 * @class CQueue
 * @template T
 */
export default class CQueue<T>{
    /*** 元素 ***/
    private _elements: Array<T>;

    /*** 容量 ***/
    private _capacity: number;

    /*** 数据量 ***/
    private _size: number;

    /**
     * 从数组创建队列
     *
     * @static
     * @template T
     * @param datas
     * @returns
     * @memberof CQueue
     */
    public static create<T>( datas: Array<T> ): CQueue<T> {
        let queue = new CQueue<T>( datas.length );
        queue._elements = datas;
        queue._size = datas.length;
        return queue;
    }

    public constructor ( capacity: number = 1 ) {
        this._elements = makeArrayWithData( capacity, null as T );
        this._capacity = capacity;
        this._size = 0;
    }

    /**
     * 压入一个元素
     * 有可能会扩容
     *
     * @param element
     * @returns
     * @memberof CQueue
     */
    public push( element: T ): boolean {
        if ( element == null ) {
            return false;
        }

        // 扩容
        if ( this._size == this._capacity ) {
            this._elements = this._elements.concat( makeArrayWithData( this._capacity, null ) );
            this._capacity *= 2;
        }

        this._elements[ this._size++ ] = element;
        return true;
    }

    /**
     * 移除队首
     *
     * @returns
     * @memberof CQueue
     */
    public shift(): T {
        if ( this._size == 0 ) {
            CLOG.E( "the queue is empty!!!" );
            return null;
        }
        // 要返回的数据
        let element = this._elements[ 0 ];
        // 数据拷贝
        for ( let index = 1; index <= this._size; index++ ) {
            this._elements[ index - 1 ] = this._elements[ index ];
        }
        this._size--;
        return element;
    }

    /**
     * 得到第一个元素
     * 最先压入的元素
     *
     * @readonly
     * @memberof CQueue
     */
    public get first(): T {
        return this._elements[ 0 ];
    }

    /**
     * 最后一个元素
     * 最后压入的元素
     *
     * @readonly
     * @memberof CQueue
     */
    public get last(): T {
        return this._elements[ this._size - 1 ];
    }

    /**
     * 数据数量
     *
     * @readonly
     * @memberof CQueue
     */
    public get size(): number {
        return this._size;
    }


    /**
     * 数据容量
     *
     * @readonly
     * @memberof CQueue
     */
    public get capacity(): number {
        return this._capacity;
    }

    /**
     * 是否为空
     *
     * @returns
     * @memberof CQueue
     */
    public get isEmpty(): boolean {
        return this._size == 0;
    }

    /**
     * 清除队列
     * 不会影响容量
     *
     * @memberof CQueue
     */
    public clear() {
        for ( let index = 0; index < this._size; index++ ) {
            this._elements[ index ] = null;
        }
        this._size = 0;
    }

}
