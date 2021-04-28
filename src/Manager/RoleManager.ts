import CSingleton from "../coffee_bean/core/CSingleton";
import Role from "../Prefab/Role";
import { CobjPos } from "src/coffee_bean/core/CData";

/**
 * 角色管理类
 * @ author:XiangHui
 * @ date: 2020-12-26 14:02
 */
export default class RoleManager extends CSingleton {

    /** 角色预制体 */
    private Role_prefab: Laya.Prefab;

    constructor () {
        super();
        this.Role_prefab = new Laya.Prefab();
        this.Role_prefab.json = Laya.Loader.getRes( "PrefabFile/Role.json" );
    }

    /** 
     * 创建角色
     * @param root  父节点
     * @param pos 坐标
     * @param gender 性别 
     * @param clothing 时装数据
     */
    public createRole( root: Laya.Sprite, pos: CobjPos, gender: number, clothing ): Role {
        //添加角色到父节点
        let role: Laya.Sprite = Laya.Pool.getItemByCreateFun( 'Role', this.Role_prefab.create, this.Role_prefab );
        root.addChild( role );
        role.pos( pos.x, pos.y );
        let role_s = role.getComponent( Role ) as Role;
        role_s.createRoleSpine( gender, clothing );
        return role_s;
    }

    /** 移除某个角色 */
    public removeRole( role: Role ): Role {
        if ( role != null ) {
            role.DestroyAni();
        }
        return null;
    }

}

