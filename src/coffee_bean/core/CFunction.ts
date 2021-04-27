
/**
 * 生成具有默认值的二维数组
 *
 * @export
 * @template T 泛型T
 * @param l1 第一维
 * @param l2 第二维
 * @param defaultValue 默认值
 */
export function makeArray2WithData<T>( l1: number, l2: number, defaultValue: T ): Array<Array<T>> {
    let ary = new Array<Array<T>>();
    for ( let i = 0; i < l1; i++ ) {
        ary[ i ] = new Array<T>();
        for ( let j = 0; j < l2; j++ ) {
            ary[ i ][ j ] = defaultValue;
        }
    }

    return ary;
}

/**
 * 生成具有默认值的一维数组
 *
 * @export
 * @template T 泛型T
 * @param l1 第一维
 * @param defaultValue 默认值
 * @returns
 */
export function makeArrayWithData<T>( l1: number, defaultValue: T ): Array<T> {
    let ary = new Array<T>();
    for ( let i = 0; i < l1; i++ ) {
        ary[ i ] = defaultValue;
    }
    return ary;
}
