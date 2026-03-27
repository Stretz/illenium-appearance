local function getStoreTypeOptions()
    return {
        { label = "Clothing", value = "clothing" },
        { label = "Barber", value = "barber" },
        { label = "Tattoo", value = "tattoo" },
        { label = "Surgeon", value = "surgeon" }
    }
end

local function shouldUseInternalMenu()
    return Config.MenuSystem == "internal"
end

local function openInternalMenu(startMenuId, menus)
    TriggerEvent("illenium-appearance:client:openInternalMenu", {
        startMenuId = startMenuId,
        menus = menus
    })
end

local function openStoreAdminMenu()
    if shouldUseInternalMenu() then
        local mainId = "illenium_appearance_store_admin_main"
        local mainMenu = {
            id = mainId,
            title = "Store Admin",
            options = {
                {
                    title = "Create Store At My Position",
                    description = "Create a store zone using your current position and heading",
                    event = "illenium-appearance:client:storeAdminCreate"
                },
                {
                    title = "Manage Created Stores",
                    description = "Edit or delete DB-backed stores",
                    event = "illenium-appearance:client:storeAdminManageList"
                }
            }
        }

        openInternalMenu(mainId, {
            [mainId] = mainMenu
        })
        return
    end

    local mainId = "illenium_appearance_store_admin_main"
    lib.registerContext({
        id = mainId,
        title = "Store Admin",
        options = {
            {
                title = "Create Store At My Position",
                description = "Create a store zone using your current position and heading",
                event = "illenium-appearance:client:storeAdminCreate"
            },
            {
                title = "Manage Created Stores",
                description = "Edit or delete DB-backed stores",
                event = "illenium-appearance:client:storeAdminManageList"
            }
        }
    })
    lib.showContext(mainId)
end

local function collectStoreInputs(defaults, includeType)
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    local heading = GetEntityHeading(ped)
    local dialog = {
        {
            type = "input",
            label = "Label (optional)",
            default = defaults and defaults.label or ""
        },
    }

    if includeType then
        dialog[#dialog + 1] = {
            type = "select",
            label = "Store Type",
            default = defaults and defaults.type or "clothing",
            options = getStoreTypeOptions(),
            required = true
        }
    end

    dialog[#dialog + 1] = {
        type = "number",
        label = "Rotation / Heading",
        default = defaults and defaults.rotation or heading,
        required = true
    }
    dialog[#dialog + 1] = {
        type = "number",
        label = "Zone Size X",
        default = defaults and defaults.size and defaults.size.x or 4,
        required = true
    }
    dialog[#dialog + 1] = {
        type = "number",
        label = "Zone Size Y",
        default = defaults and defaults.size and defaults.size.y or 4,
        required = true
    }
    dialog[#dialog + 1] = {
        type = "number",
        label = "Zone Size Z",
        default = defaults and defaults.size and defaults.size.z or 4,
        required = true
    }
    dialog[#dialog + 1] = {
        type = "input",
        label = "Job Restriction (optional)",
        default = defaults and defaults.job or ""
    }
    dialog[#dialog + 1] = {
        type = "input",
        label = "Gang Restriction (optional)",
        default = defaults and defaults.gang or ""
    }
    dialog[#dialog + 1] = {
        type = "checkbox",
        label = "Show Blip",
        checked = defaults and defaults.showBlip ~= nil and defaults.showBlip or true
    }

    local response = lib.inputDialog("Store Setup", dialog)
    if not response then return nil end

    local idx = 1
    local typeValue
    idx = idx + 1 -- skip label
    if includeType then
        typeValue = response[idx]
        idx = idx + 1
    end

    local rot = tonumber(response[idx]) or heading
    local sx = tonumber(response[idx + 1]) or 4
    local sy = tonumber(response[idx + 2]) or 4
    local sz = tonumber(response[idx + 3]) or 4
    local job = response[idx + 4]
    local gang = response[idx + 5]
    local showBlip = response[idx + 6]

    return {
        type = typeValue,
        rotation = rot,
        coords = {
            x = coords.x,
            y = coords.y,
            z = coords.z,
            w = rot
        },
        size = {
            x = sx,
            y = sy,
            z = sz
        },
        usePoly = false,
        showBlip = showBlip == true,
        job = job ~= "" and job or nil,
        gang = gang ~= "" and gang or nil
    }
end

RegisterNetEvent("illenium-appearance:client:storeAdminCreate", function()
    if shouldUseInternalMenu() then return end
    local storeData = collectStoreInputs(nil, true)
    if not storeData then return end
    TriggerServerEvent("illenium-appearance:server:addStore", storeData)
end)

RegisterNetEvent("illenium-appearance:client:storeAdminManageList", function()
    local stores = lib.callback.await("illenium-appearance:server:getDynamicStores", false) or {}
    local options = {}

    for i = 1, #stores do
        local store = stores[i]
        options[#options + 1] = {
            title = string.format("%s #%s", store.type, tostring(store.id)),
            description = string.format("%.2f, %.2f, %.2f", store.coords.x or 0.0, store.coords.y or 0.0, store.coords.z or 0.0),
            event = "illenium-appearance:client:storeAdminManageSingle",
            args = store
        }
    end

    if #options == 0 then
        options[#options + 1] = {
            title = "No DB stores yet",
            description = "Create one from the main store admin menu",
            disabled = true
        }
    end

    if shouldUseInternalMenu() then
        local mainId = "illenium_appearance_store_admin_main"
        local listId = "illenium_appearance_store_admin_list"
        local mainMenu = {
            id = mainId,
            title = "Store Admin",
            options = {
                {
                    title = "Create Store At My Position",
                    description = "Create a store zone using your current position and heading",
                    event = "illenium-appearance:client:storeAdminCreate"
                },
                {
                    title = "Manage Created Stores",
                    description = "Edit or delete DB-backed stores",
                    menu = listId
                }
            }
        }

        local listMenu = {
            id = listId,
            title = "Manage Stores",
            menu = mainId,
            options = options
        }

        openInternalMenu(listId, {
            [mainId] = mainMenu,
            [listId] = listMenu
        })
        return
    end

    local listId = "illenium_appearance_store_admin_list"
    lib.registerContext({
        id = listId,
        title = "Manage Stores",
        menu = "illenium_appearance_store_admin_main",
        options = options
    })
    lib.showContext(listId)
end)

RegisterNetEvent("illenium-appearance:client:storeAdminManageSingle", function(store)
    if not store or not store.id then return end

    if shouldUseInternalMenu() then
        local mainId = "illenium_appearance_store_admin_main"
        local listId = "illenium_appearance_store_admin_list"
        local singleId = "illenium_appearance_store_admin_single_" .. tostring(store.id)
        local stores = lib.callback.await("illenium-appearance:server:getDynamicStores", false) or {}
        local listOptions = {}

        for i = 1, #stores do
            local s = stores[i]
            listOptions[#listOptions + 1] = {
                title = string.format("%s #%s", s.type, tostring(s.id)),
                description = string.format("%.2f, %.2f, %.2f", s.coords.x or 0.0, s.coords.y or 0.0, s.coords.z or 0.0),
                menu = "illenium_appearance_store_admin_single_" .. tostring(s.id)
            }
        end

        local mainMenu = {
            id = mainId,
            title = "Store Admin",
            options = {
                {
                    title = "Create Store At My Position",
                    description = "Create a store zone using your current position and heading",
                    event = "illenium-appearance:client:storeAdminCreate"
                },
                {
                    title = "Manage Created Stores",
                    description = "Edit or delete DB-backed stores",
                    menu = listId
                }
            }
        }

        local listMenu = {
            id = listId,
            title = "Manage Stores",
            menu = mainId,
            options = listOptions
        }

        local singleMenu = {
            id = singleId,
            title = string.format("Store #%s", tostring(store.id)),
            menu = listId,
            options = {
                {
                    title = "Edit Store",
                    event = "illenium-appearance:client:storeAdminEdit",
                    args = store
                },
                {
                    title = "Delete Store",
                    event = "illenium-appearance:client:storeAdminDelete",
                    args = store.id
                }
            }
        }

        local menus = {
            [mainId] = mainMenu,
            [listId] = listMenu,
            [singleId] = singleMenu
        }

        for i = 1, #stores do
            local s = stores[i]
            local menuId = "illenium_appearance_store_admin_single_" .. tostring(s.id)
            menus[menuId] = {
                id = menuId,
                title = string.format("Store #%s", tostring(s.id)),
                menu = listId,
                options = {
                    {
                        title = "Edit Store",
                        event = "illenium-appearance:client:storeAdminEdit",
                        args = s
                    },
                    {
                        title = "Delete Store",
                        event = "illenium-appearance:client:storeAdminDelete",
                        args = s.id
                    }
                }
            }
        end

        openInternalMenu(singleId, menus)
        return
    end

    local menuId = "illenium_appearance_store_admin_single_" .. tostring(store.id)
    lib.registerContext({
        id = menuId,
        title = string.format("Store #%s", tostring(store.id)),
        menu = "illenium_appearance_store_admin_list",
        options = {
            {
                title = "Edit Store",
                event = "illenium-appearance:client:storeAdminEdit",
                args = store
            },
            {
                title = "Delete Store",
                event = "illenium-appearance:client:storeAdminDelete",
                args = store.id
            }
        }
    })
    lib.showContext(menuId)
end)

RegisterNetEvent("illenium-appearance:client:storeAdminEdit", function(store)
    if shouldUseInternalMenu() then return end
    if not store or not store.id then return end
    local updated = collectStoreInputs(store, false)
    if not updated then return end
    updated.type = store.type
    TriggerServerEvent("illenium-appearance:server:updateStore", store.id, updated)
end)

RegisterNetEvent("illenium-appearance:client:storeAdminDelete", function(storeID)
    if not storeID then return end
    local confirmed = lib.alertDialog({
        header = "Delete Store",
        content = "Delete this store location permanently?",
        centered = true,
        cancel = true
    })
    if confirmed ~= "confirm" then return end
    TriggerServerEvent("illenium-appearance:server:deleteStore", storeID)
end)

RegisterNetEvent("illenium-appearance:client:openStoreAdminMenu", openStoreAdminMenu)
