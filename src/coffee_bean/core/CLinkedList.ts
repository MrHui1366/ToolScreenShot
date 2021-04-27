import CLOG from "../utils/CLOG";
import CTools from "../utils/CTools";

/**
 * 双向链表节点
 * @export
 * @interface CLinkedNode
 * @template T
 */
export class CLinkedNode<T> {
    public data: T;
    public prev: CLinkedNode<T>;
    public next: CLinkedNode<T>;
}

/**
 * 双向链表
 * @template T
 */
export default class CLinkedList<T>{

    /**
     * 第一个元素
     * @memberof CLinkedList
     */
    private _first: CLinkedNode<T>;

    /**
     * 最后一个元素
     * @memberof CLinkedList
     */
    private _last: CLinkedNode<T>;

    /*** 元素个数 ***/
    private _size: number;

    public constructor () {
        this._size = 0;
        this._first = null;
        this._last = null;
    }

    /**
     * 增加第一个元素
     * @param element 要增加的元素
     * @returns
     * @memberof CLinkedList
     */
    public addFirst( element: T ): CLinkedNode<T> {
        let node = new CLinkedNode<T>();
        node.data = element;

        if ( this._size == 0 ) {
            node.prev = null;
            node.next = null;
            this._first = node;
            this._last = node;
        } else {
            node.prev = null;
            node.next = this._first;
            this._first.prev = node;
            this._first = node;
        }
        this._size++;
        return node;
    }

    /**
     * 增加最后一个元素
     * @param element 要增加的元素
     * @returns
     * @memberof LinkedList
     */
    public addLast( element: T ): CLinkedNode<T> {
        let node = new CLinkedNode<T>();
        node.data = element;

        if ( this._size == 0 ) {
            node.prev = null;
            node.next = null;
            this._first = node;
            this._last = node;
        } else {
            node.prev = this._last;
            node.next = null;
            this._last.next = node;
            this._last = node;
        }
        this._size++;
        return node;
    }

    /**
     * 移除最后一个节点并返回
     * @returns
     * @memberof LinkedList
     */
    public removeLast(): CLinkedNode<T> {
        if ( this._size == 0 ) {
            CLOG.E( "the linkedlist is empty" );
            return null;
        }
        let node = this._last;
        this._last = node.prev;
        this._last != null && ( this._last.next = null );
        node.next = null;
        node.prev = null;
        if ( --this._size == 0 ) {
            this._first = null;
        }
        return node;
    }

    /**
     * 移除第一个元素
     * @returns
     * @memberof CLinkedList
     */
    public removeFirst(): CLinkedNode<T> {
        if ( this._size == 0 ) {
            CLOG.E( "the linkedlist is empty" );
            return null;
        }
        let node = this._first;
        this._first = node.next;
        this._first != null && ( this._first.prev = null );
        node.next = null;
        node.prev = null;
        if ( --this._size == 0 ) {
            this._last = null;
        }
        return node;
    }

    /**
     * 获得节点
     * @param index 序号
     * @returns
     * @memberof CLinkedList
     */
    public getNode( index: number ): CLinkedNode<T> {
        // 安全检查
        if ( index >= this._size || index < -this._size ) {
            CLOG.E( "linkedlist index {0} offset!!", index );
            return null;
        }
        if ( index == 0 ) {
            return this._first;
        } else if ( index == this._size - 1 ) {
            return this._last;
        } else if ( index < 0 ) {
            index += this._size;
        }
        if ( index < this._size / 2 ) {
            // 正序遍历
            let node = this._first;
            for ( let i = 0; i < index; i++ ) {
                node = node.next;
            }
            return node;
        } else {
            // 倒序遍历
            index = this._size - index - 1;
            let node = this._last;
            for ( let i = 0; i < index; i++ ) {
                node = node.prev;
            }
            return node;
        }
    }

    /**
     * 在指定位置插入
     * 原有位置的值后移
     * @param element 要插入的元素
     * @param index 位置 -1 代表队尾 ， this._size 也代表队尾
     * @returns
     * @memberof CLinkedList
     */
    public insert( element: T, index: number ): CLinkedNode<T> {
        // 安全检查
        if ( index > this._size || index < -this._size - 1 ) {
            CLOG.E( "linkedlist index {0} offset!!", index );
            return null;
        }
        if ( index < 0 ) {
            index += this._size + 1;
        }
        if ( index == 0 ) {
            return this.addFirst( element );
        } else if ( index == this._size ) {
            return this.addLast( element );
        }

        let after = this.getNode( index - 1 );
        let before = this.getNode( index );
        let newnode = new CLinkedNode<T>();
        newnode.data = element;
        newnode.prev = after;
        newnode.next = before;
        after.next = newnode;
        before.prev = newnode;
        this._size++;
    }

    /**
     * 移除指定序号的节点
     * @param index
     * @returns
     * @memberof CLinkedList
     */
    public removeAt( index: number ): CLinkedNode<T> {
        // 安全检查
        if ( index >= this._size || index <= -this._size - 1 ) {
            CLOG.E( "linkedlist index {0} offset!!", index );
            return null;
        }
        if ( index < 0 ) {
            index += this._size;
        }
        if ( index == 0 ) {
            return this.removeFirst();
        } else if ( index == this._size - 1 ) {
            return this.removeLast();
        }
        let after = this.getNode( index + 1 );
        let node = this.getNode( index );
        let before = this.getNode( index - 1 );
        node.prev = null;
        node.next = null;
        after.prev = before;
        before.next = after;
        this._size--;
        return node;
    }

    /**
     * 删除指定数据
     * @param element
     * @returns
     * @memberof CLinkedList
     */
    public remove( element: T ): CLinkedNode<T> {
        let node = this._first;
        do {
            if ( node.data === element ) {
                if ( node == this._last ) {
                    this._last = this._last.prev;
                } else if ( node == this._first ) {
                    this._first = this._first.next;
                }
                let before = node.prev;
                let after = node.next;
                before != null && ( before.next = after );
                after != null && ( after.prev = before );
                node.next = null;
                node.prev = null;
                this._size--;
                return node;
            }
            node = node.next;
        } while ( node != null );
        return null;
    }

    /**
     * 获取对象索引
     * @param element
     * @returns
     * @memberof CLinkedList
     */
    public getIndex( element: T ): number {
        let node = this._first;
        let index = 0;
        do {
            if ( node.data == element ) {
                return index;
            }
            node = node.next;
            index++;
        } while ( node != null );
        return -1;
    }

    /**
     * 遍历执行
     * @param caller
     * @param
     * @memberof CLinkedList
     */
    public foreach( caller: ( item: CLinkedNode<T> ) => void ): void {
        if ( this._size == 0 ) return;
        let node = this._first;
        do {
            caller( node );
            node = node.next;
        } while ( node != null );
    }

    /**
     * toString方法
     * @returns
     * @memberof CLinkedList
     */
    public toString(): string {
        if ( this._size == 0 ) return "";
        let node = this._first;
        let str = CTools.formatString( "size:{0} | first:{1} last:{2} | all:", this._size, this._first.data, this._last.data );
        do {
            str += node.data + ",";
            node = node.next;
        } while ( node != null );
        return str;
    }

    /**
     * 获取大小
     * @readonly
     * @memberof CLinkedList
     */
    public get size(): number {
        return this._size;
    }

    /**
     * 第一个元素
     * @readonly
     * @memberof CLinkedList
     */
    public get first(): CLinkedNode<T> { return this._first; }

    /**
     * 最后一个元素
     * @readonly
     * @memberof CLinkedList
     */
    public get last(): CLinkedNode<T> { return this._last; }

}
