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
name_list : ["file_path","callback","channel","volume","mute","instance"],
type_list : ["string","Functor<(string,int)>","int","double","bool","native PIXI.IMediaInstance"],
option_map : {}
})

ALittle.AudioSystem = JavaScript.Class(undefined, {
	Ctor : function() {
		this._chunk_creator_id = 0;
		this._file_map = {};
		this._stream_sample_rate = 8000;
		this._stream_sample_channels = 1;
		this._stream_left_sample = [];
		this._stream_left_sample_len = 0;
		this._stream_right_sample = [];
		this._stream_right_sample_len = 0;
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
		if (info.instance.set !== undefined) {
			info.instance.set("volume", real_volume);
		}
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
		PIXI.sound.add(file_path, file_path);
		this._file_map[file_path] = true;
	},
	RemoveChunkCache : function(file_path) {
		PIXI.sound.remove(file_path);
		this._file_map[file_path] = false;
	},
	StartChannel : function(file_path, loop, callback) {
		if (loop === undefined) {
			loop = 1;
		}
		{
			if (this._file_map[file_path] === undefined) {
				this._file_map[file_path] = true;
				PIXI.sound.add(file_path, file_path);
			}
			this._chunk_creator_id = this._chunk_creator_id + (1);
			let channel = this._chunk_creator_id;
			let options = {};
			options.loop = loop !== 1;
			options.complete = this.HandleAudioChannelStoppedEvent.bind(this, channel);
			let instance = PIXI.sound.play(file_path, options);
			let info = {};
			info.file_path = file_path;
			info.callback = callback;
			info.channel = channel;
			info.instance = instance;
			info.volume = 1;
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
		info.instance.stop();
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
		this.StopStream();
		this._stream_sample_rate = sample_rate;
		this._stream_sample_channels = channels;
		{
			if (AudioContext !== undefined) {
				this._audio_context = new AudioContext();
			} else if (webkitAudioContext !== undefined) {
				this._audio_context = new webkitAudioContext();
			} else {
				return false;
			}
			this._audio_script_node = this._audio_context.createScriptProcessor(4096, 0, channels);
			this._audio_script_node.onaudioprocess = this.OnAudioProcess.bind(this);
			this._audio_script_node.connect(this._audio_context.destination);
			return true;
		}
	},
	OnAudioProcess : function(event) {
		let left_buffer = event.inputBuffer.getChannelData(0);
		let right_buffer = event.inputBuffer.getChannelData(1);
		if (this._stream_sample_channels >= 1) {
			let length = left_buffer.length;
			if (length > this._stream_left_sample_len) {
				length = this._stream_left_sample_len;
			}
			let buffer = left_buffer;
			for (let i = 1; i <= length; i += 1) {
				buffer[i - 1] = this._stream_left_sample[i - 1] / 32768;
			}
			for (let i = length + 1; i <= this._stream_left_sample_len; i += 1) {
				this._stream_left_sample[i - length - 1] = this._stream_left_sample[i - 1];
			}
			this._stream_left_sample_len = this._stream_left_sample_len - (length);
		}
		if (this._stream_sample_channels >= 2) {
			let length = right_buffer.length;
			if (length > this._stream_right_sample_len) {
				length = this._stream_right_sample_len;
			}
			let buffer = right_buffer;
			for (let i = 1; i <= length; i += 1) {
				buffer[i - 1] = this._stream_right_sample[i - 1] / 32768;
			}
			for (let i = length + 1; i <= this._stream_right_sample_len; i += 1) {
				this._stream_right_sample[i - length - 1] = this._stream_right_sample[i - 1];
			}
			this._stream_right_sample_len = this._stream_right_sample_len - (length);
		}
	},
	PushStreamSample : function(left_sample, right_sample) {
		{
			this._stream_left_sample_len = this._stream_left_sample_len + (1);
			this._stream_left_sample[this._stream_left_sample_len - 1] = left_sample;
			this._stream_right_sample_len = this._stream_right_sample_len + (1);
			this._stream_right_sample[this._stream_right_sample_len - 1] = right_sample;
		}
	},
	StopStream : function() {
		if (this._audio_context !== undefined) {
			if (this._audio_script_node !== undefined) {
				this._audio_script_node.disconnect(this._audio_context.destination);
				this._audio_script_node.onaudioprocess = undefined;
				this._audio_script_node = undefined;
			}
			this._audio_context.close();
			this._audio_context = undefined;
		}
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