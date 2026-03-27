Database.Stores = {}

local function normalizeShowBlip(data)
    local value = data.showBlip
    if value == nil then
        value = data.show_blip
    end
    if value == nil then
        return nil
    end
    return value and 1 or 0
end

local function ensureStoresTable()
    MySQL.query.await([[
        CREATE TABLE IF NOT EXISTS `appearance_stores` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `type` VARCHAR(32) NOT NULL,
            `job` VARCHAR(64) DEFAULT NULL,
            `gang` VARCHAR(64) DEFAULT NULL,
            `use_poly` TINYINT(1) NOT NULL DEFAULT 0,
            `show_blip` TINYINT(1) DEFAULT NULL,
            `coords` LONGTEXT NOT NULL,
            `size` LONGTEXT DEFAULT NULL,
            `rotation` FLOAT DEFAULT 0,
            `points` LONGTEXT DEFAULT NULL,
            `target_model` VARCHAR(128) DEFAULT NULL,
            `target_scenario` VARCHAR(128) DEFAULT NULL,
            PRIMARY KEY (`id`)
        );
    ]])
end

function Database.Stores.Init()
    ensureStoresTable()
end

function Database.Stores.GetAll()
    return MySQL.query.await("SELECT * FROM appearance_stores ORDER BY id ASC")
end

function Database.Stores.Add(data)
    return MySQL.insert.await([[
        INSERT INTO appearance_stores
            (type, job, gang, use_poly, show_blip, coords, size, rotation, points, target_model, target_scenario)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ]], {
        data.type,
        data.job,
        data.gang,
        data.use_poly and 1 or 0,
        normalizeShowBlip(data),
        json.encode(data.coords),
        data.size and json.encode(data.size) or nil,
        data.rotation or 0.0,
        data.points and json.encode(data.points) or nil,
        data.target_model,
        data.target_scenario
    })
end

function Database.Stores.Update(id, data)
    return MySQL.update.await([[
        UPDATE appearance_stores
        SET type = ?, job = ?, gang = ?, use_poly = ?, show_blip = ?, coords = ?, size = ?, rotation = ?, points = ?, target_model = ?, target_scenario = ?
        WHERE id = ?
    ]], {
        data.type,
        data.job,
        data.gang,
        data.use_poly and 1 or 0,
        normalizeShowBlip(data),
        json.encode(data.coords),
        data.size and json.encode(data.size) or nil,
        data.rotation or 0.0,
        data.points and json.encode(data.points) or nil,
        data.target_model,
        data.target_scenario,
        id
    })
end

function Database.Stores.DeleteByID(id)
    return MySQL.query.await("DELETE FROM appearance_stores WHERE id = ?", { id })
end
