local Blips = {}
local client = client

local function normalizeStores(stores)
    local normalized = {}
    for i = 1, #stores do
        local s = stores[i]
        local store = s
        if type(s.type) == "string" then
            store.type = s.type:lower()
        end
        if type(s.coords) == "table" then
            store.coords = vector4(s.coords.x or 0.0, s.coords.y or 0.0, s.coords.z or 0.0, s.coords.w or s.rotation or 0.0)
        end
        if s.showBlip == nil and s.show_blip ~= nil then
            store.showBlip = s.show_blip == true or s.show_blip == 1 or s.show_blip == "1"
        elseif s.showBlip ~= nil then
            store.showBlip = s.showBlip == true or s.showBlip == 1 or s.showBlip == "1"
        end
        normalized[#normalized + 1] = store
    end
    return normalized
end

CreateThread(function()
    local stores = lib.callback.await("illenium-appearance:server:getStores", false)
    if stores then
        Config.Stores = normalizeStores(stores)
        ResetBlips()
    end
end)

local function ShowBlip(blipConfig, blip)
    if not blipConfig then
        return false
    end

    if blip.dynamic and blip.showBlip == false then
        return false
    end

    if blip.dynamic then
        return blip.showBlip ~= false
    end

    if blip.job and blip.job ~= "" and blip.job ~= client.job.name then
        return false
    elseif blip.gang and blip.gang ~= "" and blip.gang ~= client.gang.name then
        return false
    end

    if Config.RCoreTattoosCompatibility and blip.type == "tattoo" then
        return false
    end

    return (blipConfig.Show and blip.showBlip == nil) or blip.showBlip
end

local function CreateBlip(blipConfig, coords)
    local blip = AddBlipForCoord(coords.x, coords.y, coords.z)
    SetBlipSprite(blip, blipConfig.Sprite)
    SetBlipColour(blip, blipConfig.Color)
    SetBlipScale(blip, blipConfig.Scale)
    SetBlipAsShortRange(blip, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString(blipConfig.Name)
    EndTextCommandSetBlipName(blip)
    return blip
end

local function SetupBlips()
    for k, _ in pairs(Config.Stores) do
        local blipConfig = Config.Blips[Config.Stores[k].type]
        if blipConfig and ShowBlip(blipConfig, Config.Stores[k]) then
            local blip = CreateBlip(blipConfig, Config.Stores[k].coords)
            Blips[#Blips + 1] = blip
        end
    end
end

function ResetBlips()
    if Config.ShowNearestShopOnly then
        return
    end

    for i = 1, #Blips do
        RemoveBlip(Blips[i])
    end
    Blips = {}
    SetupBlips()
end

local function ShowNearestShopBlip()
    for k in pairs(Config.Blips) do
        Blips[k] = 0
    end
    while true do
        local coords = GetEntityCoords(cache.ped)
        for shopType, blipConfig in pairs(Config.Blips) do
            local closest = 1000000
            local closestCoords

            for _, shop in pairs(Config.Stores) do
                if shop.type == shopType and ShowBlip(blipConfig, shop) then
                    local dist = #(coords - vector3(shop.coords.xyz))
                    if dist < closest then
                        closest = dist
                        closestCoords = shop.coords
                    end
                end
            end
            if DoesBlipExist(Blips[shopType]) then
                RemoveBlip(Blips[shopType])
            end

            if closestCoords then
                Blips[shopType] = CreateBlip(blipConfig, closestCoords)
            end
        end
        Wait(Config.NearestShopBlipUpdateDelay)
    end
end

if Config.ShowNearestShopOnly then
    CreateThread(ShowNearestShopBlip)
end

RegisterNetEvent("illenium-appearance:client:syncStores", function(stores)
    if not stores then return end
    Config.Stores = normalizeStores(stores)
    ResetBlips()
    CreateThread(function()
        Wait(500)
        ResetBlips()
    end)
end)
