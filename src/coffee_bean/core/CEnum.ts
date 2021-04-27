/**
 * CoffeeBean
 * 全局枚举
 * 包括常用的枚举定义
 * PS：普通枚举在需要用到的地方直接定义导出即可，这里只定义常用的枚举
 */

/**
 * 服务器类型
 * (PS:数值不要改动！！！)
 */
export enum E_ServerType {

    /*** 测试服 ***/
    E_TEST = 0,

    /*** 正式服 ***/
    E_PROD = 1,

    /*** 灰度服 ***/
    E_GRAY = 2,
}

/*** 比率类型 ***/
export enum E_PrecentType {

    /*** 百分比 ***/
    PRECENT_100 = 100,
    /*** 千分比 ***/
    PRECENT_1000 = 1000,
    /*** 万分比 ***/
    PRECENT_10000 = 10000
}

/** 消息类型 */

export enum E_MsgType {

    /**loading进度条增长 */
    E_Loading = "E_Loading",

    /** 更新房间能量、舒适度 */
    E_UpdateRoomEnergy = "E_UpdateRoomEnergy",

    /** 主界面--角色换装 */
    E_ChangeFashion = 'E_ChangeFashion',

    /** 时装商店-选中时装item  */
    E_SelectFashionItem = 'E_SelectFashionItem',

}

/** 时装部位路径枚举 */
export enum E_FashionTypePath {
    /** 头发路径 */
    E_Fashion_Hair = 'FashionShop/img_hair_',

    /** 衣服路径 */
    E_Fashion_Clothes = 'FashionShop/img_clothes_',

    /** 鞋子路径 */
    E_Fashion_Shoe = 'FashionShop/img_shoe_',

    /** 表情路径 */
    E_Fashion_Face = 'FashionShop/img_face_',
}
