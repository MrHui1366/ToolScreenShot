
/** 本地数据类*/
export class PlayerData {

  /** 穿戴服装数据 */
  public static clothing: Array<ClothingData>;

  /** 用户性别 */
  public static gender: number;


}

/** 穿戴服装数据 */
export class ClothingData {

  /** 拥有列表 */
  public owned: Array<number>;

  /** 服装ID */
  public inUse: number;

  /** 部位ID */
  public type: number;
}



