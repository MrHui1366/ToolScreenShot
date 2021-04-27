import { CobjPos, CobjSize } from "../core/CData";
import CTime from "./CTime";

/**
 * 项目工具类
 */
export default class Common {
    /** 随机数  0-9 */
    public static RandomInt0_9(): number {
        let num = Math.random() * 10;
        num = Math.floor( num );
        return ( num % 10 );
    }

    /** 
     * 随机任意数
     * @param min  最小区间值
     * @param max  最大区间值
     */
    public static RandomInt( min: number, max: number ): number {
        let range = max - min; //区间值
        let randNum = Math.random(); //随机数0~1
        return Math.floor( min + Math.round( randNum * range ) );
    }

    /** 数据循环,遍历一个对象，用"&" 号连接 */
    public static formatData( data ): string {
        let dataStr = "";
        Object.keys( data ).forEach( function ( key ) {
            dataStr += key + "=" + data[ key ] + "&";
        } );
        dataStr = dataStr.substring( 0, dataStr.lastIndexOf( '&' ) );
        return dataStr;
    }

    /** 
     * 能量文本换算，1000mg自动转换为1克，1000克转换为1kg，1000Kg自动转换为1T
     * (保留小数点后1位数)
     */
    public static math_matrixing( n: number ): string {
        const si = [
            { value: 1, symbol: "mg" },
            { value: 1E3, symbol: "g" },
            { value: 1E6, symbol: "kg" },
            { value: 1E9, symbol: "T" },
        ];
        //const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;//正则表达式，防止小数点后面循环小数
        let i: number;
        for ( i = si.length - 1; i > 0; i-- ) {
            if ( n >= si[ i ].value ) {
                break;
            }
        }
        let str = ( n / si[ i ].value ).toString();
        if ( str.length > 3 ) {
            let index = str.indexOf( '.' );
            str = str.substring( 0, index + 2 );
        }
        str += si[ i ].symbol;
        return str;
    }

    /**
     * 设置一个UI目标尺寸为全屏
     * @param target 要设置全屏的目标
     */
    public static setFullSize( target: Laya.UIComponent | Laya.View ): void {
        target.top = 0;
        target.bottom = 0;
        target.left = 0;
        target.right = 0;
        target.width = Laya.stage.width;
        target.height = Laya.stage.height;
    }

    /**
     * 将能量球数值，换算成string数组，值和单位
     * 返回的数组第一个值：能量数值，第二个值：单位
     */
    public static math_matrixing_Arr( n: number ): string[] {
        const si = [
            { value: 1, symbol: "mg" },
            { value: 1E3, symbol: "g" },
            { value: 1E6, symbol: "kg" },
            { value: 1E9, symbol: "T" },
        ];
        //const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;//正则表达式，防止小数点后面循环小数
        let i: number;
        for ( i = si.length - 1; i > 0; i-- ) {
            if ( n >= si[ i ].value ) {
                break;
            }
        }
        let str = ( n / si[ i ].value ).toString();
        if ( str.length > 3 ) {
            let index = str.indexOf( '.' );
            str = str.substring( 0, index + 2 );
        }

        let str_Arr: string[] = new Array();
        str_Arr.push( str );
        str_Arr.push( si[ i ].symbol );
        return str_Arr;
    }

    /** 获取浏览器ril地址参数的方法 */
    public static getQueryString( name: string ) {
        let reg = new RegExp( "(^|,|&|\\?)" + name + "=([^&]*)(&|$)" );
        let r = window.location.search.substr( 1 ).match( reg );
        if ( r != null ) return unescape( r[ 2 ] ); return null;
    }

    /**
     * 时间秒转换为H：M：S  例如：06:00:00
     * @param result   时间：秒 
     * @param isSHowAll 是否显示"时"
     */
    public static formatSeconds( result: number, isSHowAll: Boolean ): string {
        let h = Math.floor( result / 3600 ) < 10 ? '0' + Math.floor( result / 3600 ) : Math.floor( result / 3600 );
        let m = Math.floor( ( result / 60 % 60 ) ) < 10 ? '0' + Math.floor( ( result / 60 % 60 ) ) : Math.floor( ( result / 60 % 60 ) );
        let s = Math.floor( ( result % 60 ) ) < 10 ? '0' + Math.floor( ( result % 60 ) ) : Math.floor( ( result % 60 ) );
        let str: string = "";
        if ( isSHowAll ) {
            //时间最大是9999小时
            if ( Number( h ) >= 9999 ) {
                h = 9999;
            }
            str = h + ":" + m + ":" + s;
        }
        else {
            //判断有没有小时
            let h_type: number = Number( h );
            if ( h_type > 0 ) {
                str = h + ":" + m + ":" + s;
            } else {
                str = m + ":" + s;
            }
        }
        return str;
    }

    /**
     * 时间毫秒转换为H: M: S: Ms 例如：99:06:01:98
     * @param result  时间：毫秒
     */
    public static formatSecondMS( result: number ): string {
        let isShowH: boolean = false;
        let h = Math.floor( result / 1000 / 3600 );
        if ( h >= 1 ) {
            isShowH = true;
        }
        let strH = h < 10 ? '0' + h : h;
        let m = Math.floor( ( result / 1000 / 60 % 60 ) );
        let strM = m < 10 ? '0' + m : m;
        let s = Math.floor( ( result / 1000 % 60 ) );
        let strS = s < 10 ? '0' + s : s;
        let ms = Math.floor( ( result % 1000 ) );
        if ( ms > 100 ) { ms = Math.floor( ms / 10 ) };
        let strMS = ms < 10 ? '0' + ms : ms;
        let str: string = strM + ":" + strS + ":" + strMS;
        return isShowH ? strH + ":" + str : str;
    }

    /**
     * 时间毫秒转换为D: H: M: S: Ms 例如：1天:23时:59分:59秒
     * @param result  时间：毫秒
     */
    public static formatSecondDHMS( result: number ): string {
        let days = Math.floor( result / ( 1000 * 60 * 60 * 24 ) );
        let hours = Math.floor( result % ( 1000 * 60 * 60 * 24 ) / ( 1000 * 60 * 60 ) );
        let minutes = Math.floor( result % ( 1000 * 60 * 60 ) / ( 1000 * 60 ) );
        let seconds = Math.floor( result % ( 1000 * 60 ) / 1000 );
        return days + " 天 " + hours + " 时 " + minutes + " 分 ";
    }

    /**
     * 秒转换为时 例：1.5h 或54min
     * @param seconds 时间：秒
     * @parm  isCH 是否显示汉字
     */
    public static formatH_Min( seconds: number, isCH: Boolean ): string {
        let str: string;
        if ( !isCH ) {
            str = ( seconds / 3600 ) >= 1 ? ( seconds / 3600 ).toFixed( 1 ) + "h" : ( seconds / 60 ).toFixed( 0 ) + "min";
        } else {
            str = ( seconds / 3600 ) >= 1 ? ( seconds / 3600 ).toFixed( 1 ) + "小时" : ( seconds / 60 ).toFixed( 0 ) + "分";
        }
        return str;
    }

    /**
     * 秒转换为时分 例：1小时6分
     * @param seconds 时间：秒
     */
    public static format_H_M( seconds: number ) {
        let hours = Math.floor( seconds % ( 3600 * 24 ) / ( 3600 ) );
        let minutes = Math.floor( seconds % ( 3600 ) / ( 60 ) );
        return hours + "小时" + minutes + "分";
    }

    /**
     * 根据时间戳显示星期
     * @param time 时间Date
     */
    public static byStampShowWeek( time: Date ): string {
        let weekDay = [ "星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ];
        let s_week: string = ( weekDay[ time.getDay() ] );
        return s_week;
    }

    /**
     * 将对象本地坐标转换世界坐标点
     * @param obj 转换坐标的对象
     */
    public static localToGlobalPoint( obj: Laya.Image | Laya.Sprite ) {
        //获取最终目标对象
        let pointData: CobjPos = new CobjPos();
        let endPoint: Laya.Point = obj.localToGlobal( new Laya.Point( 0, 0 ) );
        //最终位置 =世界坐标X + X轴偏移量
        let endX = endPoint.x + ( obj.width / 2 );
        let endY = endPoint.y + ( obj.height / 2 );
        pointData.x = endX;
        pointData.y = endY;
        return pointData;
    }

    /**
     * 将本地坐标系坐标转转换到父容器坐标系
     * @param obj 转换坐标的对象
     */
    public static localToParentPoint( obj: Laya.Image | Laya.Sprite ) {
        //获取最终目标对象
        let pointData: CobjPos = new CobjPos();
        let endPoint: Laya.Point = obj.toParentPoint( new Laya.Point( 0, 0 ) );
        //最终位置 =世界坐标X + X轴偏移量
        let endX = endPoint.x + ( obj.width / 2 );
        let endY = endPoint.y + ( obj.height / 2 );
        pointData.x = endX;
        pointData.y = endY;
        return pointData;
    }

    /**
     * 按键保护
     * @param btn  按键
     * @param time 等待秒数,如果不填，默认为1秒
     */
    public static btn_Protect( btn: any, time?: number ) {
        btn.mouseEnabled = false;
        if ( !time ) { time = 1 };
        Laya.timer.once( time * 1000, this, () => {
            btn.mouseEnabled = true;
        } );
    }

    /**
     * 全局按键保护
     * @param time 等待秒数,如果不填，默认为1秒
     */
    public static btn_ProtectGlobal( time?: number ) {
        Laya.MouseManager.enabled = false;
        if ( !time ) { time = 1 };
        Laya.timer.once( time * 1000, this, () => {
            Laya.MouseManager.enabled = true;
        } );
    }

    /**
     * 设置边缘发光滤镜
     * @param obj  发光对象
     * @param color  颜色
     * @param value 边缘发光值
     */
    public static shineFilter( obj: Laya.Sprite, color: string, value: number ) {
        //创建一个发光滤镜
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter( color, value, 0, 0 );
        obj.filters = [ glowFilter ];
    }

    /**
     * 颜色滤镜
     * @param obj 添加滤镜的对象
     * @param colorMat  颜色矩阵
     */
    public static colorFilter( obj: Laya.Sprite, colorMat: Array<number> ) {
        let grayscaleFilter: Laya.ColorFilter = new Laya.ColorFilter( colorMat );
        obj.filters = [ grayscaleFilter ];
    }

    /**
     * RGB颜色矩阵变换
     * @param rgb 颜色值,数组长度3
     */
    public static colorRGBMatrixing( rgb: number[] ): number[] {
        if ( !rgb || rgb.length < 3 ) { return; }
        let colorMatrix = [
            rgb[ 0 ] / 255, 0, 0, 0, 0, //R
            0, rgb[ 1 ] / 255, 0, 0, 0, //G
            0, 0, rgb[ 2 ] / 255, 0, 0, //B
            0, 0, 0, 1, 0, //A
        ]
        return colorMatrix;
    }

    /**
     * 比较两个时间戳是否为同一天 
     * @param a 时间戳（秒）
     * @param b 时间戳（秒）
     */
    public static twoStampIsSameDay( a: number, b: number ): boolean {
        let strA = CTime.formatTime( new Date( a * 1000 ), "yyyy/MM/dd" );
        let strB = CTime.formatTime( new Date( b * 1000 ), "yyyy/MM/dd" );
        if ( strA == strB ) {
            return true;
        }
        return false;
    }

    /**
     * 替换固定字符串中的固定内容
     * @param source 需要替换的字符串
     * @param obj 需要替换的内容，可以是多个 例如：需要在表中标明$1 $2 ...
     * @returns 返回替换后的新字符串
     */
    public static formatReplaceStr( source: string, ...obj ): string {
        let i: number = 0;
        for ( i = 0; i < obj.length; i++ ) {
            source = source.replace( "$" + ( i + 1 ), obj[ i ] );
        }
        return source;
    }

    /**
     * 排除特殊字符,html正则转义方法
     * @param str 需要筛选的字符串
     */
    public static htmlEscapeStr( str ) {
        return str.replace( /[<>&"]/g, function ( c ) {
            return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', '': '&nbsp;' }[ c ];
        } );
    }

    /**
     * 重组html文本字符串
     * @param str 文本字符串
     * @param colorStr 颜色字符串
     */
    public static makeHtmlStr( str: string, colorStr: string, attrData?: any ): string {
        // style='font-family:kule2016_2' 
        let contentStr: string = "<span color='" + colorStr + "'";
        ( attrData && attrData.align ) && ( contentStr += " style='align:" + attrData.align + "'" );
        contentStr += ">" + str + "</span>";
        return contentStr;
    }

    /**
     * 重组图片类型的html文本字符串
     * @param imgUrl 图片路径
     * @param attrData 标签属性数据 
     */
    public static makeHtmlImgStr( imgUrl: string, attrData: any ) {
        let str = "<img src='" + imgUrl + "'";
        ( attrData.width ) && ( str += " width='" + attrData.width + "px'" );
        ( attrData.height ) && ( str += " height='" + attrData.height + "px'" );
        str += "></img>";
        return str;
    }

    /**
     * 过滤字符串中表情符号
     * @param str 需要截断的字符串
     * @param maxChars 保留的汉字长度
     * @param suffix 添加的后缀 （注意，如果后缀不为null或者'' ，则要占用一个汉字的位置
     */
    public static strClamp( str, maxChars, suffix ) {
        let toCodePoint = function ( unicodeSurrogates ) {
            let r = [], c = 0, p = 0, i = 0;
            while ( i < unicodeSurrogates.length ) {
                let pos = i;
                c = unicodeSurrogates.charCodeAt( i++ );//返回位置的字符的 Unicode 编码 
                if ( c == 0xfe0f ) {
                    continue;
                }
                if ( p ) {
                    let value = ( 0x10000 + ( ( p - 0xD800 ) << 10 ) + ( c - 0xDC00 ) );
                    r.push( {
                        v: value,
                        pos: pos,
                    } ); //计算4字节的unicode
                    p = 0;
                } else if ( 0xD800 <= c && c <= 0xDBFF ) {
                    p = c; //如果unicode编码在oxD800-0xDBff之间，则需要与后一个字符放在一起
                } else {
                    r.push( {
                        v: c,
                        pos: pos
                    } ); //如果是2字节，直接将码点转为对应的十六进制形式
                }
            }
            return r;
        }

        suffix = suffix == null ? '...' : suffix;
        maxChars *= 2;

        let codeArr = toCodePoint( str );
        let numChar = 0;
        let index = 0;
        for ( let i = 0; i < codeArr.length; ++i ) {
            let code = codeArr[ i ].v;
            let add = 1;
            if ( code >= 128 ) {
                add = 2;
            }

            //如果超过了限制，则按上一个为准
            if ( numChar + add > maxChars ) {
                break;
            }
            index = i;
            //累加
            numChar += add;
        }
        if ( codeArr.length - 1 == index ) {
            return str;
        }
        let more = suffix ? 1 : 0;
        return str.substring( 0, codeArr[ index - more ].pos + 1 ) + suffix;
    }


    /**
     * 截图
     * @param object 截图的对象
     * @param width  宽
     * @param height 高
     * @param offx   偏移X
     * @param offy   偏移y
     */
    public static screenShor( object: Laya.Sprite, width: number, height: number, offx: number, offy: number ): string {
        let pictrue: Laya.HTMLCanvas = object.drawToCanvas( width, height, offx, offy );
        let dataUrl = pictrue.toBase64( "image/png", 0.9 );
        return dataUrl;
    }

    /**
     * 绘画圆角矩形
     * @param	graghics 	Graghics对象
     * @param	pos			开始绘制的x,y轴位置
     * @param	size		矩形宽,高
     * @param	roundRadius	圆角半径
     * @param	fillColor	填充颜色
     * @param	borderColor	边框填充颜色
     * @param	borderWidth 边框大小
     * @return  DrawPathCmd  对象
     */
    public static drawCircle( graghics: Laya.Graphics, pos: CobjPos, size: CobjSize, roundRadius: number, fillColor: String,
        borderColor: string = null, borderWidth: number = 0 ): Laya.DrawPathCmd {
        let paths = [];
        paths.push( [ "moveTo", roundRadius, 0 ] );
        paths.push( [ "lineTo", size.width - roundRadius, 0 ] );
        paths.push( [ "arcTo", size.width, 0, size.width, roundRadius, roundRadius ] );
        paths.push( [ "lineTo", size.width, size.height - roundRadius ] );
        paths.push( [ "arcTo", size.width, size.height, size.width - roundRadius, size.height, roundRadius ] );
        paths.push( [ "lineTo", roundRadius, size.height ] );
        paths.push( [ "arcTo", 0, size.height, 0, size.height - roundRadius, roundRadius ] );
        paths.push( [ "lineTo", 0, roundRadius ] );
        paths.push( [ "arcTo", 0, 0, roundRadius, 0, roundRadius ] );
        paths.push( [ "closePath" ] );
        let brush: Object = { fillStyle: fillColor };
        let pen: Object = { strokeStyle: borderColor, lineWidth: borderWidth };
        return graghics.drawPath( pos.x, pos.y, paths, brush, pen );
    }

    /**播放按钮缩放效果，支持子按钮一起缩放
     * @param selfBtn       自身按钮节点
     * @param scalX         x轴缩放值
     * @param scalY         y轴缩放值
     * @param eventName     点击事件名称
     * @param childBtnArr   子节点按钮额外参数数组，格式：[[btn,btn.x,btn.pivotX],...]
     */
    public static playBtnScaleAni( selfBtn: Laya.Image, scalX: number, scalY: number, eventName: string, childBtnArr?: Array<Laya.Image> ) {
        let scaleTime = 100;
        Laya.Tween.to( selfBtn, { scaleX: scalX, scaleY: scalY }, scaleTime );
        if ( childBtnArr ) {
            for ( let i = 0; i < childBtnArr.length; i++ ) {
                let btnInfos = childBtnArr[ i ];
                let subBtn = btnInfos[ 0 ];
                //设置子按钮X轴心点坐标
                if ( subBtn.visible ) {
                    //设置X轴心点跟随父节点按钮X轴心点
                    if ( eventName == Laya.Event.MOUSE_DOWN ) {
                        let isRight = subBtn.x > selfBtn.width / 2 ? -1 : 1;
                        subBtn.pivotX = isRight * Math.abs( subBtn.x - selfBtn.width / 2 - subBtn.width / 2 );
                        subBtn.x = subBtn.x + subBtn.pivotX - subBtn.width / 2;
                    }
                    //缩放动画
                    Laya.Tween.to( subBtn, {
                        scaleX: scalX, scaleY: scalY, complete: Laya.Handler.create( null, () => {
                            //恢复按钮X轴心点
                            if ( eventName == Laya.Event.MOUSE_OUT ) {
                                subBtn.x = btnInfos[ 1 ];
                                subBtn.pivotX = btnInfos[ 2 ];
                            }
                        } )
                    }, scaleTime );
                }
            }
        }
    }

    /** oss头像图片自定义裁剪 */
    public static ossPictrueClip( avatar: string ) {
        let clipData = '?x-oss-process=image/resize,m_fill,w_100,h_100/format,png';
        let imgUrl = avatar + clipData;
        return imgUrl;
    }

    /** oss头像图片内切圆裁剪 */
    public static ossPictrueIncircle( avatar: string ) {
        let clipData = '?x-oss-process=image/resize,m_fill,w_100,h_100,image/circle,r_100/format,png';
        let imgUrl = avatar + clipData;
        return imgUrl;
    }

    /** 
     * 小游戏通关计时器
     * @param data 时长(毫秒)
     */
    public static gameCounter( data: number ): string {
        let unitMatrix: string;
        let oneHourS = 60 * 60 * 1000;
        if ( data < oneHourS ) {
            //1.小于1h内的,显示m,s
            let m = Math.floor( ( data / 1000 / 60 % 60 ) );
            let strM = m < 10 ? '0' + m : m;
            let s = Math.floor( ( data / 1000 % 60 ) );
            let strS = s < 10 ? '0' + s : s;
            unitMatrix = strM + "m:" + strS + "s";
        } else if ( data <= 24 * oneHourS ) {
            //2.小于24h内的，显示h,m
            let h = Math.floor( ( data / 1000 / 3600 ) );
            let strH = h < 10 ? '0' + h : h;
            let m = Math.floor( ( data / 1000 / 60 % 60 ) );
            let strM = m < 10 ? '0' + m : m;
            unitMatrix = strH + "h:" + strM + "m";
        } else {
            //3.大于24h时以上的显示 24h
            unitMatrix = "24h+"
        }
        return unitMatrix;
    }

}
