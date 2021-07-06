{
if (typeof ALittle === "undefined") window.ALittle = {};


if (ALittle.LoopObject === undefined) throw new Error(" extends class:ALittle.LoopObject is undefined");
ALittle.LoopRit = JavaScript.Class(ALittle.LoopObject, {
	Ctor : function(target, property, target_value, total_time, delay_time, func) {
		this._target = target;
		this._target_value = target_value;
		this._func = func;
		if (total_time === undefined || total_time < 0) {
			total_time = 0;
		}
		this._total_time = total_time;
		if (delay_time === undefined || delay_time < 0) {
			delay_time = 0;
		}
		this._total_delay_time = delay_time;
		this._accumulate_time = 0;
		this._accumulate_delay_time = 0;
		if (target === undefined || target[property] === undefined) {
			this._accumulate_time = this._total_time;
			ALittle.Log("LoopRit create failed:loop_target is nil or property is nil");
			return;
		}
		this._property = property;
		this._init_value = undefined;
	},
	Reset : function() {
		this._accumulate_time = 0;
		this._accumulate_delay_time = 0;
		this._init_value = undefined;
	},
	IsCompleted : function() {
		return this._accumulate_time >= this._total_time;
	},
	SetCompleted : function() {
		if (this._accumulate_time >= this._total_time) {
			return;
		}
		this.SetTime(this._total_time + this._total_delay_time);
	},
	SetTime : function(time) {
		this._accumulate_delay_time = 0;
		this._accumulate_time = 0;
		if (time <= 0) {
			return [0, false];
		}
		if (time <= this._total_delay_time) {
			this._accumulate_delay_time = time;
			return [0, false];
		}
		this._accumulate_delay_time = this._total_delay_time;
		time = time - (this._total_delay_time);
		if (time < this._total_time) {
			this._accumulate_time = time;
			let current_value = (this._target_value - this._init_value) * ALittle.Math_Sin((this._accumulate_time / this._total_time) * 1.57) + this._init_value;
			this._target[this._property] = current_value;
			return [0, false];
		}
		this._target[this._property] = this._target_value;
		this._accumulate_time = this._total_time;
		if (this._func !== undefined) {
			this._func();
		}
		return [time - this._total_time, true];
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
		if (this._init_value === undefined) {
			this._init_value = this._target[this._property];
		}
		this._accumulate_time = this._accumulate_time + (frame_time);
		if (this._accumulate_time >= this._total_time) {
			frame_time = this._accumulate_time - this._total_time;
			this._accumulate_time = this._total_time;
		} else {
			frame_time = 0;
		}
		let current_value = (this._target_value - this._init_value) * ALittle.Math_Sin((this._accumulate_time / this._total_time) * 1.57) + this._init_value;
		this._target[this._property] = current_value;
		if (this._func !== undefined) {
			this._func();
		}
		return frame_time;
	},
}, "ALittle.LoopRit");

}