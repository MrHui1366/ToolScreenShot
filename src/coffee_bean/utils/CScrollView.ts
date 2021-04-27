/*
* 自定义滚动视图，继承BOX，并实现IRedner以及IItem接口
*/
export default class ScrollView extends Laya.Box implements laya.ui.IRender, laya.ui.IItem {

    /**数据源 */
    private array: Array<any>;

    /**单元格渲染处理器 */
    private renderHandler: Laya.Handler;

    /**单元格鼠标事件处理器 */
    private mouseHandler: Laya.Handler;

    /**改变List的选择项时执行的处理器 */
    private selectHandler: Laya.Handler;

    /**是否已经渲染过单元格 */
    private haveRender: boolean = false;

    /**是否已经初始化 */
    private haveInit: boolean = false;

    /**是否已经渲染 */
    private haveInitItem: boolean = false;

    /**抬起鼠标是否继续滑动 */
    private _isSensitive: boolean = true;

    /**单元格宽 */
    private cellWidth: number;

    /**单元格宽 */
    private cellHeight: number;

    /**左边距 */
    private spaceLeft: number = 0;

    /**右边距 */
    private spaceRight: number = 0;

    /**单元格集合 */
    private cells: Array<any>;

    public itemRender: any;

    /** 两个单元格之间的间隔*/
    public space: number = 0;

    constructor () {
        super();
        this.mouseEnabled = true;
        this.on( Laya.Event.MOUSE_DOWN, this, this.mouseDown );
        this.on( Laya.Event.MOUSE_UP, this, this.mouseUp, [ Laya.Event.MOUSE_UP ] );
        this.on( Laya.Event.MOUSE_MOVE, this, this.mouseMove );
        this.on( Laya.Event.MOUSE_OUT, this, this.mouseUp, [ Laya.Event.MOUSE_OUT ] );
    }

    /** 初始化ScrollView渲染，数据*/
    private init(): void {
        if ( !this.haveInit ) {

            // 初始化单元格
            this.initItems();
            // 初始化渲染
            this.initRender();

            if ( this.haveInitItem && this.haveRender ) {
                this.haveInit = true;
            }
        }
    }

    /** 设置数据源*/
    public set setArray( arr: Array<any> ) {
        this.array = arr;
        this.init();
    }

    /** 获取数据源 */
    public get getArray(): Array<any> {
        return this.array;
    }

    //设置单元格渲染
    public set setItemRender( itemRender: any ) {
        this.itemRender = itemRender; //设置完单元格数据以后，在进行初始化一次
        this.init();
    }

    //设置单元格处理器
    public set setRenderHandler( hander: Laya.Handler ) {
        this.renderHandler = hander;
        this.init();
    }

    /**设置鼠标处理器*/
    public set setMouseHandler( hander: Laya.Handler ) {
        this.mouseHandler = hander;
    }

    /**设置选中处理器*/
    public set setSelectHandler( hander: Laya.Handler ) {
        this.selectHandler = hander;
    }

    /**设置单元格的宽 */
    public set setCellWidth( cellWidth: number ) {
        this.cellWidth = cellWidth;
    }

    /**获取单元格的宽*/
    public get getCellWidth(): number {
        return this.cellWidth;
    }

    /**设置单元格的高*/
    public set setCellHeight( cellHeight: number ) {
        this.cellHeight = cellHeight;
    }

    /**获取单元格的高*/
    public get getCellHeight(): number {
        return this.cellHeight;
    }

    /**设置左边界*/
    public set setSpaceLeft( spaceLeft: number ) {
        this.spaceLeft = spaceLeft;
    }

    /**获取左边界 */
    public get getSpaceLeft(): number {
        return this.spaceLeft;
    }

    /**设置右边界*/
    public set setSpaceRight( spaceRight: number ) {
        this.spaceRight = spaceRight;
    }

    /**获取右边界 */
    public get getSpaceRight(): number {
        return this.spaceRight;
    }

    /**添加单元格 */
    public addItem( item: any ): void { }

    /**
     * 通过索引获取对应的单元格
     * @param index 
     */
    public getItemByIndex( index: number ): any {
        return this.cells[ index ];
    }

    /**
     * 根据单元格获取单元格的位置 
     * @param cell 
     */
    public getItemIndex( cell: any ): number {
        for ( let i = 0; i < this.cells.length; i++ ) {
            if ( cell == this.cells[ i ] ) {
                return i;
            }
        }
        return -1;
    }

    /**单元格响应事件*/
    private onCellEvent( event: Event, cell: any ) {
        let index = this.getItemIndex( cell );
        if ( index == -1 ) {
            return;
        }
        if ( this.selectHandler ) {
            this.selectHandler.runWith( [ event, index ] );
        }
    }

    /** 初始化所有的Item*/
    public initItems(): void {
        if ( !this.haveInitItem && this.itemRender != null && this.array != null && this.array.length > 0 ) {
            this.cells = new Array<any>()
            for ( let i = 0; i < this.array.length; i++ ) {
                let item = new this.itemRender( this.cellWidth, this.cellHeight );
                if ( this.array[ i ] instanceof Laya.Sprite || this.array[ i ] instanceof Laya.Box || this.array[ i ] instanceof Laya.Image ) {
                    //如果是其原型，则添加为子对象
                    item.addChild( this.array[ i ] );
                } else if ( this.array[ i ] instanceof String || this.array[ i ] instanceof Number || this.array[ i ] instanceof Boolean ) {
                    //自定义属性
                    item.costom = this.array[ i ];
                }
                this.cells.push( item );
                this.addChild( item );
            }
            this.haveInitItem = true;
            //调用刷新单元格位置
            this.refreshCellsPos();
        }
    }

    /** 所有单元格执行渲染*/
    private initRender(): void {
        if ( !this.haveRender && this.renderHandler != null && this.array != null && this.array.length > 0 ) {
            for ( let i = 0; i < this.array.length; i++ ) {
                this.renderHandler.runWith( [ this.cells[ i ], i ] );
            }
            this.haveRender = true;
        }
    }

    /** 单个单元格执行渲染*/
    private doSingleRender( index: number ): void {
        if ( !this.haveRender ) {
            this.initRender();
            return;
        }
        if ( this.renderHandler != null ) {
            this.renderHandler.runWith( [ this.cells[ index ], index ] );
        }
    }

    /** 刷新ScrollView下Cell的位置  */
    private refreshCellsPos() {
        let cellCount = this.cells.length;
        for ( let i = 0; i < cellCount; i++ ) {
            let cell: Laya.Box = this.cells[ i ] as Laya.Box;
            let posX: number = this.getCellPosByIndex( i );
            let posY: number = cell.height;
            cell.pos( posX, posY / 2 );
        }
        this.width = this.spaceLeft + cellCount * this.cellWidth
            + ( cellCount - 1 ) * this.space + this.spaceRight;
    }

    /**
     * 根据单元格索引获取单元格位置
     * @param index 
     */
    public getCellPosByIndex( index: number ): number {
        return this.spaceLeft + ( index + 0.5 ) * this.cellWidth + index * this.space;
    }

    // ----------------------- mouse event start ------------------------
    /**鼠标按下 */
    private mouseDown() {
        if ( this.mouseHandler != null ) {
            let e: Event = new Event( Laya.Event.MOUSE_DOWN );
            this.mouseHandler.runWith( [ e ] );
        }
    }

    /**鼠标抬起*/
    private mouseUp( event: string ) {
        if ( this.mouseHandler != null ) {
            let e: Event = new Event( Laya.Event.MOUSE_UP );
            this.mouseHandler.runWith( [ e ] );
        }
    }

    /**鼠标移动*/
    private mouseMove() {
        if ( this.mouseHandler != null ) {
            let e: Event = new Event( Laya.Event.MOUSE_MOVE );
            this.mouseHandler.runWith( [ e ] );
        }
    }
}