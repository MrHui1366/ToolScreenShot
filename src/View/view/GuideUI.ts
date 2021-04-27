import Common from "src/coffee_bean/utils/Common";
import { PlayerData } from "src/Data/PlayerData";
import ClientCompleteGuideCmd from "src/NetWork/ClientCompleteGuideCmd";
import CSceneManager from "src/Scene/CSceneManager";
import ButtonEff from "src/Script/ButtonEff";
import { ui } from "src/ui/layaMaxUI";

/**
 * Timing秀引导界面
 * @ author:XiangHui
 * @ date: 2021-04-23 14:27
 */
export default class GuideUI extends ui.ViewFile.GuideUI {

    constructor () {
        super();
    }

    onOpened( param ) {
        this.listPanel.vScrollBarSkin = "ui_Fashion/vscroll.png";
        this.listPanel.vScrollBar.hide = true;
        this.showGoinBtn();
    }

    private showGoinBtn() {
        let btnGoin = new Laya.Image();
        btnGoin.skin = 'ui_Fashion/img_Goin.png';
        Laya.stage.addChild( btnGoin );
        btnGoin.centerX = 0;
        btnGoin.bottom = 72;
        btnGoin.anchor( 0.5, 0.5 );
        btnGoin.addComponent( ButtonEff );
        btnGoin.on( Laya.Event.CLICK, this, this.completeGuide, [ btnGoin ] );
    }

    private completeGuide( btnGoin: Laya.Image ) {
        Common.btn_Protect( btnGoin, 0.5 );
        if ( !PlayerData.userInfo.isGuide ) {
            ClientCompleteGuideCmd.getInstance().sendMsg( () => {
                PlayerData.userInfo.isGuide = true;
                btnGoin.removeSelf();
                btnGoin.destroy();
                CSceneManager.openFashionShop();
            } );
        }
    }

}