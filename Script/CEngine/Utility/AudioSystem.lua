-- ALittle Generate Lua And Do Not Edit This Line!
do
if _G.ALittle == nil then _G.ALittle = {} end
local ALittle = ALittle
local Lua = Lua
local ___rawset = rawset
local ___pairs = pairs
local ___ipairs = ipairs
local ___all_struct = ALittle.GetAllStruct()

ALittle.RegStruct(1715346212, "ALittle.Event", {
name = "ALittle.Event", ns_name = "ALittle", rl_name = "Event", hash_code = 1715346212,
name_list = {"target"},
type_list = {"ALittle.EventDispatcher"},
option_map = {}
})
ALittle.RegStruct(384201948, "ALittle.ChunkInfo", {
name = "ALittle.ChunkInfo", ns_name = "ALittle", rl_name = "ChunkInfo", hash_code = 384201948,
name_list = {"file_path","callback","channel","volume","mute"},
type_list = {"string","Functor<(string,int)>","int","double","bool"},
option_map = {}
})

ALittle.AudioSystem = Lua.Class(nil, "ALittle.AudioSystem")

function ALittle.AudioSystem:Ctor()
	___rawset(self, "_chunk_creator_id", 0)
	___rawset(self, "_chunk_map", {})
	___rawset(self, "_app_background", false)
	___rawset(self, "_all_mute", false)
	___rawset(self, "_stream_volume", 1.0)
	___rawset(self, "_stream_mute", false)
	A_OtherSystem:AddEventListener(___all_struct[521107426], self, self.HandleDidEnterBackground)
	A_OtherSystem:AddEventListener(___all_struct[760325696], self, self.HandleDidEnterForeground)
end

function ALittle.AudioSystem:Setup(sample_rate, channels)
	__CPPAPI_AudioSystem:Setup(sample_rate, channels)
end

function ALittle.AudioSystem:HandleDidEnterBackground(event)
	self._app_background = true
	self:UpdateAllVolume()
end

function ALittle.AudioSystem:HandleDidEnterForeground(event)
	self._app_background = false
	self:UpdateAllVolume()
end

function ALittle.AudioSystem:UpdateChannelVolume(info)
	local real_volume = info.volume
	if info.mute or self._app_background or self._all_mute then
		real_volume = 0
	end
	__CPPAPI_AudioSystem:SetChannelVolume(info.channel, real_volume)
end

function ALittle.AudioSystem:UpdateStreamVolume()
	local real_volume = self._stream_volume
	if self._stream_mute or self._app_background or self._all_mute then
		real_volume = 0
	end
	__CPPAPI_AudioSystem:SetStreamVolume(real_volume)
end

function ALittle.AudioSystem:UpdateAllVolume()
	for k, v in ___pairs(self._chunk_map) do
		self:UpdateChannelVolume(v)
	end
	self:UpdateStreamVolume()
end

function ALittle.AudioSystem:SetAllMute(mute)
	if self._all_mute == mute then
		return
	end
	self._all_mute = mute
	self:UpdateAllVolume()
end

function ALittle.AudioSystem:GetAllMute()
	return self._all_mute
end

function ALittle.AudioSystem:AddChunkCache(file_path)
	__CPPAPI_AudioSystem:AddChunkCache(file_path)
end

function ALittle.AudioSystem:RemoveChunkCache(file_path)
	__CPPAPI_AudioSystem:RemoveChunkCache(file_path)
end

function ALittle.AudioSystem:StartChannel(file_path, loop, callback)
	if loop == nil then
		loop = 1
	end
	do
		local channel = __CPPAPI_AudioSystem:StartChannel(file_path, loop)
		if channel < 0 then
			return -1
		end
		local info = {}
		info.file_path = file_path
		info.callback = callback
		info.channel = channel
		info.volume = __CPPAPI_AudioSystem:GetChannelVolume(channel)
		info.mute = false
		self._chunk_map[channel] = info
		self:UpdateChannelVolume(info)
		return channel
	end
end

function ALittle.AudioSystem:StopChannel(channel)
	local info = self._chunk_map[channel]
	if info == nil then
		return
	end
	self._chunk_map[channel] = nil
	__CPPAPI_AudioSystem:StopChannel(channel)
end

function ALittle.AudioSystem:SetChannelMute(channel, mute)
	local info = self._chunk_map[channel]
	if info == nil then
		return
	end
	if info.mute == mute then
		return
	end
	info.mute = mute
	self:UpdateChannelVolume(info)
end

function ALittle.AudioSystem:GetChannelMute(channel)
	local info = self._chunk_map[channel]
	if info == nil then
		return false
	end
	return info.mute
end

function ALittle.AudioSystem:SetChannelVolume(channel, volume)
	local info = self._chunk_map[channel]
	if info == nil then
		return
	end
	info.volume = volume
	self:UpdateChannelVolume(info)
end

function ALittle.AudioSystem:GetChannelVolume(channel)
	local info = self._chunk_map[channel]
	if info == nil then
		return 0
	end
	return info.volume
end

function ALittle.AudioSystem:HandleAudioChannelStoppedEvent(channel)
	local info = self._chunk_map[channel]
	if info == nil then
		return
	end
	self._chunk_map[channel] = nil
	if info.callback == nil then
		return
	end
	info.callback(info.file_path, info.channel)
end

function ALittle.AudioSystem:StartStream(sample_rate, channels)
	return __CPPAPI_AudioSystem:StartStream(sample_rate, channels)
end

function ALittle.AudioSystem:PushStreamSample(left_sample, right_sample)
	__CPPAPI_AudioSystem:PushStreamSample(left_sample, right_sample)
end

function ALittle.AudioSystem:StopStream()
	__CPPAPI_AudioSystem:StopStream()
end

function ALittle.AudioSystem:SetStreamMute(mute)
	if self._stream_mute == mute then
		return
	end
	self._stream_mute = mute
	self:UpdateStreamVolume()
end

function ALittle.AudioSystem:GetStreamMute()
	return self._stream_mute
end

function ALittle.AudioSystem:SetStreamVolume(volume)
	self._stream_volume = volume
	self:UpdateStreamVolume()
end

function ALittle.AudioSystem:GetStreamVolume()
	return self._stream_volume
end

_G.A_AudioSystem = ALittle.AudioSystem()
end