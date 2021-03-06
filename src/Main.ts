import GameConfig from "./GameConfig";
import { loadExpands } from "./coffee_bean/expand/CExpands";
import Game from './Game';

class Main {

	constructor () {
		Config.isAlpha = true;
		//根据IDE设置初始化引擎
		if ( window[ "Laya3D" ] ) Laya3D.init( GameConfig.width, GameConfig.height );
		else Laya.init( GameConfig.width, GameConfig.height, Laya[ "WebGL" ] );
		Laya[ "DebugPanel" ] && Laya[ "DebugPanel" ].enable();
		Laya.stage.bgColor = "#b3eccc";
		//激活扩展方法
		loadExpands();
		Laya.stage.bgColor = null;

		Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
		Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
		Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
		Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
		Laya.stage.frameRate = Laya.Stage.FRAME_FAST;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if ( GameConfig.debug || Laya.Utils.getQueryString( "debug" ) == "true" ) Laya.enableDebugPanel();
		if ( GameConfig.physicsDebug && Laya[ "PhysicsDebugDraw" ] ) Laya[ "PhysicsDebugDraw" ].enable();
		Laya.alertGlobalError( true );
		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable( "version.json", Laya.Handler.create( this, this.onVersionLoaded ), Laya.ResourceVersion.FILENAME_VERSION );
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable( "fileconfig.json", Laya.Handler.create( this, this.onConfigLoaded ) );
	}

	onConfigLoaded(): void {

		//	开始游戏
		Game.start();
	}

}

//激活启动类
new Main();
