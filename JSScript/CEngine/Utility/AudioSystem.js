{
if (typeof ALittle === "undefined") window.ALittle = {};
let ___all_struct = ALittle.GetAllStruct();

ALittle.RegStruct(1715346212, "ALittle.Event", {
name : "ALittle.Event", ns_name : "ALittle", rl_name : "Event", hash_code : 1715346212,
name_list : ["target"],
type_list : ["ALittle.EventDispatcher"],
option_map : {}
})
ALittle.RegStruct(384201948, "ALittle.ChunkInfo", {
name : "ALittle.ChunkInfo", ns_name : "ALittle", rl_name : "ChunkInfo", hash_code : 384201948,
name_list : ["file_path","callback","channel","volume","mute"],
type_list : ["string","Functor<(string,int)>","int","double","bool"],
option_map : {}
})

ALittle.AudioSystem = JavaScript.Class(undefined, {
	Ctor : function() {
		this._chunk_creator_id = 0;
		this._chunk_map = new Map();
		this._app_background = false;
		this._all_mute = false;
		this._stream_volume = 1.0;
		this._stream_mute = false;
		A_OtherSystem.AddEventListener(___all_struct.get(521107426), this, this.HandleDidEnterBackground);
		A_OtherSystem.AddEventListener(___all_struct.get(760325696), this, this.HandleDidEnterForeground);
	},
	Setup : function(sample_rate, channels) {
	},
	HandleDidEnterBackground : function(event) {
		this._app_background = true;
		this.UpdateAllVolume();
	},
	HandleDidEnterForeground : function(event) {
		this._app_background = false;
		this.UpdateAllVolume();
	},
	UpdateChannelVolume : function(info) {
		let real_volume = info.volume;
		if (info.mute || this._app_background || this._all_mute) {
			real_volume = 0;
		}
		PIXI.sound.volume("" + info.channel, real_volume);
	},
	UpdateStreamVolume : function() {
		let real_volume = this._stream_volume;
		if (this._stream_mute || this._app_background || this._all_mute) {
			real_volume = 0;
		}
		__CPPAPI_AudioSystem.SetStreamVolume(real_volume);
	},
	UpdateAllVolume : function() {
		for (let [k, v] of this._chunk_map) {
			if (v === undefined) continue;
			this.UpdateChannelVolume(v);
		}
		this.UpdateStreamVolume();
	},
	SetAllMute : function(mute) {
		if (this._all_mute === mute) {
			return;
		}
		this._all_mute = mute;
		this.UpdateAllVolume();
	},
	GetAllMute : function() {
		return this._all_mute;
	},
	AddChunkCache : function(file_path) {
	},
	RemoveChunkCache : function(file_path) {
	},
	StartChannel : function(file_path, loop, callback) {
		if (loop === undefined) {
			loop = 1;
		}
		{
			this._chunk_creator_id = this._chunk_creator_id + (1);
			let channel = this._chunk_creator_id;
			let alias = "" + channel;
			PIXI.sound.add(alias, file_path);
			let options = {};
			options.loop = loop;
			if (options.loop <= 0) {
				options.loop = 1000000;
			}
			options.complete = this.HandleAudioChannelStoppedEvent.bind(this, channel);
			let instance = PIXI.sound.play(alias, options);
			let info = {};
			info.file_path = file_path;
			info.callback = callback;
			info.channel = channel;
			info.volume = instance.volume;
			info.mute = false;
			this._chunk_map.set(channel, info);
			this.UpdateChannelVolume(info);
			return channel;
		}
	},
	StopChannel : function(channel) {
		let info = this._chunk_map.get(channel);
		if (info === undefined) {
			return;
		}
		this._chunk_map.delete(channel);
		PIXI.sound.stop("" + channel);
	},
	SetChannelMute : function(channel, mute) {
		let info = this._chunk_map.get(channel);
		if (info === undefined) {
			return;
		}
		if (info.mute === mute) {
			return;
		}
		info.mute = mute;
		this.UpdateChannelVolume(info);
	},
	GetChannelMute : function(channel) {
		let info = this._chunk_map.get(channel);
		if (info === undefined) {
			return false;
		}
		return info.mute;
	},
	SetChannelVolume : function(channel, volume) {
		let info = this._chunk_map.get(channel);
		if (info === undefined) {
			return;
		}
		info.volume = volume;
		this.UpdateChannelVolume(info);
	},
	GetChannelVolume : function(channel) {
		let info = this._chunk_map.get(channel);
		if (info === undefined) {
			return 0;
		}
		return info.volume;
	},
	HandleAudioChannelStoppedEvent : function(channel) {
		let info = this._chunk_map.get(channel);
		if (info === undefined) {
			return;
		}
		this._chunk_map.delete(channel);
		if (info.callback === undefined) {
			return;
		}
		info.callback(info.file_path, info.channel);
	},
	StartStream : function(sample_rate, channels) {
		return __CPPAPI_AudioSystem.StartStream(sample_rate, channels);
	},
	PushStreamSample : function(left_sample, right_sample) {
		__CPPAPI_AudioSystem.PushStreamSample(left_sample, right_sample);
	},
	StopStream : function() {
		__CPPAPI_AudioSystem.StopStream();
	},
	SetStreamMute : function(mute) {
		if (this._stream_mute === mute) {
			return;
		}
		this._stream_mute = mute;
		this.UpdateStreamVolume();
	},
	GetStreamMute : function() {
		return this._stream_mute;
	},
	SetStreamVolume : function(volume) {
		this._stream_volume = volume;
		this.UpdateStreamVolume();
	},
	GetStreamVolume : function() {
		return this._stream_volume;
	},
}, "ALittle.AudioSystem");

window.A_AudioSystem = ALittle.NewObject(ALittle.AudioSystem);
}