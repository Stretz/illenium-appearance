local QBCore = exports["qb-core"]:GetCoreObject()


lib.callback.register("illenium-appearance:server:GetPlayerAces", function()
    local src = source
    local allowedAces = {}
    for i = 1, #Config.Aces do
        local ace = Config.Aces[i]
        if IsPlayerAceAllowed(src, ace) then
            allowedAces[#allowedAces+1] = ace
        end
    end
    return allowedAces
end)

lib.callback.register("illenium-appearance:server:GetAdmin", function()
    local src = source
        if IsPlayerAceAllowed(src, 'admin') then
            return true
        end
end)

lib.callback.register("illenium-appearance:server:Whitelistped", function(source, code, pTarget)
    local citizenid = exports.qbx_core:GetPlayer(pTarget).PlayerData.citizenid
    print(citizenid)
    MySQL.insert(
        'INSERT INTO autherised_peds (auth, citizenid, pedcode) VALUES (?, ?, ?)',
            {
                1,
                citizenid,
                code
            })
    return 'success'

end)


lib.callback.register("illenium-appearance:server:GetPlayercids", function()
    local src = source
    local citizenid = exports.qbx_core:GetPlayer(src).PlayerData.citizenid
    local playerdata = MySQL.query.await("SELECT auth FROM autherised_peds WHERE citizenid = ?", {citizenid})
    if not playerdata then return false end
    for k, v in pairs(playerdata) do
    if v.auth == 1 then 
        
        return true
    else
        return false
    end
end 
end)

lib.callback.register("illenium-appearance:server:GetPlayerpecode", function()
    local src = source
    local citizenid = exports.qbx_core:GetPlayer(src).PlayerData.citizenid
    local playerdata = MySQL.query.await("SELECT pedcode FROM autherised_peds WHERE citizenid = ?", {citizenid})
    if not playerdata then return false end
    for k, v in pairs(playerdata) do
        return v.pedcode
    end 
end)