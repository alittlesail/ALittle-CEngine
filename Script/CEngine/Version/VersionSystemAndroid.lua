-- ALittle Generate Lua And Do Not Edit This Line!
do
if _G.ALittle == nil then _G.ALittle = {} end
local ALittle = ALittle
local Lua = Lua
local ___rawset = rawset
local ___pairs = pairs
local ___ipairs = ipairs


assert(ALittle.VersionSystem, " extends class:ALittle.VersionSystem is nil")
ALittle.VersionSystemAndroid = Lua.Class(ALittle.VersionSystem, "ALittle.VersionSystemAndroid")

function ALittle.VersionSystemAndroid:Ctor(account_name, module_name)
	___rawset(self, "_install_name", "Install.apk")
end

function ALittle.VersionSystemAndroid.InstallImpl(install_name)
	ALittle.System_InstallProgram(install_name)
	ALittle.System_ForceExit()
end

function ALittle.VersionSystemAndroid:Install(install_name)
	if install_name == nil then
		install_name = ALittle.File_BaseFilePath() .. self._update_path .. self._install_name
	end
	os.execute("chmod 777 " .. ALittle.File_BaseFilePath() .. "Update")
	os.execute("chmod 777 " .. ALittle.File_BaseFilePath() .. "Update/" .. self._module_name)
	os.execute("chmod 777 " .. ALittle.File_BaseFilePath() .. "Update/" .. self._module_name .. "/" .. self._install_name)
	local updater = ALittle.LoopTimer(Lua.Bind(ALittle.VersionSystemAndroid.InstallImpl, install_name), 1)
	updater:Start()
end

end