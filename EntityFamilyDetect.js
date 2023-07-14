const PLUGIN_NAME="EntityFamilyDetect";
const INTERNAL_FAMILY=[
    "adult_piglin",
    "allay",
    "animal",
    "armor_stand",
    "arthropod",
    "artisan",
    "axolotl",
    "baby_turtle",
    "bat",
    "bee",
    "blacksmith",
    "blaze",
    "boat",
    "butcher",
    "cartographer",
    "cat",
    "cavespider",
    "chicken",
    "cleric",
    "cod",
    "cow",
    "creeper",
    "dolphin",
    "donkey",
    "dragon",
    "drowned",
    "enderman",
    "endermite",
    "evocation_illager",
    "farmer",
    "fish",
    "fisherman",
    "fletcher",
    "fox",
    "frog",
    "ghast",
    "goat",
    "guardian",
    "guardian_elder",
    "hoglin",
    "hoglin_adult",
    "hoglin_baby",
    "hoglin_huntable",
    "horse",
    "husk",
    "illager",
    "inanimate",
    "irongolem",
    "leatherworker",
    "librarian",
    "lightweight",
    "llama",
    "magmacube",
    "minecart",
    "mob",
    "monster",
    "mule",
    "mushroomcow",
    "nitwit",
    "npc",
    "ocelot",
    "pacified",
    "panda",
    "panda_aggressive",
    "parrot_tame",
    "parrot_wile",
    "peasant",
    "phantom",
    "pig",
    "piglin",
    "piglin_brute",
    "piglin_hunter",
    "pillager",
    "player",
    "polarbear",
    "preist",
    "pupperfish",
    "rabbit",
    "ravager",
    "salmon",
    "sheep",
    "shepherd",
    "shulker",
    "silverfish",
    "skeleton",
    "skeletonhorse"    ,
    "slime",
    "snowgolem",
    "spider",
    "undead",
    "unskilled",
    "vex",
    "villager",
    "vindicator",
    "wandering_trader",
    "wandering_trader_despawning",
    "warden",
    "weaponsmith",
    "witch",
    "wither",
    "wolf",
    "zoglin",
    "zoglin_adult",
    "zoglin_baby",
    "zombie",
    "zombie_pigman",
    "zombie_villager",
    "zombie_horse"
]
let known_family=[]
known_family=known_family.concat(INTERNAL_FAMILY)
const KNOWN_FAMILY=known_family

const COMMAND_NAME="entityfamilydetect"
let taskID=""

const conf=new JsonConfigFile("plugins\\"+PLUGIN_NAME+"\\Config.json");
const resultFile=new JsonConfigFile("plugins\\"+PLUGIN_NAME+"\\Result.json");

conf.init("logger_level",3)

logger.setConsole(true,conf.get("logger_level"))

function commandCallback(cmd,origin,output,results){
    if(results.taskID!=undefined&&results.taskID!=taskID){
        logger.error("请勿手动或用插件执行此子命令");
        return;
    }
    if(results.taskID==taskID){
        //实体这个参数是给插件自己用来检测到是否能获取到实体的
        resultFile.init(results.family,[])
        let familySet=new Set(resultFile.get(results.family))
        results.entity.forEach((entity)=>{
            familySet.add(entity.type)
        })
        resultFile.set(results.family,Array.from(familySet))
        return;
    }
    logger.info("开始检测实体族信息")
    //手动执行了命令，开始了一次检测，此时在全局创建此次任务的任务id
    taskID=system.randomGuid();
    //用一个目标选择器执行一下看看里面有什么
    KNOWN_FAMILY.forEach((family)=>{
        mc.runcmdEx(COMMAND_NAME+" "+taskID+" "+family+" @e[family="+family+"]")
    })
    /*
    entityFamily={}
    mc.getAllEntities().forEach((referencedEntity)=>{
        if(entityFamily[referencedEntity.type]!=undefined)return;
        entity=mc.cloneMob(referencedEntity,referencedEntity.pos)
        KNOWN_FAMILY.forEach((family)=>{

        })
    })
    */
}

let maincmd=mc.newCommand(COMMAND_NAME," ",PermType.Console);
maincmd.mandatory("taskID",ParamType.String)
maincmd.mandatory("family",ParamType.String)
maincmd.mandatory("entity",ParamType.Actor)
maincmd.overload(["taskID","family","entity"]);
maincmd.overload([]);
maincmd.setCallback(commandCallback)
maincmd.setup();

function getEntityFamily(entityType){
    let result=[]
    KNOWN_FAMILY.forEach((family)=>{
        if(resultFile.get(family)==null)return;
        if(resultFile.get(family).includes(entityType)){
            result.push(family)
        }
    })
    return result
}
ll.exports(getEntityFamily,PLUGIN_NAME,"getEntityFamily")

function entityIsInFamily(entityType,family){
    if(resultFile.get(family)==null)return false;
    if(resultFile.get(family).includes(entityType))return true;
    return false;
}
ll.exports(entityIsInFamily,PLUGIN_NAME,"entityIsInFamily")

ll.registerPlugin(PLUGIN_NAME,"检测和提供实体类型的族",[0,0,1,Version.Beta],{Author:"New Moon Studio",GitHub:"https://github.com/231software/EntityFamilyDetect",Developers:"Minimouse"})