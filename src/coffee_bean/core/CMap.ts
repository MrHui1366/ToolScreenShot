
/*** 键值对 ***/
export interface KV<K, V> {

    /*** 键 ***/
    key: K;

    /*** 值 ***/
    value: V;
}

/*** 自定义Map类 ***/
export class CMap<K, V>{
    private data: Array<KV<K, V>>;

    public constructor () {
        this.data = new Array<KV<K, V>>();
    }

    /*** 设置键值对 ***/
    public set( key: K, value: V ) {

        let findex = this.data.findIndex( ( value, index, array ) => { return value.key == key; } );
        if ( findex != -1 ) {
            this.data[ findex ].value = value;
        } else {
            this.data.push( { "key": key, "value": value } );
        }
    }

    /*** 从map中获得数据 ***/
    public get( key: K ): V {
        let index = this.data.findIndex( ( value, index, array ) => { return value.key == key; } );
        if ( index != -1 ) {
            return this.data[ index ].value;
        }
        return null;
    }

    /*** 得到数量 ***/
    public get size(): number {
        return this.data.length;
    }

    /*** 获得键值对 ***/
    public getKV( index: number ): KV<K, V> {
        if ( index < 0 || index >= this.data.length ) {
            return null;
        }
        return this.data[ index ];
    }

    /*** 是否拥有此键值对 ***/
    public has( key: K ): boolean {
        let index = this.data.findIndex( ( value, index, array ) => { return value.key == key; } );
        return index != -1;
    }

    /*** 移除一个键 ***/
    public delete( key: K ): boolean {
        let index = this.data.findIndex( ( value, index, array ) => { return value.key == key; } );
        if ( index != -1 ) {
            this.data.splice( index, 1 );
        }
        return true;
    }
}