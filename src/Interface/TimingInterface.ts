import { SettingData } from './../Data/SettingData';
import CLOG from "../coffee_bean/utils/CLOG";
import CSingleton from "../coffee_bean/core/CSingleton";
import { ErrorDataManager } from "../Data/TableData/ErrorTableData";
import PopUp from '../View/dialog/PopUp';

/**与Timing前端交互接口类*/
export class TimingInterface extends CSingleton {

    constructor () {
        super();
        this.localIosVersion();
        this.appPaySuccess();
        this.backToPrevious();
    }

    /** 接口调用失败弹窗 */
    private erroPop() {
        let ErrorData = ErrorDataManager.getInstance().getDataById( 22 );
        PopUp.showUI( ErrorData.text, ErrorData.btn1 );
    }

    //#region  Laya调用Timing前端接口

    /** 获取客户端版本号 */
    getAppVersionCode() {
        if ( Laya.Browser.onAndroid ) {
            try {
                SettingData.androidVs = Laya.Browser.window.android.getAppVersionCode();
                CLOG.I( "获取Android客户端版本号：{0}", SettingData.androidVs );
            } catch ( error ) {
                console.log( 'getAppVersionCode onAndroid -> error', error );
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.getAppVersionCode.postMessage( null );
            } catch ( error ) {
                console.log( 'getAppVersionCode onIOS-> error', Error );
            }
        }
    }

    /** 退出游戏 */
    backToApp() {
        if ( Laya.Browser.onAndroid ) {
            Laya.Browser.window.android.backToApp();
        }
        if ( Laya.Browser.onIOS ) {
            Laya.Browser.window.webkit.messageHandlers.backToApp.postMessage( null );
        }
    }

    /** 清理缓存机制 */
    clearCache() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.clearCache();
                CLOG.I( "Android缓存清理成功!" );
            } catch ( error ) {
                CLOG.I( "Android没有找到此方法!clearCache" );
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.clearCache.postMessage( null );
                CLOG.I( "Ios缓存清理成功!" );
            } catch ( error ) {
                CLOG.I( "Ios没有找到此方法!clearCache" );
            }
        }
    }

    /** 游戏内分享 */
    gameShare( data: any ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                let jsondata = JSON.stringify( data );
                Laya.Browser.window.android.gameShare( jsondata );
            } catch ( error ) {
                console.log( 'gameShare is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.gameShare.postMessage( data );
            } catch ( error ) {
                console.log( 'gameShare onIOS-> error', error );
                this.erroPop();
            }
        }
    }

    /** 
     * 截图分享，调用Timing客户端接口
     * @param logoPath 有二维码
     * @param path 无二维码 
     */
    shareImage( logoPath: string, path: string ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.shareImage( logoPath, path );
                CLOG.I( "Android图片分享成功!" );
            } catch ( error ) {
                CLOG.I( "Android没有找到此方法!shareImage" );
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                let data = {
                    logoPath: logoPath,
                    path: path,
                }
                Laya.Browser.window.webkit.messageHandlers.shareImage.postMessage( data );
                CLOG.I( "IOS图片分享成功!" );
            } catch ( error ) {
                CLOG.I( "IOS没有找到此方法!shareImage" );
            }
        }
    }

    /** 
     * 调用Timing客户端图片保存至相册
     * @param data base64图片信息
     */
    savePicToPhoto( data: string ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.savePicToPhoto( data );
            } catch ( error ) {
                console.log( 'savePicToPhoto onAndroid -> error', error );
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { pic: data }
            try {
                Laya.Browser.window.webkit.messageHandlers.savePicToPhoto.postMessage( _data );
            } catch ( error ) {
                console.log( 'savePicToPhoto onIOS-> error', Error );
            }
        }
    }

    /** 跳转我的积分页面 */
    enterMyIntegral() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterMyIntegral();
            } catch ( error ) {
                console.log( 'enterMyIntegral is null!onAndroid -> error', error );
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterMyIntegral.postMessage( null );
            } catch ( error ) {
                console.log( 'enterMyIntegral is null! onIOS-> error', Error );
            }
        }
    }

    /** 跳转连麦学习界面 */
    gotoOnlineTiming() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.gotoOnlineTiming();
            } catch ( error ) {
                console.log( 'gotoOnlineTiming is null!onAndroid -> error', error );
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.gotoOnlineTiming.postMessage( null );
            } catch ( error ) {
                console.log( 'gotoOnlineTiming is null! onIOS-> error', Error );
            }
        }
    }

    /**
     * 跳转用户个人主页
     * @param userID 用户ID
     */
    enterUser( userID: number ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterUser( userID );
            } catch ( error ) {
                console.log( 'enterUser is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { userID: userID }
            try {
                Laya.Browser.window.webkit.messageHandlers.enterUser.postMessage( _data );
            } catch ( error ) {
                console.log( 'enterUser is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /**
     * 跳转日记详情
     * @param feedID 日记ID
     */
    enterFeed( feedID: number ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterFeed( feedID );
                console.log( 'enterFeed is ok!' );
            } catch ( error ) {
                console.log( 'enterFeed is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { feedID: feedID }
            try {
                Laya.Browser.window.webkit.messageHandlers.enterFeed.postMessage( _data );
            } catch ( error ) {
                console.log( 'enterFeed is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转日记回复页面 */
    enterFeedReply( feed: string, replyID: number ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterFeedReply( feed, replyID );
                console.log( 'enterFeedReply is ok!' );
            } catch ( error ) {
                console.log( 'enterFeedReply is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                let data = {
                    feed: feed,
                    replyID: replyID,
                }
                Laya.Browser.window.webkit.messageHandlers.enterFeedReply.postMessage( data );
            } catch ( error ) {
                console.log( 'enterFeedReply is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转我的学习数据页面 */
    enterLearningData() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterLearningData();
            } catch ( error ) {
                console.log( 'enterLearningData is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterLearningData.postMessage( null );
            } catch ( error ) {
                console.log( 'enterLearningData is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转到聊天,需要判断是否是好友 */
    enterChat( userID: number, avatar?: string, name?: string ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                let data = { uid: userID, avatar: avatar, nickname: name };
                let jsonData = JSON.stringify( data );
                Laya.Browser.window.android.enterChat( jsonData );
            } catch ( error ) {
                console.log( 'enterChat is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { userID: userID }
            try {
                Laya.Browser.window.webkit.messageHandlers.enterChat.postMessage( _data );
            } catch ( error ) {
                console.log( 'enterChat is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转群详情页 */
    enterTeam( teamID: string, groupID: number, type: number ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterTeam( teamID, groupID, type );
            } catch ( error ) {
                console.log( 'enterTeam is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { teamID: teamID, groupID: groupID, type: type }
            try {
                Laya.Browser.window.webkit.messageHandlers.enterTeam.postMessage( _data );
            } catch ( error ) {
                console.log( 'enterTeam is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转群应用 */
    enterApp( teamID: string, groupID: number, appID: number, appType: number ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterApp( teamID, groupID, appID, appType );
            } catch ( error ) {
                console.log( 'enterApp is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { teamID: teamID, groupID: groupID, appID: appID, appType: appType }
            try {
                Laya.Browser.window.webkit.messageHandlers.enterApp.postMessage( _data );
            } catch ( error ) {
                console.log( 'enterApp is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 起床、睡觉打卡 */
    goWakeUp() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.goWakeUp();
            } catch ( error ) {
                console.log( 'goWakeUp is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.gowakeup.postMessage( null );
            } catch ( error ) {
                console.log( 'gowakeup is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 调用支付接口 */
    appPay( type: string, payDesc: string, payAmount: number ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.appPay( type, payDesc, payAmount );
            } catch ( error ) {
                console.log( 'appPay is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = {
                type: type,
                productID: payDesc,
            }
            try {
                Laya.Browser.window.webkit.messageHandlers.appPay.postMessage( _data );
            } catch ( error ) {
                console.log( 'appPay is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转我的道友界面 */
    enterMyFriendRank() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterMyFriendRank();
            } catch ( error ) {
                console.log( 'enterMyFriendRank is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterMyFriendRank.postMessage( null );
            } catch ( error ) {
                console.log( 'enterMyFriendRank is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转发布日记界面 */
    enterPostDairy() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterPostDairy();
            } catch ( error ) {
                console.log( 'enterPostDairy is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterPostDairy.postMessage( null );
            } catch ( error ) {
                console.log( 'enterPostDairy is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转视频打卡 */
    startTimingVideo() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.startTimingVideo();
            } catch ( error ) {
                console.log( 'startTimingVideo is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.startTimingVideo.postMessage( null );
            } catch ( error ) {
                console.log( 'startTimingVideo is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转话题详情 */
    enterTopicDetail( topicID: number, topicName: string ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterTopicDetail( topicID, topicName );
            } catch ( error ) {
                console.log( 'enterTopicDetail is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { topicID: topicID, topicName: topicName }
            try {
                Laya.Browser.window.webkit.messageHandlers.enterTopicDetail.postMessage( _data );
            } catch ( error ) {
                console.log( 'enterTopicDetail is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转Appsvlog日记详情 */
    enterSvlog( feedID: number ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterSvlog( feedID );
            } catch ( error ) {
                console.log( 'enterSvlog is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { feedID: feedID, }
            try {
                Laya.Browser.window.webkit.messageHandlers.enterSvlog.postMessage( _data );
            } catch ( error ) {
                console.log( 'enterSvlog is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转免费Live详情页 */
    enterFreeLive( payLiveCourseID: string ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterFreeLive( payLiveCourseID );
            } catch ( error ) {
                console.log( 'enterFreeLive is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { payLiveCourseID: payLiveCourseID }
            try {
                Laya.Browser.window.webkit.messageHandlers.enterFreeLive.postMessage( _data );
            } catch ( error ) {
                console.log( 'enterFreeLive is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转付费Live详情页 */
    enterSpLiveDetail( payLiveID: string ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterSpLiveDetail( payLiveID );
            } catch ( error ) {
                console.log( 'enterSpLiveDetail is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { payLiveID: payLiveID }
            try {
                Laya.Browser.window.webkit.messageHandlers.enterSpLiveDetail.postMessage( _data );
            } catch ( error ) {
                console.log( 'enterSpLiveDetail is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转App图文专辑 */
    enterAlbumImageText( albumId: string ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterAlbumImageText( albumId );
            } catch ( error ) {
                console.log( 'enterAlbumImageText is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { albumId: albumId }
            try {
                Laya.Browser.window.webkit.messageHandlers.enterAlbumImageText.postMessage( _data );
            } catch ( error ) {
                console.log( 'enterAlbumImageText is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转App视频专辑 */
    enterAlbumVideo( albumId: string ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterAlbumVideo( albumId );
            } catch ( error ) {
                console.log( 'enterAlbumVideo is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { albumId: albumId }
            try {
                Laya.Browser.window.webkit.messageHandlers.enterAlbumVideo.postMessage( _data );
            } catch ( error ) {
                console.log( 'enterAlbumVideo is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转App音乐专辑 */
    enterAlbumAudio( albumId: string ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterAlbumAudio( albumId );
            } catch ( error ) {
                console.log( 'enterAlbumAudio is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { albumId: albumId }
            try {
                Laya.Browser.window.webkit.messageHandlers.enterAlbumAudio.postMessage( _data );
            } catch ( error ) {
                console.log( 'enterAlbumAudio is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转App树洞对讲机 */
    enterTreeHole( channelNO: string ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterTreeHole( channelNO );
            } catch ( error ) {
                console.log( 'enterTreeHole is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { channelNO: channelNO }
            try {
                Laya.Browser.window.webkit.messageHandlers.enterTreeHole.postMessage( _data );
            } catch ( error ) {
                console.log( 'enterTreeHole is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转App图书馆 */
    enterLibrary() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterLibrary();
            } catch ( error ) {
                console.log( 'enterLibrary is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterLibrary.postMessage( null );
            } catch ( error ) {
                console.log( 'enterLibrary is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转小书童-匹配页面 */
    enterFindFriends() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterFindFriends();
            } catch ( error ) {
                console.log( 'enterFindFriends is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterFindFriends.postMessage( null );
            } catch ( error ) {
                console.log( 'enterFindFriends is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转答疑室 */
    enterAnswerRoom( questionRoomId: number, chatRoomId: number ) {
        let data = {
            questionRoomId: questionRoomId,
            chatRoomId: chatRoomId,
        }
        if ( Laya.Browser.onAndroid ) {
            try {
                let jsondata = JSON.stringify( data );
                Laya.Browser.window.android.enterAnswerRoom( jsondata );
            } catch ( error ) {
                console.log( 'enterAnswerRoom is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterAnswerRoom.postMessage( data );
            } catch ( error ) {
                console.log( 'enterAnswerRoom is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转正在学习计时页面,如果未计时就跳转计时弹窗 */
    jump2Timing() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.jump2Timing();
            } catch ( error ) {
                console.log( 'jump2Timing is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.jump2Timing.postMessage( null );
            } catch ( error ) {
                console.log( 'jump2Timing is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转App路由跳转(跳转H5活动页面) */
    openActivity( url: string ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                let path = 'web?ACTIVITY_URL=' + encodeURI( url );
                Laya.Browser.window.android.openActivity( path );
            } catch ( error ) {
                console.log( 'openActivity is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let _data = { url: url };
            try {
                Laya.Browser.window.webkit.messageHandlers.openActivity.postMessage( _data );
            } catch ( error ) {
                console.log( 'openActivity is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转正在学习番茄计时页 */
    startTimingTomato() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.startTimingTomato();
            } catch ( error ) {
                console.log( 'startTimingTomato is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.startTimingTomato.postMessage( null );
            } catch ( error ) {
                console.log( 'startTimingTomato is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转App付费自习室充值 */
    enterPayDuration() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterPayDuration();
            } catch ( error ) {
                console.log( 'enterPayDuration is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterPayDuration.postMessage( null );
            } catch ( error ) {
                console.log( 'enterPayDuration is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转AppT币充值 */
    enterPayTCoin() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterPayTCoin();
            } catch ( error ) {
                console.log( 'enterPayTCoin is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterPayTCoin.postMessage( null );
            } catch ( error ) {
                console.log( 'enterPayTCoin is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转App农场，无农场就跳转购买 */
    startTimingFarm() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.startTimingFarm();
            } catch ( error ) {
                console.log( 'startTimingFarm is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.startTimingFarm.postMessage( null );
            } catch ( error ) {
                console.log( 'startTimingFarm is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** H5通用页面分享 */
    commonShare( data: any ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                let jsondata = JSON.stringify( data );
                Laya.Browser.window.android.commonShare( jsondata );
            } catch ( error ) {
                console.log( 'commonShare onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.commonShare.postMessage( data );
            } catch ( error ) {
                console.log( 'commonShare onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /**
     * 视频添加好友
     * @param userID 用户ID
     * @param nickName 名字
     * @param avatar 头像
     */
    addFriend( userID: number, nickName: string, avatar: string ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.addFriend( userID, nickName, avatar );
            } catch ( error ) {
                console.log( 'addFriend is null! onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            let data = {
                userID: userID,
                nickName: nickName,
                avatar: avatar,
            }
            try {
                Laya.Browser.window.webkit.messageHandlers.addFriend.postMessage( data );
            } catch ( error ) {
                console.log( 'addFriend is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /**
     * 跳转普通计时,一起学页面
     * @param targetUid 一起学的用户id
     * @param timingBgIndex 计时时长对应的index
     * @param roomId  timing房间ID
     */
    togetherCommonTiming( targetUid: number, timingBgIndex: number, roomId: number ) {
        let data = {
            targetUid: targetUid,
            timingBgIndex: timingBgIndex,
            roomId: roomId,
        }
        if ( Laya.Browser.onAndroid ) {
            try {
                let jsondata = JSON.stringify( data );
                Laya.Browser.window.android.togetherCommonTiming( jsondata );
            } catch ( error ) {
                console.log( 'togetherCommonTiming is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.togetherCommonTiming.postMessage( data );
            } catch ( error ) {
                console.log( 'togetherCommonTiming is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /**
     * 跳转番茄计时,一起学页面
     * @param targetUid 一起学的用户id
     * @param timingBgIndex 计时时长对应的index
     * @param roomId  timing房间ID
     */
    togetherTomatoTiming( targetUid: number, timingBgIndex: number, roomId: number ) {
        let data = {
            targetUid: targetUid,
            timingBgIndex: timingBgIndex,
            roomId: roomId,
        }
        if ( Laya.Browser.onAndroid ) {
            try {
                let jsondata = JSON.stringify( data );
                Laya.Browser.window.android.togetherTomatoTiming( jsondata );
            } catch ( error ) {
                console.log( 'togetherTomatoTiming is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.togetherTomatoTiming.postMessage( data );
            } catch ( error ) {
                console.log( 'togetherTomatoTiming is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /**
     * 跳转学习农场,一起学页面
     * @param targetUid 一起学的用户id
     * @param timingBgIndex 计时时长对应的index
     * @param roomId  timing房间ID
     */
    togetherFarmTiming( targetUid: number, timingBgIndex: number, roomId: number ) {
        let data = {
            targetUid: targetUid,
            timingBgIndex: timingBgIndex,
            roomId: roomId,
        }
        if ( Laya.Browser.onAndroid ) {
            try {
                let jsondata = JSON.stringify( data );
                Laya.Browser.window.android.togetherFarmTiming( jsondata );
            } catch ( error ) {
                console.log( 'togetherFarmTiming is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.togetherFarmTiming.postMessage( data );
            } catch ( error ) {
                console.log( 'togetherFarmTiming is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /**
     * 跳转连麦学习,一起学页面
     * @param timingRoomId 结伴房间ID
     * @param groupId 组ID
     * @param isTest 是否测试接口
     */
    enterOnlineTiming( timingRoomId: number, groupId: number, isTest: boolean = false ) {
        let data = {
            timingRoomId: timingRoomId,
            groupId: groupId,
        }
        if ( isTest ) {
            data = {
                timingRoomId: ( Number( '' ) ),
                groupId: -1,
            }
        }
        if ( Laya.Browser.onAndroid ) {
            try {
                let jsondata = JSON.stringify( data );
                Laya.Browser.window.android.enterOnlineTiming( jsondata );
            } catch ( error ) {
                console.log( 'enterOnlineTiming is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterOnlineTiming.postMessage( data );
            } catch ( error ) {
                console.log( 'enterOnlineTiming is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 创建学习局 */
    createLearningBureau() {
        let data = {};
        if ( Laya.Browser.onAndroid ) {
            try {
                let jsondata = JSON.stringify( data );
                Laya.Browser.window.android.createLearningBureau( jsondata );
            } catch ( error ) {
                console.log( 'createLearningBureau is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.createLearningBureau.postMessage( data );
            } catch ( error ) {
                console.log( 'createLearningBureau is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /**
     * 跳转免费自习室房间页面
     * @param deskNo 座位号 
     * @param learningRoomId 房间号 
     */
    enterFreeStudyRoomDetail( deskNo: number, learningRoomId: number ) {
        let data = {
            deskNo: deskNo,
            learningRoomId: learningRoomId,
        }
        if ( Laya.Browser.onAndroid ) {
            try {
                let jsondata = JSON.stringify( data );
                Laya.Browser.window.android.enterFreeStudyRoomDetail( jsondata );
            } catch ( error ) {
                console.log( 'enterFreeStudyRoomDetail is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterFreeStudyRoomDetail.postMessage( data );
            } catch ( error ) {
                console.log( 'enterFreeStudyRoomDetail is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /**
     * 跳转付费自习室房间页面
     * @param deskNo 座位号
     * @param learningRoomId 房间号
     */
    enterPayStudyRoomDetail( deskNo: number, learningRoomId: number ) {
        let data = {
            deskNo: deskNo,
            learningRoomId: learningRoomId,
        }
        if ( Laya.Browser.onAndroid ) {
            try {
                let jsondata = JSON.stringify( data );
                Laya.Browser.window.android.enterPayStudyRoomDetail( jsondata );
            } catch ( error ) {
                console.log( 'enterPayStudyRoomDetail is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterPayStudyRoomDetail.postMessage( data );
            } catch ( error ) {
                console.log( 'enterPayStudyRoomDetail is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /**
     * 消息页,跳转到主页某个tab
     * @param index 0:关注 1:发现 2:自习室
     */
    enterFriendCircle( index: number ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterFriendCircle( index );
            } catch ( error ) {
                console.log( 'enterFriendCircle is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                let data = { index: index }
                Laya.Browser.window.webkit.messageHandlers.enterFriendCircle.postMessage( data );
            } catch ( error ) {
                console.log( 'enterFriendCircle is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 树洞对讲机频道页面 */
    enterTreeHoleMain() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterTreeHoleMain();
            } catch ( error ) {
                console.log( 'enterTreeHoleMain is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterTreeHoleMain.postMessage( null );
            } catch ( error ) {
                console.log( 'enterTreeHoleMain is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 建学习群页面 */
    enterTeamCreate() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterTeamCreate();
            } catch ( error ) {
                console.log( 'enterTeamCreate is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterTeamCreate.postMessage( null );
            } catch ( error ) {
                console.log( 'enterTeamCreate is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 互动消息通知页 */
    enterFeedNotice() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterFeedNotice();
            } catch ( error ) {
                console.log( 'enterFeedNotice is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterFeedNotice.postMessage( null );
            } catch ( error ) {
                console.log( 'enterFeedNotice is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 道友申请消息通知页 */
    enterFriendApply() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterFriendApply();
            } catch ( error ) {
                console.log( 'enterFriendApply is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterFriendApply.postMessage( null );
            } catch ( error ) {
                console.log( 'enterFriendApply is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 小书童聊天页 */
    enterKefu() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterKefu();
            } catch ( error ) {
                console.log( 'enterKefu is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterKefu.postMessage( null );
            } catch ( error ) {
                console.log( 'enterKefu is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 小书童-帮助与反馈 */
    enterFeedback() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterFeedback();
            } catch ( error ) {
                console.log( 'enterFeedback is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterFeedback.postMessage( null );
            } catch ( error ) {
                console.log( 'enterFeedback is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 搜索页 */
    enterSearch() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterSearch();
            } catch ( error ) {
                console.log( 'enterSearch is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterSearch.postMessage( null );
            } catch ( error ) {
                console.log( 'enterSearch is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 寻找学习群 */
    enterSearchGroup() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterSearchGroup();
            } catch ( error ) {
                console.log( 'enterSearchGroup is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterSearchGroup.postMessage( null );
            } catch ( error ) {
                console.log( 'enterSearchGroup is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 今日牛人榜 */
    enterTheBestList() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterTheBestList();
            } catch ( error ) {
                console.log( 'enterTheBestList is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterTheBestList.postMessage( null );
            } catch ( error ) {
                console.log( 'enterTheBestList is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 查找道友 */
    enterSearchFriend() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterSearchFriend();
            } catch ( error ) {
                console.log( 'enterSearchFriend is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterSearchFriend.postMessage( null );
            } catch ( error ) {
                console.log( 'enterSearchFriend is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 我的学习数据 */
    enterMyLearningData() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterMyLearningData();
            } catch ( error ) {
                console.log( 'enterMyLearningData is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterMyLearningData.postMessage( null );
            } catch ( error ) {
                console.log( 'enterMyLearningData is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 跳转二维码页面 */
    enterQRCode( userID: number ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterQRCode( userID );
            } catch ( error ) {
                console.log( 'enterQRCode is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                let data = { userID: userID }
                Laya.Browser.window.webkit.messageHandlers.enterQRCode.postMessage( data );
            } catch ( error ) {
                console.log( 'enterQRCode is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 我的钱包页面 */
    enterMyWallet() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterMyWallet();
            } catch ( error ) {
                console.log( 'enterMyWallet is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterMyWallet.postMessage( null );
            } catch ( error ) {
                console.log( 'enterMyWallet is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 我的学习记录页面 */
    enterMyLearningRecord() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterMyLearningRecord();
            } catch ( error ) {
                console.log( 'enterMyLearningRecord is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterMyLearningRecord.postMessage( null );
            } catch ( error ) {
                console.log( 'enterMyLearningRecord is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 学习报告页面 */
    enterMyLearningReport() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterMyLearningReport();
            } catch ( error ) {
                console.log( 'enterMyLearningReport is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterMyLearningReport.postMessage( null );
            } catch ( error ) {
                console.log( 'enterMyLearningReport is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 我的成就页面 */
    enterMyAchievement() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterMyAchievement();
            } catch ( error ) {
                console.log( 'enterMyAchievement is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterMyAchievement.postMessage( null );
            } catch ( error ) {
                console.log( 'enterMyAchievement is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /**
     * 关注页面
     * 传0表示跳转自己的关注列表
     * @param targetUid  目标ID
     */
    enterFollowList( targetUid: number ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterFollowList( targetUid );
            } catch ( error ) {
                console.log( 'enterFollowList is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                let data = { targetUid: targetUid }
                Laya.Browser.window.webkit.messageHandlers.enterFollowList.postMessage( data );
            } catch ( error ) {
                console.log( 'enterFollowList is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /**
     * 粉丝页面
     * 传0表示跳转自己的粉丝列表
     * @param targetUid  目标ID
     */
    enterFanList( targetUid: number ) {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterFanList( targetUid );
            } catch ( error ) {
                console.log( 'enterFanList is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                let data = { targetUid: targetUid }
                Laya.Browser.window.webkit.messageHandlers.enterFanList.postMessage( data );
            } catch ( error ) {
                console.log( 'enterFanList is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 发布视频日记页 */
    enterPostVideoDiary() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterPostVideoDiary();
            } catch ( error ) {
                console.log( 'enterPostVideoDiary is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterPostVideoDiary.postMessage( null );
            } catch ( error ) {
                console.log( 'enterPostVideoDiary is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 投稿汤视频页 */
    enterSvlogPost() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterSvlogPost();
            } catch ( error ) {
                console.log( 'enterSvlogPost is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterSvlogPost.postMessage( null );
            } catch ( error ) {
                console.log( 'enterSvlogPost is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    /** 学习计划提醒页 */
    enterPlanReminder() {
        if ( Laya.Browser.onAndroid ) {
            try {
                Laya.Browser.window.android.enterPlanReminder();
            } catch ( error ) {
                console.log( 'enterPlanReminder is null!onAndroid -> error', error );
                this.erroPop();
            }
        }
        else if ( Laya.Browser.onIOS ) {
            try {
                Laya.Browser.window.webkit.messageHandlers.enterPlanReminder.postMessage( null );
            } catch ( error ) {
                console.log( 'enterPlanReminder is null! onIOS-> error', Error );
                this.erroPop();
            }
        }
    }

    //#endregion



    //#region Laya暴露给Timing ,Ios客户端的回调
    /** 获取ios客户端版本号 */
    private localIosVersion() {
        Laya.Browser.window.localIosVersion = function ( version ) {
            SettingData.iosVs = version;
            CLOG.I( "获取Ios客户端版本号：{0}", SettingData.iosVs );
        }
    }

    /** 支付成功,App的回调方法 */
    private appPaySuccess( func?: () => void ) {
        Laya.Browser.window.appPaySuccess = function ( result ) {
            CLOG.I( '客户端支付成功回调!' );
            if ( result ) {
                if ( func ) {
                    func();
                }
            }
        }
    }

    /** 返回游戏上一级界面 */
    private backToPrevious() {
        Laya.Browser.window.backToPrevious = function () {
            TimingInterface.getInstance().backToApp();
        }
    }

    //#endregion

}
