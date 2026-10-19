RegisterCommand('say', function(_, args, raw)
	local text = raw:sub(5)
	if #text > 0 then
		TriggerServerEvent('jays-chat:send', text)
	end
end, false)

RegisterNetEvent('jays-chat:message', function(author, text)
	print(('[chat] %s: %s'):format(author, text))
end)
