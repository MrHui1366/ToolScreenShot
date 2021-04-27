import { SettingData } from './../../Data/SettingData';
import CLOG from "../utils/CLOG";
import { ErrorDataManager } from "../../Data/TableData/ErrorTableData";
import PopUp from '../../View/dialog/PopUp';
import WaitingUI from '../../View/view/WaitingUI';
import { TimingInterface } from '../../Interface/TimingInterface';

/**
 * HTTP 通讯 异步队列 任务
 */
export class CHTTPTask {

    /** Http 请求地址 */
    public url: string;

    /** 请求对象 */
    public data: string;

    /** 回调函数 参数1 是否成功  参数2 服务器返回 body */
    public caller: ( boolean, string ) => void;

    /** 是否显示waiting */
    public showWaiting: boolean;
}

/** 
 * CoffeeBean
 * HTTP请求库
 */
export class CHTTP {

    /** 任务队列 */
    private static taskList: Array<CHTTPTask> = new Array<CHTTPTask>();

    /** 是否正在运行 */
    private static hasRun: boolean = false;

    /**
     * 发送请求
     * @param URL 请求地址
     * @param data 发送的数据对象
     * @param showWating 是否需要显示Waiting
     * @param handler 回调函数
     */
    public static Post( url: string, data: string, showWating: boolean = true, handler: ( boolean, object ) => void ): void {
        let task = new CHTTPTask();
        task.url = url;
        task.data = data;
        task.caller = handler;
        task.showWaiting = showWating;
        // 添加到任务队列
        this.taskList.push( task );
        CLOG.I( "1.http running state:{0}", this.hasRun );
        // 若处理器没有启动
        if ( !this.hasRun ) {
            // 启动他
            this.handleHTTP();
        }
    }

    /**
     * 处理HTTP请求
     */
    private static async handleHTTP() {
        while ( this.taskList.length > 0 ) {
            CLOG.I( "2.http running state:{0}", this.hasRun );
            this.hasRun = true;
            CLOG.I( "3.http running state:{0}", this.hasRun );
            // 执行任务队列,移除第一个元素
            let task = this.taskList.shift();
            let url = task.url;
            let data = task.data;
            let caller = task.caller;

            // 等待异步任务
            let result: [ boolean, string ] = await new Promise<[ boolean, string ]>( ( resolve, reject ) => {
                // 需要显示Loading则显示
                if ( task.showWaiting ) {
                    WaitingUI.show();
                }

                CLOG.I( "== HTTP REQUEST ==" );
                CLOG.I( "URL:" + url );
                CLOG.I( "data:" + data );

                let http_req = new XMLHttpRequest();
                http_req.timeout = 8000;//设置超时时间
                http_req.ontimeout = () => {
                    this.hasRun = false
                    let ErrorData = ErrorDataManager.getInstance().getDataById( 15 );
                    PopUp.showUI( ErrorData.text, ErrorData.btn1, null, ( isOK ) => {
                        if ( SettingData.isloadingSend ) {
                            //连接超时，退出游戏
                            TimingInterface.getInstance().backToApp();
                        }
                        resolve( [ false, "" ] );
                    } )
                };
                http_req.onreadystatechange = () => {
                    CLOG.I( "state change => {0}", http_req.readyState );
                    if ( http_req.readyState == 4 ) {
                        // 需要显示Loading则隐藏
                        if ( task.showWaiting ) { WaitingUI.hide(); }
                        CLOG.I( "== HTTP RESPONSE ==" );
                        if ( http_req.status == 200 ) {
                            CLOG.I( "http request successful!!! now return to out async" );
                            resolve( [ true, http_req.responseText ] );
                        } else {
                            WaitingUI.hide();
                            this.hasRun = false
                            let ErrorData = ErrorDataManager.getInstance().getDataById( 8 );
                            PopUp.showUI( ErrorData.text, ErrorData.btn1, null, ( isOK ) => {
                                if ( SettingData.isloadingSend ) {
                                    //连接异常，退出游戏重进
                                    TimingInterface.getInstance().backToApp();
                                }
                                resolve( [ false, "" ] );
                            } );
                        }
                    }
                };
                http_req.open( "post", url, true );
                http_req.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded;charset=UTF-8" );
                http_req.send( data );
            } );

            CLOG.I( "call handler! result:{0} data:{1}", result[ 0 ], result[ 1 ] );
            // 异步执行结束，执行回调，执行成功才回调
            if ( result[ 0 ] ) {
                this.hasRun = false;//这一行位置不能改变,否则分帧加载会报错
                if ( caller ) caller( result[ 0 ], JSON.parse( result[ 1 ] ) );
            }
        }
        this.hasRun = false;
        CLOG.I( "http running state => false" );
    }
}