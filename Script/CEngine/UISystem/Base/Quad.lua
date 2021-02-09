-- ALittle Generate Lua And Do Not Edit This Line!
do
if _G.ALittle == nil then _G.ALittle = {} end
local ALittle = ALittle
local Lua = Lua
local ___rawset = rawset
local ___pairs = pairs
local ___ipairs = ipairs
local ___all_struct = ALittle.GetAllStruct()


assert(ALittle.DisplayObject, " extends class:ALittle.DisplayObject is nil")
ALittle.Quad = Lua.Class(ALittle.DisplayObject, "ALittle.Quad")

function ALittle.Quad:Ctor(ctrl_sys)
	___rawset(self, "_show", __CPPAPIQuad())
	self:AddEventListener(___all_struct[40651933], self, self.HandleLButtonUp)
	self:AddEventListener(___all_struct[683647260], self, self.HandleMButtonUp)
	self:AddEventListener(___all_struct[734860930], self, self.HandleFLButtonUp)
end

function ALittle.Quad:HandleLButtonUp(event)
	if event.rel_x >= 0 and event.rel_y >= 0 and event.rel_x < event.target._width and event.rel_y < event.target._height then
		local c_event = {}
		c_event.is_drag = event.is_drag
		c_event.count = event.count
		self:DispatchEvent(___all_struct[-449066808], c_event)
	end
end

function ALittle.Quad:HandleMButtonUp(event)
	if event.rel_x >= 0 and event.rel_y >= 0 and event.rel_x < event.target._width and event.rel_y < event.target._height then
		local c_event = {}
		c_event.is_drag = event.is_drag
		self:DispatchEvent(___all_struct[-1330840], c_event)
	end
end

function ALittle.Quad:HandleFLButtonUp(event)
	if event.rel_x >= 0 and event.rel_y >= 0 and event.rel_x < event.target._width and event.rel_y < event.target._height then
		local c_event = {}
		c_event.is_drag = event.is_drag
		self:DispatchEvent(___all_struct[286797479], c_event)
	end
end

function ALittle.Quad:SetPosAsLine(start_x, start_y, end_x, end_y)
	self.x = start_x
	self.y = start_y
	local delta_x = end_x - start_x
	local delta_y = end_y - start_y
	local len = ALittle.Math_Sqrt(delta_x * delta_x + delta_y * delta_y)
	if len < 0.0001 then
		return
	end
	local rad = 0.0
	if delta_x >= 0 then
		if delta_y >= 0 then
			rad = ALittle.Math_ASin(delta_y / len)
		else
			rad = -ALittle.Math_ASin(-delta_y / len)
		end
	else
		if delta_y >= 0 then
			rad = 3.14159265 - ALittle.Math_ASin(delta_y / len)
		else
			rad = 3.14159265 + ALittle.Math_ASin(-delta_y / len)
		end
	end
	self.angle = rad / 3.14159265 * 180
end

function ALittle.Quad:SetSizeAsLine(line_size, start_x, start_y, end_x, end_y)
	local delta_x = end_x - start_x
	local delta_y = end_y - start_y
	self.width = ALittle.Math_Sqrt(delta_x * delta_x + delta_y * delta_y)
	self.height = line_size
	self.center_x = 0
	self.center_y = line_size / 2
end

end