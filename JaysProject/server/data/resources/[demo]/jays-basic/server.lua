-- connection screening with deferrals (FiveM playerConnecting semantics)
AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
	if name == Config.bannedName then
		setKickReason('You are banned from this test server.')
		CancelEvent()
		return
	end

	deferrals.defer()
	Wait(0)
	deferrals.update(('Checking %s...'):format(name))
	Wait(100)
	deferrals.done()
end)

AddEventHandler('playerJoining', function()
	print(('player %s joined as id %s'):format(GetPlayerName(source), source))
end)

AddEventHandler('playerDropped', function(reason)
	print(('player %s left: %s'):format(source, reason))
end)

RegisterNetEvent('jays-basic:hello', function(msg)
	local player = source
	print(('player %s (%s) says: %s'):format(player, GetPlayerName(player), msg))
	TriggerClientEvent('jays-basic:welcome', player,
		('%s! %s (player %d of %d)'):format(exports['jays-basic']:getGreeting(GetPlayerName(player)),
			GetConvar('jays_motd', 'no motd'), player, #GetPlayers()))
end)

RegisterNetEvent('jays-basic:ping', function(sentAt)
	TriggerClientEvent('jays-basic:pong', source, sentAt)
end)

exports('getGreeting', function(name)
	return ('%s, %s'):format(Config.greeting, name)
end)

RegisterCommand('players', function(src)
	local ids = GetPlayers()
	print(('%d player(s) online'):format(#ids))
	for _, id in ipairs(ids) do
		print(('  [%s] %s ping=%dms %s'):format(id, GetPlayerName(id), GetPlayerPing(id),
			table.concat(GetPlayerIdentifiers(id), ' ')))
	end
end, true)

print('jays-basic server script loaded')
