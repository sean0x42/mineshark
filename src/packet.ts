import { State } from "./state";

export enum PacketSource {
  Client = "client",
  Server = "server",
}

export enum PacketKind {
  // Handshaking
  Handshake = "handshake",

  // Status
  Request = "request",
  Response = "response",
  Ping = "ping",
  Pong = "pong",

  // Login
  Login = "login",
  LoginSuccess = "loginSuccess",
  EncryptionRequest = "encryptionRequest",
  EncryptionResponse = "encryptionResponse",
  LoginPluginRequest = "loginPluginRequest",
  LoginPluginResponse = "loginPluginResponse",
  SetCompression = "setCompression",
  LoginDisconnect = "loginDisconnect",

  // Play
  SpawnEntity = "spawnEntity",
  SpawnExperienceOrb = "spawnExperienceOrb",
  SpawnLivingEntity = "spawnLivingEntity",
  SpawnPainting = "spawnPainting",
  SpawnPlayer = "spawnPlayer",
  SculkVibrationSignal = "sculkVibrationSignal",
  EntityAnimation = "entityAnimation",
  Statistics = "statistics",
  AcknowledgePlayerDigging = "acknowledgePlayerDigging",
  BlockBreakAnimation = "blockBreakAnimation",
  BlockEntityData = "blockEntityData",
  BlockAction = "blockAction",
  BlockChange = "blockChange",
  BossBar = "bossBar",
  SetDifficulty = "setDifficulty",
  ChatMessage = "chatMessage",
  SendChatMessage = "sendChatMessage",
  ClearTitles = "clearTitles",
  TabCompleteRequest = "tabCompleteRequest",
  TabCompleteResponse = "tabCompleteResponse",
  DeclareCommands = "declareCommands",
  CloseWindow = "closeWindow",
  MutateWindowItems = "mutateWindowItems",
  SetWindowProperty = "setWindowProperty",
  SetSlot = "setSlot",
  SetCooldown = "setCooldown",
  PluginMessage = "pluginMessage",
  PlayNamedSoundEffect = "playNamedSoundEffect",
  Disconnect = "disconnect",
  TriggerEntityStatus = "triggerEntityStatus",
  TriggerExplosion = "triggerExplosion",
  UnloadChunk = "unloadChunk",
  SetGameState = "setGameState",
  OpenHorseWindow = "openHorseWindow",
  ConfigureWorldBorder = "configureWorldBorder",
  ClientKeepAlive = "clientKeepAlive",
  ServerKeepAlive = "serverKeepAlive",
  DescribeChunk = "describeChunk",
  PlayEffect = "playEffect",
  ShowParticle = "showParticle",
  UpdateLight = "updateLight",
  JoinGame = "joinGame",
  SetMapData = "setMapData",
  ShowTradeList = "showTradeList",
  SetEntityPosition = "setEntityPosition",
  SetEntityPositionAndRotation = "setEntityPositionAndRotation",
  SetEntityRotation = "setEntityRotation",
  VehicleMove = "vehicleMovie",
  OpenBook = "openBook",
  OpenWindow = "openWindow",
  OpenSignEditor = "openSignEditor",
  CraftRecipeResponse = "craftRecipeResponse",
  SetPlayerAttributes = "setPlayerAttributes",
  DeathCombatEvent = "deathCombatEvent",
  PlayerListInfo = "playerListInfo",
  FacePlayer = "facePlayer",
  PlayerPosition = "playerPosition",
  UnlockRecipes = "unlockRecipes",
  DestroyEntities = "destroyEntities",
  RemoveEntityEffect = "removeEntityEffect",
  ResourcePackSend = "resourcePackSend",
  Respawn = "respawn",
  EntityHeadLook = "entityHeadLook",
  MultiBlockChange = "multiBlockChange",
  SelectAdvancementTab = "selectAdvancementTab",
  ShowActionBarMessage = "showActionBarMessage",
  SetWorldBorderCenter = "setWorldBorderCenter",
  SetWorldBorderLerp = "setWorldBorderLerp",
  SetWorldBorderSize = "setWorldBorderSize",
  SetWorldBorderDelay = "setWorldBorderDelay",
  SetWorldBorderReach = "setWorldBorderReach",
  SetCamera = "setCamera",
  SetSelectedSlot = "setSelectedSlot",
  SetViewPosition = "setViewPosition",
  SetViewDistance = "setViewDistance",
  SetSpawnPosition = "setSpawnPosition",
  ShowScoreboard = "showScoreboard",
  SetEntityMetadata = "setEntityMetadata",
  AttachEntity = "attachEntity",
  SetEntityVelocity = "setEntityVelocity",
  SetEntityEquipment = "setEntityEquipment",
  SetExperienceLevel = "setExperienceLevel",
  SetHealth = "setHealth",
  ManageScoreboardObjective = "manageScoreboardObjective",
  SetPassengers = "setPassengers",
  ManageTeams = "manageTeams",
  SetScore = "setScore",
  SetTitle = "setTitle",
  SetTitleTiming = "setTitleTiming",
  SetSubtitle = "setSubtitle",
  SetTime = "setTime",
  PlayEntitySoundEffect = "playEntitySoundEffect",
  PlaySoundEffect = "playSoundEffect",
  StopSound = "stopSound",
  SetPlayerListText = "setPlayerListText",
  NbtQueryRequest = "nbtQueryRequest",
  NbtQueryResponse = "nbtQueryResponse",
  CollectItem = "collectItem",
  TeleportEntity = "teleportEntity",
  Advancement = "advancement",
  SetEntityAttribute = "setEntityAttribute",
  DeclareRecipes = "declareRecipes",
  TeleportConfirm = "teleportConfirm",
  SetClientStatus = "setClientStatus",
  SetClientSettings = "setClientSettings",
  ClickWindowButton = "clickWindowButton",
  ClickWindow = "clickWindow",
  ClientCloseWindow = "clientCloseWindow",
  ClientPluginMessage = "clientPluginMessage",
  EditBook = "editBook",
  InteractEntity = "interactEntity",
  UpdatePlayerPosition = "updatePlayerPosition",
}

export interface Packet {
  id: number;
  source: PacketSource;
  kind: PacketKind;
  payload: Record<string, unknown> | null;
}

export const kindToId: Record<PacketKind, number> = {
  // Handshaking
  [PacketKind.Handshake]: 0x0,

  // Status
  [PacketKind.Request]: 0x0,
  [PacketKind.Response]: 0x0,
  [PacketKind.Ping]: 0x01,
  [PacketKind.Pong]: 0x01,

  // Login
  [PacketKind.Login]: 0x0,
  [PacketKind.LoginSuccess]: 0x02,
  [PacketKind.EncryptionRequest]: 0x01,
  [PacketKind.EncryptionResponse]: 0x01,
  [PacketKind.LoginPluginRequest]: 0x04,
  [PacketKind.LoginPluginResponse]: 0x02,
  [PacketKind.SetCompression]: 0x03,
  [PacketKind.LoginDisconnect]: 0x0,

  // Play
  [PacketKind.SpawnEntity]: 0x0,
  [PacketKind.SpawnExperienceOrb]: 0x0,
  [PacketKind.SpawnLivingEntity]: 0x0,
  [PacketKind.SpawnPainting]: 0x0,
  [PacketKind.SpawnPlayer]: 0x0,
  [PacketKind.SculkVibrationSignal]: 0x0,
  [PacketKind.EntityAnimation]: 0x0,
  [PacketKind.Statistics]: 0x0,
  [PacketKind.AcknowledgePlayerDigging]: 0x0,
  [PacketKind.BlockBreakAnimation]: 0x0,
  [PacketKind.BlockEntityData]: 0x0,
  [PacketKind.BlockAction]: 0x0,
  [PacketKind.BlockChange]: 0x0,
  [PacketKind.BossBar]: 0x0,
  [PacketKind.SetDifficulty]: 0x0,
  [PacketKind.ChatMessage]: 0x0,
  [PacketKind.SendChatMessage]: 0x0,
  [PacketKind.ClearTitles]: 0x0,
  [PacketKind.TabCompleteRequest]: 0x0,
  [PacketKind.TabCompleteResponse]: 0x0,
  [PacketKind.DeclareCommands]: 0x0,
  [PacketKind.CloseWindow]: 0x0,
  [PacketKind.MutateWindowItems]: 0x0,
  [PacketKind.SetWindowProperty]: 0x0,
  [PacketKind.SetSlot]: 0x0,
  [PacketKind.SetCooldown]: 0x0,
  [PacketKind.PluginMessage]: 0x0,
  [PacketKind.PlayNamedSoundEffect]: 0x0,
  [PacketKind.Disconnect]: 0x0,
  [PacketKind.TriggerEntityStatus]: 0x0,
  [PacketKind.TriggerExplosion]: 0x0,
  [PacketKind.UnloadChunk]: 0x0,
  [PacketKind.SetGameState]: 0x0,
  [PacketKind.OpenHorseWindow]: 0x0,
  [PacketKind.ConfigureWorldBorder]: 0x0,
  [PacketKind.ClientKeepAlive]: 0x0,
  [PacketKind.ServerKeepAlive]: 0x0,
  [PacketKind.DescribeChunk]: 0x0,
  [PacketKind.PlayEffect]: 0x0,
  [PacketKind.ShowParticle]: 0x0,
  [PacketKind.UpdateLight]: 0x0,
  [PacketKind.JoinGame]: 0x0,
  [PacketKind.SetMapData]: 0x0,
  [PacketKind.ShowTradeList]: 0x0,
  [PacketKind.SetEntityPosition]: 0x0,
  [PacketKind.SetEntityPositionAndRotation]: 0x0,
  [PacketKind.SetEntityRotation]: 0x0,
  [PacketKind.VehicleMove]: 0x0,
  [PacketKind.OpenBook]: 0x0,
  [PacketKind.OpenWindow]: 0x0,
  [PacketKind.OpenSignEditor]: 0x0,
  [PacketKind.CraftRecipeResponse]: 0x0,
  [PacketKind.SetPlayerAttributes]: 0x0,
  [PacketKind.DeathCombatEvent]: 0x0,
  [PacketKind.PlayerListInfo]: 0x0,
  [PacketKind.FacePlayer]: 0x0,
  [PacketKind.PlayerPosition]: 0x0,
  [PacketKind.UnlockRecipes]: 0x0,
  [PacketKind.DestroyEntities]: 0x0,
  [PacketKind.RemoveEntityEffect]: 0x0,
  [PacketKind.ResourcePackSend]: 0x0,
  [PacketKind.Respawn]: 0x0,
  [PacketKind.EntityHeadLook]: 0x0,
  [PacketKind.MultiBlockChange]: 0x0,
  [PacketKind.SelectAdvancementTab]: 0x0,
  [PacketKind.ShowActionBarMessage]: 0x0,
  [PacketKind.SetWorldBorderCenter]: 0x0,
  [PacketKind.SetWorldBorderLerp]: 0x0,
  [PacketKind.SetWorldBorderSize]: 0x0,
  [PacketKind.SetWorldBorderDelay]: 0x0,
  [PacketKind.SetWorldBorderReach]: 0x0,
  [PacketKind.SetCamera]: 0x0,
  [PacketKind.SetSelectedSlot]: 0x0,
  [PacketKind.SetViewPosition]: 0x0,
  [PacketKind.SetViewDistance]: 0x0,
  [PacketKind.SetSpawnPosition]: 0x0,
  [PacketKind.ShowScoreboard]: 0x0,
  [PacketKind.SetEntityMetadata]: 0x0,
  [PacketKind.AttachEntity]: 0x0,
  [PacketKind.SetEntityVelocity]: 0x0,
  [PacketKind.SetEntityEquipment]: 0x0,
  [PacketKind.SetExperienceLevel]: 0x0,
  [PacketKind.SetHealth]: 0x0,
  [PacketKind.ManageScoreboardObjective]: 0x0,
  [PacketKind.SetPassengers]: 0x0,
  [PacketKind.ManageTeams]: 0x0,
  [PacketKind.SetScore]: 0x0,
  [PacketKind.SetTitle]: 0x0,
  [PacketKind.SetTitleTiming]: 0x0,
  [PacketKind.SetSubtitle]: 0x0,
  [PacketKind.SetTime]: 0x0,
  [PacketKind.PlayEntitySoundEffect]: 0x0,
  [PacketKind.PlaySoundEffect]: 0x0,
  [PacketKind.StopSound]: 0x0,
  [PacketKind.SetPlayerListText]: 0x0,
  [PacketKind.NbtQueryRequest]: 0x0,
  [PacketKind.NbtQueryResponse]: 0x0,
  [PacketKind.CollectItem]: 0x0,
  [PacketKind.TeleportEntity]: 0x0,
  [PacketKind.Advancement]: 0x0,
  [PacketKind.SetEntityAttribute]: 0x0,
  [PacketKind.DeclareRecipes]: 0x0,
  [PacketKind.TeleportConfirm]: 0x0,
  [PacketKind.SetClientStatus]: 0x0,
  [PacketKind.SetClientSettings]: 0x0,
  [PacketKind.ClickWindowButton]: 0x0,
  [PacketKind.ClickWindow]: 0x0,
  [PacketKind.ClientCloseWindow]: 0x0,
  [PacketKind.ClientPluginMessage]: 0x0,
  [PacketKind.EditBook]: 0x0,
  [PacketKind.InteractEntity]: 0x0,
  [PacketKind.UpdatePlayerPosition]: 0x0,
};

export function getPacketId(kind: PacketKind): number {
  return kindToId[kind];
}

// Note for brevity, if a packet is not listed assume it is a Play packet.
const kindToState: Partial<Record<PacketKind, State>> = {
  // Handshaking
  [PacketKind.Handshake]: State.Handshaking,

  // Status
  [PacketKind.Request]: State.Status,
  [PacketKind.Response]: State.Status,
  [PacketKind.Ping]: State.Status,
  [PacketKind.Pong]: State.Status,

  // Login
  [PacketKind.Login]: State.Login,
  [PacketKind.LoginSuccess]: State.Login,
  [PacketKind.EncryptionRequest]: State.Login,
  [PacketKind.EncryptionResponse]: State.Login,
  [PacketKind.LoginPluginRequest]: State.Login,
  [PacketKind.LoginPluginResponse]: State.Login,
  [PacketKind.SetCompression]: State.Login,
  [PacketKind.LoginDisconnect]: State.Login,
};

export function inferStateFromPacketKind(kind: PacketKind): State {
  return kindToState[kind] ?? State.Play;
}
