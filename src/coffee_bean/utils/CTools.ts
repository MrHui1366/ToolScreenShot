
/**
 * 工具模块
 * 包括工具函数
 */
export default class CTools {

    /**
     * 显示对象的所有组成
     * @param obj 源对象
     */
    public static displayObject( obj: object, prefixCount: number = 0 ): void {
        let prefix = " ".repeat( prefixCount );
        for ( let key in obj ) {
            if ( obj[ key ] instanceof Object ) {
                this.displayObject( obj[ key ], prefixCount + 4 );
            }
            console.log( prefix + "key:" + key + "   value:" + obj[ key ] );
        }
    }

    /**
     * 拷贝源对象身上的 键值 到目标对象身上
     * 交集拷贝 示例:
     * 源对象   A { k1=10,k2=20,k3=30 };
     * 目标对象 B { k2=50,k3=90,k4=130};
     * 执行后   B { k2=20,k3=30,k4=130};
     * @param sourceObj 源对象
     * @param targetObj 目标对象
     */
    public static copyObject( sourceObj: object, targetObj: object ): void {
        for ( let key in sourceObj ) {
            if ( targetObj[ key ] != undefined ) {
                targetObj[ key ] = sourceObj[ key ];
            }
        }
    }

    /**
     * 克隆方法(深拷贝)
     * 不包含(非对象、时间、序列化)拷贝
     * @param sourceObj 源对象
     */
    public static clone( sourceObj: object ): object {
        if ( sourceObj === null ) return null
        if ( typeof sourceObj !== 'object' ) return sourceObj;
        if ( sourceObj.constructor === Date ) return new Date( <Date> sourceObj );
        if ( sourceObj.constructor === RegExp ) return new RegExp( <RegExp> sourceObj );
        let newObj = sourceObj.constructor();  //保持继承链
        for ( let key in sourceObj ) {
            if ( sourceObj.hasOwnProperty( key ) ) {   //不遍历其原型链上的属性
                let val = sourceObj[ key ];
                newObj[ key ] = typeof val === 'object' ? arguments.callee( val ) : val; // 使用arguments.callee解除与函数名的耦合
            }
        }
        return newObj;
    }

    /**
     * 简单对象拷贝(深拷贝)
     * 会忽略undefined
     * 不能序列化函数
     * 不能解决循环引用的对象
     * 对象是函数时会出问题,注意！！！
     * @param sourceObj 源对象
     */
    public static jsonClone( sourceObj: object ): object {
        let str = JSON.stringify( sourceObj ); //序列化对象
        let newobj = JSON.parse( str ); //还原
        return newobj;
    }

    /** 
     * 简单数组深拷贝(等同concat)
     * 仅适用于对不包含引用对象的一维数组的深拷贝
     * @param arr 源数组
     */
    public static arrClone( arr: any[] ): any[] {
        return arr.slice();
    }

    /**
     * 递归克隆,适用复杂对象(深拷贝)
     * @param sourceObj 源数组/对象
     */
    public static deepClone( sourceObj: object ) {
        // 判断复制的目标是数组还是对象
        const target = sourceObj.constructor === Array ? [] : {};
        // 遍历目标
        for ( let keys in sourceObj ) {
            if ( sourceObj.hasOwnProperty( keys ) ) {
                // 如果值是对象，就递归一下
                if ( sourceObj[ keys ] && typeof sourceObj[ keys ] === 'object' ) {
                    target[ keys ] = sourceObj[ keys ].constructor === Array ? [] : {};
                    target[ keys ] = CTools.deepClone( sourceObj[ keys ] );
                } else { // 如果不是，就直接赋值
                    target[ keys ] = sourceObj[ keys ];
                }
            }
        }
        return target;
    }

    /** 
     * 对比2个数组，取出2个数组中相同的元素 
     * @param arr1 数组1
     * @param arr2 数组2
     */
    public static getArrEqual( arr1: any[], arr2: any[] ) {
        let newArr = [];
        for ( let j = 0; j < arr1.length; j++ ) {
            for ( let k = 0; k < arr2.length; k++ ) {
                if ( arr1[ j ] === arr2[ k ] ) {
                    newArr.push( arr1[ j ] );
                }
            }
        }
        return newArr;
    }

    /** 对比2个数组，去除2个数组中不相同的元素 */
    public static getArrDiff( arr1: any[], arr2: any[] ) {
        return arr1.concat( arr2 ).filter( function ( v, i, arr ) {
            return arr.indexOf( v ) === arr.lastIndexOf( v );
        } );
    }

    /** 手机设备屏幕震动 */
    public static vibration() {
        if ( navigator.vibrate ) {
            console.log( "支持设备震动" );
        }
        else {
            console.log( "不支持该设备震动" ); return;
        }
        navigator.vibrate( 800 );
        //震5秒，停0.3秒，在震4秒
        //示例：navigator.vibrate( [ 5000, 300, 4000 ] );
    }

    /**
     * UTF-8数组转字符串
     * @param array utf8数组
     */
    public static Utf8ArrayToStr( array: Array<number> ): string {
        var out, i, len, c;
        var char2, char3, char4;

        out = "";
        len = array.length;
        i = 0;
        while ( i < len ) {
            c = array[ i++ ];
            var pre = ( c >> 3 );
            if ( pre >= 0 && pre <= 15 ) {// 0xxxxxxx
                out += String.fromCharCode( c );
            } else if ( pre >= 24 && pre <= 27 ) {// 110x xxxx   10xx xxxx
                char2 = array[ i++ ];
                out += String.fromCharCode( ( ( c & 0x1F ) << 6 ) | ( char2 & 0x3F ) );
            } else if ( pre >= 28 && pre <= 29 ) {// 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[ i++ ];
                char3 = array[ i++ ];
                out += String.fromCharCode( ( ( c & 0x0F ) << 12 ) |
                    ( ( char2 & 0x3F ) << 6 ) |
                    ( ( char3 & 0x3F ) << 0 ) );
            } else if ( pre == 30 ) {//1111 0xxx  10xx xxxx  10xx xxxx 10xx xxxx
                char2 = array[ i++ ];
                char3 = array[ i++ ];
                char4 = array[ i++ ];
                out += String.fromCharCode(
                    ( ( c & 0x07 ) << 15 ) |
                    ( ( char2 & 0x3F ) << 12 ) |
                    ( ( char3 & 0x3F ) << 6 ) |
                    ( ( char4 & 0x3F ) << 0 ) );
            }
        }
        return out;
    }

    /** 二进制转换字符串 */
    public static binaryToStr( str ) {
        let result = [];
        let list = str.split( "/" );
        for ( let i = 0; i < list.length; i++ ) {
            let item = list[ i ];
            let asciiCode = parseInt( item, 2 );
            let charValue = String.fromCharCode( asciiCode );
            result.push( charValue );
        }
        return result.join( "" );
    }

    /**
     * 判断字符串是否为空
     * @param str  字符串
     */
    public static isEmptyOrNull( str: string ): boolean {
        if ( str == null || str.length == 0 ) {
            return true;
        }
        return false;
    }

    /*** 十六进制字符串转十进制数字 ***/
    public static hexStrtoDecNumber( hexstring: string ): number {
        let num = 0;
        for ( let i = 0; i < hexstring.length; i++ ) {
            const element = hexstring.charAt( i );
            num <<= 4;

            switch ( element ) {
                case 'A':
                case 'a':
                    num += 10;
                    break;
                case 'b':
                case 'B':
                    num += 11;
                    break;
                case 'c':
                case 'C':
                    num += 12;
                    break;
                case 'd':
                case 'D':
                    num += 13;
                    break;
                case 'e':
                case 'E':
                    num += 14;
                    break;
                case 'f':
                case 'F':
                    num += 15;
                    break;
                default:
                    num += parseInt( element );
                    break;
            }
        }
        return num;
    }

    /** 
     * 将一个字符串省略一定长度，以特定字符替代 
     * 如 
     *     CTools.omitStr('asdgadsgdf',3)  =>  'asd...';
     *     CTools.omitStr('asdgadsgdf',4 ,'*')  =>  'asdg***';
     *     CTools.omitStr('asdgadsgdf',5 ,'$' ,2)  =>  'asdga$$';
     * @param targetStr 目标字符串
     * @param omitStart 保留长度
     * @param replacestr 替换字符
     * @param replacelen 替换长度
     */
    public static omitStr( targetStr: string, omitStart: number, replacestr: string = '.', replacelen = 3 ): string {
        if ( targetStr.length <= omitStart ) {
            return targetStr;
        }
        let tail = replacestr.repeat( replacelen );
        return targetStr.substr( 0, omitStart ) + tail;
    }

    /**
     * 函数:格式化字符串
     * 参数：str:字符串模板； data:数据
     * 调用方式:formatString("api/values/{id}/{name}",{id:101,name:"test"});
     *         formatString("api/values/{0}/{1}",101,"test");
     */
    public static formatString( str: string, ...data ): string {
        if ( !str || data == undefined ) {
            return str;
        }

        if ( str.indexOf( "{0}" ) == -1 ) {
            for ( const item of data ) {
                for ( let key in item ) {
                    if ( item.hasOwnProperty( key ) ) {
                        str = str.replace( new RegExp( "\{" + key + "\}", "g" ), item[ key ] );
                    }
                }
            }
        } else {
            let args = arguments,
                reg = new RegExp( "\{([0-" + ( args.length - 1 ) + "])\}", "g" );
            return str.replace( reg, function ( match, index ) {
                return args[ index - ( -1 ) ];
            } );
        }
        return str;
    }
}