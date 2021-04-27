import Common from "../../coffee_bean/utils/Common";

// 球半径
const BALL_RADIUS: number = 10;

// 运动半径
const MOVE_RAIDUS: number = 100;

/** 等待界面 */
export default class WaitingUI extends Laya.View {

    /** UI实例 */
    private static inst: WaitingUI = null;

    /**Box灰色背景容器 */
    private boxBg: Laya.Box = null;

    /** 获得UI实例 */
    private static getInst(): WaitingUI {
        if ( WaitingUI.inst == null ) {
            WaitingUI.inst = new WaitingUI();
        }
        return WaitingUI.inst;
    }

    /**
     * 显示Waiting
     */
    public static show(): void {
        WaitingUI.getInst().visible = true;
    }

    /** 隐藏Waiting */
    public static hide(): void {
        WaitingUI.getInst().visible = false;
    }

    /** 构造函数 */
    constructor () {
        super();
        Laya.stage.addChild( this );

        // 设置View尺寸
        Common.setFullSize( this );
        this.alpha = 0.5;
        this.mouseThrough = false;
        this.mouseEnabled = true;

        // 创建Box背景颜色层
        this.boxBg = new Laya.Box();
        this.boxBg.bgColor = "#000000";
        Common.setFullSize( this.boxBg );
        this.addChild( this.boxBg );

        // 小球容器
        let ballBox = new Laya.Box();
        ballBox.size( 100, 100 );
        ballBox.pivotX = 0.5;
        ballBox.pivotY = 0.5;
        ballBox.pos( Laya.stage.width / 2, Laya.stage.height / 2 );
        Laya.TimeLine.to( ballBox, { rotation: 360 }, 1000 ).play( 0, true );
        this.boxBg.addChild( ballBox );

        // 创建小球，并运动
        for ( let i = 0; i < 4; i++ ) {
            let ball = this.createBall( "#FFFFFF" );
            ball.pos( 0, 0 );
            ballBox.addChild( ball );
            switch ( i ) {
                case 0:
                    Laya.TimeLine.to( ball, { x: 0, y: MOVE_RAIDUS }, 1000 ).to( ball, { x: 0, y: 0 }, 1000 ).play( 0, true );
                    break;
                case 1:
                    Laya.TimeLine.to( ball, { x: 0, y: -MOVE_RAIDUS }, 1000 ).to( ball, { x: 0, y: 0 }, 1000 ).play( 0, true );
                    break;
                case 2:
                    Laya.TimeLine.to( ball, { x: MOVE_RAIDUS, y: 0 }, 1000 ).to( ball, { x: 0, y: 0 }, 1000 ).play( 0, true );
                    break;
                case 3:
                    Laya.TimeLine.to( ball, { x: -MOVE_RAIDUS, y: 0 }, 1000 ).to( ball, { x: 0, y: 0 }, 1000 ).play( 0, true );
                    break;
            }
        }
    }

    /** 创建小球*/
    private createBall( color: string ): Laya.Sprite {
        let sp = new Laya.Sprite();
        sp.graphics.drawCircle( 0, 0, BALL_RADIUS, color );
        sp.size( BALL_RADIUS * 2, BALL_RADIUS * 2 );
        sp.pivotX = 0.5;
        sp.pivotY = 0.5;
        return sp;
    }

}

