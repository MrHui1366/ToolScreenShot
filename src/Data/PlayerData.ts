import { ClothingData, DisCountInfo, TimingShowData, userInfo } from "src/NetWork/ClientTimingShowMainCmd";

/** 本地数据类*/
export class PlayerData {

  public static userID: number;// = 105516;

  public static userKey: string;//= 'MSivtv3tRtNp_rTla3IEX5E_VRCRZn5h';

  /** 穿戴服装数据 */
  public static clothing: Array<ClothingData>;

  /** 折扣数据 */
  public static disCountInfo: DisCountInfo;

  /** 用户数据 */
  public static userInfo: userInfo;

  /** 新上架服装列表 */
  public static newClothing: Array<number>;

  /** 时装选中的ItemID */
  public static selectItemId: number = 0;

  /** AdornBuyView购买时需要积分 */
  public static needCredit: number;

  /** 本地数据缓存 */
  public static localCache( data: TimingShowData ) {
    this.clothing = data.clothing;
    this.userInfo = data.userInfo;
    this.disCountInfo = data.disCountInfo;
    this.newClothing = data.newClothing;
  }



}


