{
if (typeof ALittle === "undefined") window.ALittle = {};
let ___all_struct = ALittle.GetAllStruct();


if (ALittle.DisplayObject === undefined) throw new Error(" extends class:ALittle.DisplayObject is undefined");
ALittle.Quad = JavaScript.Class(ALittle.DisplayObject, {
	Ctor : function(ctrl_sys) {
		this._show = ALittle.NewObject(JavaScript.JQuad);
		this.AddEventListener(___all_struct.get(40651933), this, this.HandleLButtonUp);
		this.AddEventListener(___all_struct.get(683647260), this, this.HandleMButtonUp);
		this.AddEventListener(___all_struct.get(734860930), this, this.HandleFLButtonUp);
	},
	HandleLButtonUp : function(event) {
		if (event.rel_x >= 0 && event.rel_y >= 0 && event.rel_x < event.target._width && event.rel_y < event.target._height) {
			let c_event = {};
			c_event.is_drag = event.is_drag;
			c_event.count = event.count;
			this.DispatchEvent(___all_struct.get(-449066808), c_event);
		}
	},
	HandleMButtonUp : function(event) {
		if (event.rel_x >= 0 && event.rel_y >= 0 && event.rel_x < event.target._width && event.rel_y < event.target._height) {
			let c_event = {};
			c_event.is_drag = event.is_drag;
			this.DispatchEvent(___all_struct.get(-1330840), c_event);
		}
	},
	HandleFLButtonUp : function(event) {
		if (event.rel_x >= 0 && event.rel_y >= 0 && event.rel_x < event.target._width && event.rel_y < event.target._height) {
			let c_event = {};
			c_event.is_drag = event.is_drag;
			this.DispatchEvent(___all_struct.get(286797479), c_event);
		}
	},
	SetPosAsLine : function(start_x, start_y, end_x, end_y) {
		this.x = start_x;
		this.y = start_y;
		let delta_x = end_x - start_x;
		let delta_y = end_y - start_y;
		let len = ALittle.Math_Sqrt(delta_x * delta_x + delta_y * delta_y);
		if (len < 0.0001) {
			return;
		}
		let rad = 0.0;
		if (delta_x >= 0) {
			if (delta_y >= 0) {
				rad = ALittle.Math_ASin(delta_y / len);
			} else {
				rad = -ALittle.Math_ASin(-delta_y / len);
			}
		} else {
			if (delta_y >= 0) {
				rad = 3.14159265 - ALittle.Math_ASin(delta_y / len);
			} else {
				rad = 3.14159265 + ALittle.Math_ASin(-delta_y / len);
			}
		}
		this.angle = rad / 3.14159265 * 180;
	},
	SetSizeAsLine : function(line_size, start_x, start_y, end_x, end_y) {
		let delta_x = end_x - start_x;
		let delta_y = end_y - start_y;
		this.width = ALittle.Math_Sqrt(delta_x * delta_x + delta_y * delta_y);
		this.height = line_size;
		this.center_x = 0;
		this.center_y = line_size / 2;
	},
}, "ALittle.Quad");

}