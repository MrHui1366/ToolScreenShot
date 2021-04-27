import CSingleton from "../core/CSingleton";

/** 播放的音乐数据 */
class AudioData {

    /** 声音路径 */
    public url: string;

    /** 是否循环 */
    public loop: boolean;

    /** 播放完成回调 */
    public handler: Laya.Handler;

    /** 起始时间 */
    public startTime: number

}

/**
 * CoffeeBean
 * 声音管理库封装
 * @ author:XiangHui
 * @ date: 2020-12-03 16:19
 */
export default class CSound extends CSingleton {

    /** 当前播放的背景音乐 */
    private nowMusic: any;

    /** 当前播放的音效 */
    private nowEffice: any;

    constructor () {
        super();
        this.init();
    }

    private init() {
        //失去舞台焦点（切出游戏）的处理
        Laya.stage.on( Laya.Event.BLUR, this, () => {
            this.enable_music();

        } );
        //获得舞台焦点（切回游戏）的处理
        Laya.stage.on( Laya.Event.FOCUS, this, () => {
            // this.playBGMusic();

        } );
    }

    /**
     * 是否自动跟随设备禁音
     * 设置为false则跟随设备禁音，默认跟随
     * @param enable true:否  false:是 
     */
    public deviceAudioEnable( enable: boolean = false ) {
        //通过设备静音键让音频自动跟随设备静音
        Laya.SoundManager.useAudioMusic = false;
    }

    /**
     * 播放音效
     * @param url 音效URL
     * @param loops — 循环次数,0表示无限循环
     */
    public playEffect( url: string, loops: number ): void {
        Laya.SoundManager.playSound( url, loops );
    }

    /**
     * 播放背景音乐
     * @param url 音乐URL
     * @param loops — 循环次数,0表示无限循环
     */
    public playBGMusic( url: string, loops: number ): void {
        Laya.SoundManager.playMusic( url, loops );
    }

    /*** 开启、禁止音效 ***/
    public enable_music(): void {
        Laya.SoundManager.stopAllSound();
    }

    /*** 开启、禁止音乐(背景音乐) ***/
    public enable_sound(): void {
        Laya.SoundManager.stopMusic();
    }



















}