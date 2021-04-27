import CLOG from "../utils/CLOG";

/** 资源加载接口 */
export interface ResInfo {
    /** 地址 不可为空 */
    url: string;

    /** 类型 可为空 */
    type?: string;

    /**是否缓存 */
    cache?: boolean;

    /**分组名称 */
    group?: string;

    /**是否忽略缓存强制加载 */
    ignoreCache?: boolean;

    useWorkerLoader?: boolean;
    originalUrl?: string;
    createCache?: boolean;
    createConstructParams?: Array<any>;
    createPropertyParams?: any;
}

/** 
 * 资源管理类
 */
export class CRes {
    /**
     * 资源加载
     * @param resArray 资源数组
     * @param completeHandler  加载结束回调
     * @param progressHandler  加载进度回调
     */
    public static cPreload( resArray: string | string[] | ResInfo[], completeHandler: Laya.Handler, progressHandler: Laya.Handler ) {
        Laya.loader.retryNum = 3;
        Laya.loader.retryDelay = 3;
        Laya.loader.on( Laya.Event.ERROR, this, this.onPreloadError );
        Laya.loader.load( resArray, completeHandler, progressHandler );
    }

    /**异常处理事件 */
    static onPreloadError( arg0: any, arg1: any, arg2: any ): any {
        CLOG.E( 'preload error {' + arg0 + " " + arg1 + " " + arg2 + "}" );
    }

    /**
     * 读取并返回 JSON 对象
     * 若该对象没有缓存
     * 则自动缓存他
     * 并返回
     */
    public static async loadJSONAsync<T>( url: string ): Promise<T> {
        let obj = Laya.loader.getRes( url );
        if ( !obj ) {
            obj = await this.loadResAsync( url, Laya.Loader.JSON );
        }
        return obj as T;
    }

    /**
     * 读取并返回 贴图 对象
     * 若该对象没有缓存
     * 则自动缓存他
     * 并返回
     */
    public static async loadImageAsync( url: string ): Promise<Laya.Texture> {
        let obj = Laya.loader.getRes( url );
        if ( !obj ) {
            obj = await this.loadResAsync( url, Laya.Loader.IMAGE );
        }
        return obj as Laya.Texture;
    }

    /**
     * 读取并返回 文本 对象
     * 若该对象没有缓存
     * 则自动缓存他
     * 并返回
     */
    public static async loadTextAsync( url: string ): Promise<string> {
        let obj = Laya.loader.getRes( url );
        if ( !obj ) {
            obj = await this.loadResAsync( url, Laya.Loader.TEXT );
        }
        return obj as string;
    }

    /**
     * 读取并返回 声音 对象
     * 若该对象没有缓存
     * 则自动缓存他
     * 并返回
     */
    public static async loadSoundAsync( url: string ): Promise<Laya.Sound> {
        let obj = Laya.loader.getRes( url );
        if ( !obj ) {
            obj = await this.loadResAsync( url, Laya.Loader.SOUND );
        }
        return obj as Laya.Sound;
    }

    /**
    * 读取并返回 JSON 对象
    * 若该对象没有缓存
    * 则返回 null
    */
    public static loadJSON<T>( url: string ): T {
        let obj = Laya.loader.getRes( url );
        if ( obj ) {
            return obj as T;
        } else {
            return null;
        }
    }

    /**
     * 读取并返回 贴图 对象
     * 若该对象没有缓存
     * 则返回 null
     */
    public static loadImage( url: string ): Laya.Texture {
        let obj = Laya.loader.getRes( url );
        if ( obj ) {
            return obj as Laya.Texture;
        } else {
            return null;
        }
    }

    /**
     * 读取并返回 文本 对象
     * 若该对象没有缓存
     * 则返回 null
     */
    public static async loadText( url: string ): Promise<string> {
        let obj = Laya.loader.getRes( url );
        if ( obj ) {
            return obj as string;
        } else {
            return null;
        }
    }

    /**
     * 读取并返回 声音 对象
     * 若该对象没有缓存
     * 则返回 null
     */
    public static loadSound( url: string ): Laya.Sound {
        let obj = Laya.loader.getRes( url );
        if ( obj ) {
            return obj as Laya.Sound;
        } else {
            return null;
        }
    }

    /**
     * 异步加载（缓存）资源
     */
    public static async loadResAsync( resURL: string, resType: string ): Promise<any> {
        let func = ( resolve, reject ) => {
            Laya.loader.load( resURL, Laya.Handler.create( this, () => {
                let obj = Laya.loader.getRes( resURL );
                resolve( obj );
            } )
            );
            Laya.loader.on( Laya.Event.ERROR, this, ( errURL: string ) => { reject( errURL ); } );
        }

        return new Promise<any>( func );
    }





}
