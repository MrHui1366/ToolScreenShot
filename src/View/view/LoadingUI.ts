import { ui } from '../../ui/layaMaxUI';
import { E_MsgType } from './../../coffee_bean/core/CEnum';
import CMsg from "../../coffee_bean/utils/CMsg";
import { SettingData } from '../../Data/SettingData';


/** 加载界面*/
export default class LoadingUI extends ui.ViewFile.LoadingUI {

    constructor () {
        super();
    }

    onEnable() {
        this.showVersion();
        CMsg.eventOn( E_MsgType.E_Loading, this, this.loadProgress )
    }

    onOpened( param ) {
        this.loadingAni();
    }

    /** 显示版本号 */
    private showVersion() {
        let txt = new Laya.Label();
        txt.name = 'VersionText';
        txt.italic = true;
        txt.font = 'Arial';
        txt.fontSize = 25;
        txt.color = '#000000';
        txt.left = 20;
        txt.bottom = 10;
        txt.changeText( SettingData.versionsID );
        Laya.stage.addChild( txt );
        txt.zOrder = 10001;
    }

    /**Loading动画 */
    private loadingAni() {
        this[ "write" ].once( Laya.Event.COMPLETE, this, () => {
            this.eff_pen.play( 0, true );
        } );
        this[ "write" ].play( 0, false );
    }

    /** 预加载进度更新显示*/
    private loadProgress( progress: number ) {
        let value = Math.floor( progress * 100 ) + "%";
        this.txt_value.changeText( value );
        this.img_progressMask.x = -479 + ( 474 * progress );
    }

    onClosed() {
        //移除事件监听
        CMsg.eventOff( E_MsgType.E_Loading, this, this.loadProgress );
    }

}

