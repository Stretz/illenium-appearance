if not Config.UseTarget then return end

local TargetPeds = {
    Store = {},
    ClothingRoom = {},
    PlayerOutfitRoom = {}
}

Target = {}

local function normalizeStores(stores)
    local normalized = {}
    for i = 1, #stores do
        local s = stores[i]
        local store = s
        if type(s.coords) == "table" then
            store.coords = vector4(s.coords.x or 0.0, s.coords.y or 0.0, s.coords.z or 0.0, s.coords.w or s.rotation or 0.0)
        end
        if type(s.size) == "table" then
            store.size = vector3(s.size.x or 4.0, s.size.y or 4.0, s.size.z or 4.0)
        end
        if type(s.points) == "table" then
            local points = {}
            for p = 1, #s.points do
                local pt = s.points[p]
                points[#points + 1] = vector3(pt.x or 0.0, pt.y or 0.0, pt.z or 0.0)
            end
            store.points = points
        end
        normalized[#normalized + 1] = store
    end
    return normalized
end

function Target.IsOX()
    return GetResourceState("ox_target") ~= "missing"
end

function Target.IsQB()
    return GetResourceState("qb-target") ~= "missing"
end

local function RemoveTargetPeds(peds)
    for i = 1, #peds, 1 do
        DeletePed(peds[i])
    end
end

local function RemoveTargets()
    if Config.EnablePedsForShops then
        RemoveTargetPeds(TargetPeds.Store)
    else
        for k, v in pairs(Config.Stores) do
            Target.RemoveZone(v.type .. k)
        end
    end

    if Config.EnablePedsForClothingRooms then
        RemoveTargetPeds(TargetPeds.ClothingRoom)
    else
        for k, v in pairs(Config.ClothingRooms) do
            Target.RemoveZone("clothing_" .. (v.job or v.gang) .. k)
        end
    end

    if Config.EnablePedsForPlayerOutfitRooms then
        RemoveTargetPeds(TargetPeds.PlayerOutfitRoom)
    else
        for k in pairs(Config.PlayerOutfitRooms) do
            Target.RemoveZone("playeroutfitroom_" .. k)
        end
    end
end

AddEventHandler("onResourceStop", function(resource)
    if resource == GetCurrentResourceName() then
        if Target.IsTargetStarted() then
            RemoveTargets()
        end
    end
end)

local function CreatePedAtCoords(pedModel, coords, scenario)
    pedModel = type(pedModel) == "string" and joaat(pedModel) or pedModel
    lib.requestModel(pedModel)
    local ped = CreatePed(0, pedModel, coords.x, coords.y, coords.z - 0.98, coords.w, false, false)
    TaskStartScenarioInPlace(ped, scenario, true)
    FreezeEntityPosition(ped, true)
    SetEntityVisible(ped, true)
    SetEntityInvincible(ped, true)
    PlaceObjectOnGroundProperly(ped)
    SetBlockingOfNonTemporaryEvents(ped, true)
    return ped
end

local function SetupStoreTarget(targetConfig, action, k, v)
    local parameters = {
        options = {{
            type = "client",
            action = action,
            icon = targetConfig.icon,
            label = targetConfig.label
        }},
        distance = targetConfig.distance,
        rotation = v.rotation
    }

    if Config.EnablePedsForShops then
        TargetPeds.Store[k] = CreatePedAtCoords(v.targetModel or targetConfig.model, v.coords, v.targetScenario or targetConfig.scenario)
        Target.AddTargetEntity(TargetPeds.Store[k], parameters)
    elseif v.usePoly then
        Target.AddPolyZone(v.type .. k, v.points, parameters)
    else
        Target.AddBoxZone(v.type .. k, v.coords, v.size, parameters)
    end
end

local function SetupStoreTargets()
    for k, v in pairs(Config.Stores) do
        local targetConfig = Config.TargetConfig[v.type]
        local action

        if v.type == "barber" then
            action = OpenBarberShop
        elseif v.type == "clothing" then
            action = function()
                TriggerEvent("illenium-appearance:client:openClothingShopMenu")
            end
        elseif v.type == "tattoo" then
            action = OpenTattooShop
        elseif v.type == "surgeon" then
            action = OpenSurgeonShop
        end

        if not (Config.RCoreTattoosCompatibility and v.type == "tattoo") then
            SetupStoreTarget(targetConfig, action, k, v)
        end
    end
end

local function SetupClothingRoomTargets()
    for k, v in pairs(Config.ClothingRooms) do
        local targetConfig = Config.TargetConfig["clothingroom"]
        local action = function()
            local outfits = GetPlayerJobOutfits(v.job)
            TriggerEvent("illenium-appearance:client:openJobOutfitsMenu", outfits)
        end

        local parameters = {
            options = {{
                type = "client",
                action = action,
                icon = targetConfig.icon,
                label = targetConfig.label,
                canInteract = v.job and CheckDuty or nil,
                job = v.job,
                gang = v.gang
            }},
            distance = targetConfig.distance,
            rotation = v.rotation
        }

        local key = "clothing_" .. (v.job or v.gang) .. k
        if Config.EnablePedsForClothingRooms then
            TargetPeds.ClothingRoom[k] = CreatePedAtCoords(v.targetModel or targetConfig.model, v.coords, v.targetScenario or targetConfig.scenario)
            Target.AddTargetEntity(TargetPeds.ClothingRoom[k], parameters)
        elseif v.usePoly then
            Target.AddPolyZone(key, v.points, parameters)
        else
            Target.AddBoxZone(key, v.coords, v.size, parameters)
        end
    end
end

local function SetupPlayerOutfitRoomTargets()
    for k, v in pairs(Config.PlayerOutfitRooms) do
        local targetConfig = Config.TargetConfig["playeroutfitroom"]

        local parameters = {
            options = {{
                type = "client",
                action = function()
                    OpenOutfitRoom(v)
                end,
                icon = targetConfig.icon,
                label = targetConfig.label,
                canInteract = function()
                    return IsPlayerAllowedForOutfitRoom(v)
                end
            }},
            distance = targetConfig.distance,
            rotation = v.rotation
        }

        if Config.EnablePedsForPlayerOutfitRooms then
            TargetPeds.PlayerOutfitRoom[k] = CreatePedAtCoords(v.targetModel or targetConfig.model, v.coords, v.targetScenario or targetConfig.scenario)
            Target.AddTargetEntity(TargetPeds.PlayerOutfitRoom[k], parameters)
        elseif v.usePoly then
            Target.AddPolyZone("playeroutfitroom_" .. k, v.points, parameters)
        else
            Target.AddBoxZone("playeroutfitroom_" .. k, v.coords, v.size, parameters)
        end
    end
end

local function SetupTargets()
    SetupStoreTargets()
    SetupClothingRoomTargets()
    SetupPlayerOutfitRoomTargets()
end

local function RefreshTargets()
    RemoveTargets()
    TargetPeds.Store = {}
    TargetPeds.ClothingRoom = {}
    TargetPeds.PlayerOutfitRoom = {}
    SetupTargets()
end

CreateThread(function()
    if Config.UseTarget then
        local stores = lib.callback.await("illenium-appearance:server:getStores", false)
        if stores then
            Config.Stores = normalizeStores(stores)
        end
        SetupTargets()
    end
end)

RegisterNetEvent("illenium-appearance:client:syncStores", function(stores)
    if not stores then return end
    Config.Stores = normalizeStores(stores)
    if Config.UseTarget and Target.IsTargetStarted() then
        RefreshTargets()
    end
    ResetBlips()
end)
