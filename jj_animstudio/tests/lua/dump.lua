-- Prints Config, ConfigServer, Locales and JJS.Events of the resource as JSON (for consistency.mjs).
--   lua5.4 tests/lua/dump.lua <resourceDir>
local dir = arg[1] or '.'
package.path = dir .. '/tests/lua/?.lua;' .. package.path
local M = require('mock')
for _, f in ipairs({ 'config/config.lua', 'config/config_server.lua', 'locales/locales.lua', 'locales/de.lua', 'locales/en.lua', 'shared/constants.lua' }) do M.loadFile(dir .. '/' .. f) end
M.print(json.encode({ Config = Config, ConfigServer = ConfigServer, Locales = Locales, Events = JJS.Events }))
