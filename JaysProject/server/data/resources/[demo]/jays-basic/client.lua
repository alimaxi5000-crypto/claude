AddEventHandler('onClientResourceStart', function(resource)
	if resource == GetCurrentResourceName() then
		print(('client resource started, server id %d'):format(GetPlayerServerId(PlayerId())))
		TriggerServerEvent('jays-basic:hello', 'hello from ' .. GetPlayerName(PlayerId()))
	end
end)

RegisterNetEvent('jays-basic:welcome', function(message)
	print('[welcome] ' .. message)
end)

RegisterCommand('ping', function()
	TriggerServerEvent('jays-basic:ping', GetGameTimer())
end, false)

RegisterNetEvent('jays-basic:pong', function(sentAt)
	print(('[ping] event round trip %d ms'):format(GetGameTimer() - sentAt))
end)

RegisterCommand('threads', function(_, args)
	local count = tonumber(args[1]) or 3
	for i = 1, count do
		CreateThread(function()
			Wait(i * 100)
			print(('[threads] thread %d finished after %d ms'):format(i, i * 100))
		end)
	end
end, false)
