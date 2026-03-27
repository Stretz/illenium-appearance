local outfitCache = {}
local uniformCache = {}
local runtimeStores = {}

do
    local originalServerNotify = lib.notify
    lib.notify = function(target, payload, ...)
        if Config.MenuSystem == "internal" and type(target) == "number" and type(payload) == "table" then
            TriggerClientEvent("illenium-appearance:client:internalNotify", target, payload)
            return true
        end
        return originalServerNotify(target, payload, ...)
    end
end

local function isStoreAdmin(source)
    if source == 0 then return true end
    local storeAce = Config.StoreAdminAce
    local pedAce = Config.PedMenuGroup
    if IsPlayerAceAllowed(source, "command.storeadmin") then
        return true
    end
    if storeAce and IsPlayerAceAllowed(source, storeAce) then
        return true
    end
    if storeAce and storeAce:sub(1, 6) == "group." then
        local short = storeAce:sub(7)
        if short ~= "" and IsPlayerAceAllowed(source, short) then
            return true
        end
    end
    if pedAce and IsPlayerAceAllowed(source, pedAce) then
        return true
    end
    if pedAce and pedAce:sub(1, 6) == "group." then
        local short = pedAce:sub(7)
        if short ~= "" and IsPlayerAceAllowed(source, short) then
            return true
        end
    end
    return false
end

local function decodeStoreRow(row)
    local function toBool(value)
        if value == nil then return nil end
        if value == true or value == 1 or value == "1" then return true end
        if value == false or value == 0 or value == "0" then return false end
        return nil
    end

    local function normalizeOptionalText(value)
        if type(value) ~= "string" then
            return nil
        end
        value = value:gsub("^%s+", ""):gsub("%s+$", "")
        if value == "" then
            return nil
        end
        return value
    end

    return {
        id = row.id,
        type = type(row.type) == "string" and row.type:lower() or row.type,
        job = normalizeOptionalText(row.job),
        gang = normalizeOptionalText(row.gang),
        usePoly = toBool(row.use_poly) == true,
        showBlip = toBool(row.show_blip),
        coords = json.decode(row.coords or "{}"),
        size = row.size and json.decode(row.size) or nil,
        rotation = row.rotation or 0.0,
        points = row.points and json.decode(row.points) or nil,
        targetModel = row.target_model,
        targetScenario = row.target_scenario,
        dynamic = true
    }
end

local function loadRuntimeStores()
    Database.Stores.Init()
    local rows = Database.Stores.GetAll()
    runtimeStores = {}
    for i = 1, #rows do
        runtimeStores[#runtimeStores + 1] = decodeStoreRow(rows[i])
    end
end

local function getMergedStores()
    local merged = {}
    for i = 1, #Config.Stores do
        merged[#merged + 1] = Config.Stores[i]
    end
    for i = 1, #runtimeStores do
        merged[#merged + 1] = runtimeStores[i]
    end
    return merged
end

local function syncStoresToClients(target)
    local stores = getMergedStores()
    if target then
        TriggerClientEvent("illenium-appearance:client:syncStores", target, stores)
        return
    end
    TriggerClientEvent("illenium-appearance:client:syncStores", -1, stores)
end

local function notifyPlayer(source, payload)
    if Config.MenuSystem == "internal" then
        TriggerClientEvent("illenium-appearance:client:internalNotify", source, payload)
    else
        lib.notify(source, payload)
    end
end

local function getMoneyForShop(shopType)
    local money = 0
    if shopType == "clothing" then
        money = Config.ClothingCost
    elseif shopType == "barber" then
        money = Config.BarberCost
    elseif shopType == "tattoo" then
        money = Config.TattooCost
    elseif shopType == "surgeon" then
        money = Config.SurgeonCost
    end

    return money
end

local function getOutfitsForPlayer(citizenid)
    outfitCache[citizenid] = {}
    local result = Database.PlayerOutfits.GetAllByCitizenID(citizenid)
    for i = 1, #result, 1 do
        outfitCache[citizenid][#outfitCache[citizenid] + 1] = {
            id = result[i].id,
            name = result[i].outfitname,
            model = result[i].model,
            components = json.decode(result[i].components),
            props = json.decode(result[i].props)
        }
    end
end

local function GenerateUniqueCode()
    local code, exists
    repeat
        code = GenerateNanoID(Config.OutfitCodeLength)
        exists = Database.PlayerOutfitCodes.GetByCode(code)
    until not exists
    return code
end

-- Callback(s)

lib.callback.register("illenium-appearance:server:generateOutfitCode", function(_, outfitID)
    local existingOutfitCode = Database.PlayerOutfitCodes.GetByOutfitID(outfitID)
    if not existingOutfitCode then
        local code = GenerateUniqueCode()
        local id = Database.PlayerOutfitCodes.Add(outfitID, code)
        if not id then
            print("Something went wrong while generating outfit code")
            return
        end
        return code
    end
    return existingOutfitCode.code
end)

lib.callback.register("illenium-appearance:server:importOutfitCode", function(source, outfitName, outfitCode)
    local citizenID = Framework.GetPlayerID(source)
    local existingOutfitCode = Database.PlayerOutfitCodes.GetByCode(outfitCode)
    if not existingOutfitCode then
        return nil
    end

    local playerOutfit = Database.PlayerOutfits.GetByID(existingOutfitCode.outfitid)
    if not playerOutfit then
        return
    end

    if playerOutfit.citizenid == citizenID then return end -- Validation when someone tried to duplicate own outfit
    if Database.PlayerOutfits.GetByOutfit(outfitName, citizenID) then return end -- Validation duplicate outfit name, if validate on local id, someone can "spam error" server-sided

    local id = Database.PlayerOutfits.Add(citizenID, outfitName, playerOutfit.model, playerOutfit.components, playerOutfit.props)

    if not id then
        print("Something went wrong while importing the outfit")
        return
    end

    outfitCache[citizenID][#outfitCache[citizenID] + 1] = {
        id = id,
        name = outfitName,
        model = playerOutfit.model,
        components = json.decode(playerOutfit.components),
        props = json.decode(playerOutfit.props)
    }

    return true
end)

lib.callback.register("illenium-appearance:server:getAppearance", function(source, model)
    local citizenID = Framework.GetPlayerID(source)
    return Framework.GetAppearance(citizenID, model)
end)

lib.callback.register("illenium-appearance:server:hasMoney", function(source, shopType)
    local money = getMoneyForShop(shopType)
    if Framework.HasMoney(source, "cash", money) then
        return true, money
    else
        return false, money
    end
end)

lib.callback.register("illenium-appearance:server:payForTattoo", function(source, tattoo)
    local src = source
    local cost = tattoo.cost or Config.TattooCost

    if Framework.RemoveMoney(src, "cash", cost) then
        lib.notify(src, {
            title = _L("purchase.tattoo.success.title"),
            description = string.format(_L("purchase.tattoo.success.description"), tattoo.label, cost),
            type = "success",
            position = Config.NotifyOptions.position
        })
        return true
    else
        lib.notify(src, {
            title = _L("purchase.tattoo.failure.title"),
            description = _L("purchase.tattoo.failure.description"),
            type = "error",
            position = Config.NotifyOptions.position
        })
        return false
    end
end)

lib.callback.register("illenium-appearance:server:getOutfits", function(source)
    local citizenID = Framework.GetPlayerID(source)
    if outfitCache[citizenID] == nil then
        getOutfitsForPlayer(citizenID)
    end
    return outfitCache[citizenID]
end)

lib.callback.register("illenium-appearance:server:getManagementOutfits", function(source, mType, gender)
    local job = Framework.GetJob(source)
    if mType == "Gang" then
        job = Framework.GetGang(source)
    end

    local grade = tonumber(job.grade.level)
    local managementOutfits = {}
    local result = Database.ManagementOutfits.GetAllByJob(mType, job.name, gender)

    for i = 1, #result, 1 do
        if grade >= result[i].minrank then
            managementOutfits[#managementOutfits + 1] = {
                id = result[i].id,
                name = result[i].name,
                model = result[i].model,
                gender = result[i].gender,
                components = json.decode(result[i].components),
                props = json.decode(result[i].props)
            }
        end
    end
    return managementOutfits
end)

lib.callback.register("illenium-appearance:server:getUniform", function(source)
    return uniformCache[Framework.GetPlayerID(source)]
end)

lib.callback.register("illenium-appearance:server:getStores", function()
    return getMergedStores()
end)

lib.callback.register("illenium-appearance:server:getDynamicStores", function(source)
    if not isStoreAdmin(source) then
        return {}
    end
    return runtimeStores
end)

RegisterServerEvent("illenium-appearance:server:saveAppearance", function(appearance)
    local src = source
    local citizenID = Framework.GetPlayerID(src)
    if appearance ~= nil then
        Framework.SaveAppearance(appearance, citizenID)
    end
end)

RegisterServerEvent("illenium-appearance:server:chargeCustomer", function(shopType)
    local src = source
    local money = getMoneyForShop(shopType)
    if Framework.RemoveMoney(src, "cash", money) then
        lib.notify(src, {
            title = _L("purchase.store.success.title"),
            description = string.format(_L("purchase.store.success.description"), money, shopType),
            type = "success",
            position = Config.NotifyOptions.position
        })
    else
        lib.notify(src, {
            title = _L("purchase.store.failure.title"),
            description = _L("purchase.store.failure.description"),
            type = "error",
            position = Config.NotifyOptions.position
        })
    end
end)

RegisterNetEvent("illenium-appearance:server:saveOutfit", function(name, model, components, props)
    local src = source
    local citizenID = Framework.GetPlayerID(src)
    if outfitCache[citizenID] == nil then
        getOutfitsForPlayer(citizenID)
    end
    if model and components and props then
        local id = Database.PlayerOutfits.Add(citizenID, name, model, json.encode(components), json.encode(props))
        if not id then
            return
        end
        outfitCache[citizenID][#outfitCache[citizenID] + 1] = {
            id = id,
            name = name,
            model = model,
            components = components,
            props = props
        }
        lib.notify(src, {
            title = _L("outfits.save.success.title"),
            description = string.format(_L("outfits.save.success.description"), name),
            type = "success",
            position = Config.NotifyOptions.position
        })
    end
end)

RegisterNetEvent("illenium-appearance:server:updateOutfit", function(id, model, components, props)
    local src = source
    local citizenID = Framework.GetPlayerID(src)
    if outfitCache[citizenID] == nil then
        getOutfitsForPlayer(citizenID)
    end
    if model and components and props then
        if not Database.PlayerOutfits.Update(id, model, json.encode(components), json.encode(props)) then return end
        local outfitName = ""
        for i = 1, #outfitCache[citizenID], 1 do
            local outfit = outfitCache[citizenID][i]
            if outfit.id == id then
                outfit.model = model
                outfit.components = components
                outfit.props = props
                outfitName = outfit.name
                break
            end
        end
        lib.notify(src, {
            title = _L("outfits.update.success.title"),
            description = string.format(_L("outfits.update.success.description"), outfitName),
            type = "success",
            position = Config.NotifyOptions.position
        })
    end
end)

RegisterNetEvent("illenium-appearance:server:saveManagementOutfit", function(outfitData)
    local src = source
    local id = Database.ManagementOutfits.Add(outfitData)
    if not id then
        return
    end

    lib.notify(src, {
        title = _L("outfits.save.success.title"),
            description = string.format(_L("outfits.save.success.description"), outfitData.Name),
        type = "success",
        position = Config.NotifyOptions.position
    })
end)

RegisterNetEvent("illenium-appearance:server:deleteManagementOutfit", function(id)
    Database.ManagementOutfits.DeleteByID(id)
end)

RegisterNetEvent("illenium-appearance:server:syncUniform", function(uniform)
    local src = source
    uniformCache[Framework.GetPlayerID(src)] = uniform
end)

RegisterNetEvent("illenium-appearance:server:deleteOutfit", function(id)
    local src = source
    local citizenID = Framework.GetPlayerID(src)
    Database.PlayerOutfitCodes.DeleteByOutfitID(id)
    Database.PlayerOutfits.DeleteByID(id)

    for k, v in ipairs(outfitCache[citizenID]) do
        if v.id == id then
            table.remove(outfitCache[citizenID], k)
            break
        end
    end
end)

RegisterNetEvent("illenium-appearance:server:resetOutfitCache", function()
    local src = source
    local citizenID = Framework.GetPlayerID(src)
    if citizenID then
        outfitCache[citizenID] = nil
    end
end)

RegisterNetEvent("illenium-appearance:server:ChangeRoutingBucket", function()
    local src = source
    SetPlayerRoutingBucket(src, src)
end)

RegisterNetEvent("illenium-appearance:server:ResetRoutingBucket", function()
    local src = source
    SetPlayerRoutingBucket(src, 0)
end)

RegisterNetEvent("illenium-appearance:server:addStore", function(storeData)
    local src = source
    if not isStoreAdmin(src) then return end
    if not storeData or not storeData.type or not storeData.coords then return end

    local id = Database.Stores.Add(storeData)
    if not id then return end
    loadRuntimeStores()
    syncStoresToClients()

    notifyPlayer(src, {
        title = "Store Admin",
        description = "Store location created.",
        type = "success",
        position = Config.NotifyOptions.position
    })
end)

RegisterNetEvent("illenium-appearance:server:updateStore", function(storeID, storeData)
    local src = source
    if not isStoreAdmin(src) then return end
    if not storeID or not storeData then return end

    Database.Stores.Update(storeID, storeData)
    loadRuntimeStores()
    syncStoresToClients()

    notifyPlayer(src, {
        title = "Store Admin",
        description = "Store location updated.",
        type = "success",
        position = Config.NotifyOptions.position
    })
end)

RegisterNetEvent("illenium-appearance:server:deleteStore", function(storeID)
    local src = source
    if not isStoreAdmin(src) then return end
    if not storeID then return end

    Database.Stores.DeleteByID(storeID)
    loadRuntimeStores()
    syncStoresToClients()

    notifyPlayer(src, {
        title = "Store Admin",
        description = "Store location deleted.",
        type = "success",
        position = Config.NotifyOptions.position
    })
end)

if Config.EnablePedMenu then
    lib.addCommand("pedmenu", {
        help = _L("commands.pedmenu.title"),
        params = {
            {
                name = "playerID",
                type = "number",
                help = "Target player's server id",
                optional = true
            },
        },
        restricted = Config.PedMenuGroup
    }, function(source, args)
        local target = source
        if args.playerID then
            local citizenID = Framework.GetPlayerID(args.playerID)
            if citizenID then
                target = args.playerID
            else
                lib.notify(source, {
                    title = _L("commands.pedmenu.failure.title"),
                    description = _L("commands.pedmenu.failure.description"),
                    type = "error",
                    position = Config.NotifyOptions.position
                })
                return
            end
        end
        TriggerClientEvent("illenium-appearance:client:openClothingShopMenu", target, true)
    end)
end

if Config.EnableStoreAdminMenu then
    lib.addCommand("storeadmin", {
        help = "Open the appearance store admin menu",
        restricted = Config.StoreAdminAce or "group.admin"
    }, function(source)
        TriggerClientEvent("illenium-appearance:client:openStoreAdminMenu", source)
    end)
end

if Config.EnableJobOutfitsCommand then
    lib.addCommand("joboutfits", { help = _L("commands.joboutfits.title"), }, function(source)
        TriggerClientEvent("illenium-apearance:client:outfitsCommand", source, true)
    end)

    lib.addCommand("gangoutfits", { help = _L("commands.gangoutfits.title"), }, function(source)
        TriggerClientEvent("illenium-apearance:client:outfitsCommand", source)
    end)
end

lib.addCommand("reloadskin", { help = _L("commands.reloadskin.title") }, function(source)
    TriggerClientEvent("illenium-appearance:client:reloadSkin", source)
end)

lib.addCommand("clearstuckprops", { help = _L("commands.clearstuckprops.title") }, function(source)
    TriggerClientEvent("illenium-appearance:client:ClearStuckProps", source)
end)

CreateThread(function()
    loadRuntimeStores()
    Wait(1500)
    syncStoresToClients()
end)

AddEventHandler("playerJoining", function()
    local src = source
    Wait(2500)
    syncStoresToClients(src)
end)

lib.versionCheck("iLLeniumStudios/illenium-appearance")
