local maxLength = 200

RegisterNetEvent('jays-chat:send', function(text)
	if type(text) ~= 'string' or #text == 0 then
		return
	end
	text = text:sub(1, maxLength)
	local name = GetPlayerName(source)
	print(('[chat] %s: %s'):format(name, text))
	TriggerClientEvent('jays-chat:message', -1, name, text)
end)

AddEventHandler('playerDropped', function(reason)
	TriggerClientEvent('jays-chat:message', -1, 'server', ('%s left (%s)'):format(GetPlayerName(source) or source, reason))
end)
