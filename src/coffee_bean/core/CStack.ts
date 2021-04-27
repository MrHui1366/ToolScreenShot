import { makeArrayWithData } from "./CFunction";
import CLOG from "../utils/CLOG";

/**
 * 数据结构 —— 栈
 * @export
 * @class CStack
 * @template T
 */
export default class CStack<T>{
    /*** 元素 ***/
    private _elements: Array<T>;

    /*** 容量 ***/
    private _capacity: number;

    /*** 数据量 ***/
    private _size: number;

    public constructor ( capacity: number = 1 ) {
        this._elements = makeArrayWithData( capacity, null as T );
        this._capacity = capacity;
        this._size = 0;
    }

    /**
     * 压入一个元素
     * 有可能会扩容
     * @param element
     * @returns
     * @memberof CStack
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
     * 移除栈顶
     * @memberof CStack
     */
    public pop(): T {
        if ( this._size == 0 ) {
            CLOG.E( "the stack is empty!!!" );
            return null;
        }
        // 要返回的数据
        let element = this._elements[ this._size - 1 ];
        this._elements[ this._size - 1 ] = null;
        this._size--;
        return element;
    }

    /**
     * 数据数量
     * @memberof CStack
     */
    public get size(): number {
        return this._size;
    }

    /**
     * 数据容量
     * @memberof CStack
     */
    public get capacity(): number {
        return this._capacity;
    }

    /**
     * 是否为空
     * @memberof CStack
     */
    public get isEmpty(): boolean {
        return this._size == 0;
    }

    /**
     * 清除栈
     * 不会影响容量
     * @memberof CStack
     */
    public clear() {
        for ( let index = 0; index < this._size; index++ ) {
            this._elements[ index ] = null;
        }
        this._size = 0;
    }

}
