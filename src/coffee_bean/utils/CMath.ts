import { E_PrecentType } from "../core/CEnum";

/**
 * CoffeeBean
 * 数学库封装
 */
export default class CMath {
    /**
     * 在一个数字 num 前面补上一定数量的  prefix ，长度 = len
     * 返回字符串
     * 
     * 如  fixedNumber(123,5,"0") => "00123";
     * @param num  要补前缀的数字
     * @param len  限定长度
     * @param prefix  前缀字符
     */
    public static fixedNumber( num: number, len: number, prefix: string ): string {
        return ( Array( len ).join( prefix ) + num ).slice( -len );
    }

    /**
     * 限定一个数字在最小到最大值之间，返回限定后的值
     * @param num 要限定的数值
     * @param min 下限
     * @param max 上限
     */
    public static clamp( num: number, min: number, max: number ): number {
        if ( num < min )
            num = min;
        else if ( num > max )
            num = max;
        return num;
    }

    /**
     * 随机数封装，返回值 [min,max) 介于最小（包含），到最大之间（不包含）
     * @param max 最大值   （不包含）
     * @param min 最小值   （包含）
     */
    public static randFloat( max: number, min: number = 0 ): number {
        return Math.random() * ( max - min ) + min;
    }

    /**
     * 随机数封装，返回值 [Min,Max) 介于最小（包含），到最大之间（不包含）
     * @param max 最大值   （不包含）
     * @param min 最小值   （包含）
     */
    public static randInt( max: number, min: number = 0 ): number {
        return Math.floor( Math.random() * ( max - min ) + min );
    }

    /**
     * 随机数封装，返回 0-1之间的小数
     */
    public static rand_0_1(): number {
        return Math.random();
    }

    /**
     * 让一个角度标准化  归入 [0,360) 度之间
     * @param angle 角度
     */
    public static normalizeAngle( angle: number ): number {
        while ( angle >= 360 ) {
            angle -= 360;
        }

        while ( angle < 0 ) {
            angle += 360;
        }

        return angle;
    }

    /**
     * 把一个数字从当前的 min,max区间映射到 newMin , newMax区间
     * 例如
     *     remap(50,0,100,20,40) ===> 30
     * 释义 原数字 50  原区间 0-100 
     * 映射到新区间 20-40 
     * 返回数字30
     * 
     * @param num 要处理的数字
     * @param min 原缩放区间左值
     * @param max 原缩放区间右值
     * @param newMin 新区间左值
     * @param newMax 新区间右值
     */
    public static remap( num: number, min: number, max: number, newMin: number, newMax: number ): number {
        if ( num <= min ) { return newMin; }
        if ( num >= max ) { return newMax; }

        return ( num - min ) / ( max - min ) * ( newMax - newMin ) + newMin;
    }


    /**
     * 检查一个概率是否命中
     * @param ratio 概率
     * @param precentType 概率类型 默认为百分比
     */
    public static checkBingo( ratio: number, precentType: E_PrecentType = E_PrecentType.PRECENT_100 ): boolean {
        return this.randFloat( 0, precentType ) <= ratio;
    }

    /**
     * 随机打乱一个数组
     * @param array 泛型数组引用
     */
    public static shuffle<T>( array: Array<T> ) {
        for ( let i: number = 0; i < array.length; ++i ) {
            let targetPos = this.randInt( array.length );
            let temp: T = array[ i ];
            array[ i ] = array[ targetPos ];
            array[ targetPos ] = temp;
        }
    }

} 
