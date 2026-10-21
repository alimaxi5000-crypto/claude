-- Locale lookup: L('key', ...) formats the text of Config.Locale (falls back to 'en', then the key).
Locales = Locales or {}

function L(key, ...)
    local lang = Locales[Config.Locale] or Locales.en or {}
    local s = lang[key] or (Locales.en and Locales.en[key]) or key
    if select('#', ...) > 0 then
        local ok, out = pcall(string.format, s, ...)
        if ok then return out end
    end
    return s
end
