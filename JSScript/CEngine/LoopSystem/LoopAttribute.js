{
if (typeof ALittle === "undefined") window.ALittle = {};


if (ALittle.LoopObject === undefined) throw new Error(" extends class:ALittle.LoopObject is undefined");
ALittle.LoopAttribute = JavaScript.Class(ALittle.LoopObject, {
	Ctor : function(target, property, target_value, delay_time) {
		this._target = target;
		this._property = property;
		this._target_value = target_value;
		if (delay_time === undefined || delay_time < 0) {
			delay_time = 0;
		}
		this._total_delay_time = delay_time;
		this._accumulate_count = 0;
		this._accumulate_delay_time = 0;
	},
	Reset : function() {
		this._accumulate_count = 0;
		this._accumulate_delay_time = 0;
	},
	IsCompleted : function() {
		return this._accumulate_count >= 1;
	},
	SetCompleted : function() {
		if (this._accumulate_count >= 1) {
			return;
		}
		this._accumulate_count = 1;
		this._accumulate_delay_time = this._total_delay_time;
		this._target[this._property] = this._target_value;
	},
	SetTime : function(time) {
		this._accumulate_count = 0;
		this._accumulate_delay_time = 0;
		if (time <= 0) {
			return [0, false];
		}
		if (time <= this._total_delay_time) {
			this._accumulate_delay_time = time;
			return [0, false];
		}
		this._accumulate_delay_time = this._total_delay_time;
		this._accumulate_count = 1;
		this._target[this._property] = this._target_value;
		return [time - this._total_delay_time, true];
	},
	Update : function(frame_time) {
		if (this._accumulate_delay_time < this._total_delay_time) {
			this._accumulate_delay_time = this._accumulate_delay_time + (frame_time);
			if (this._accumulate_delay_time < this._total_delay_time) {
				return 0;
			}
			frame_time = this._accumulate_delay_time - this._total_delay_time;
			this._accumulate_delay_time = this._total_delay_time;
		}
		if (this._accumulate_count >= 1) {
			return frame_time;
		}
		this._accumulate_count = 1;
		this._target[this._property] = this._target_value;
		return frame_time;
	},
}, "ALittle.LoopAttribute");

}