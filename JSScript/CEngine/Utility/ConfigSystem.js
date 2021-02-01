{
if (typeof ALittle === "undefined") window.ALittle = {};


if (ALittle.IFileLoader === undefined) throw new Error(" extends class:ALittle.IFileLoader is undefined");
ALittle.JClientFileLoader = JavaScript.Class(ALittle.IFileLoader, {
	Load : function(file_path) {
		if (window.wx !== undefined) {
			let content = window.wx.getStorageSync(file_path);
			if (content === undefined) {
				return undefined;
			}
			if (typeof(content) !== "string") {
				return undefined;
			}
			return content;
		}
		if (window.localStorage !== undefined) {
			let content = window.localStorage.getItem(file_path);
			if (content === undefined) {
				return undefined;
			}
			if (typeof(content) !== "string") {
				return undefined;
			}
			return content;
		}
		return undefined;
	},
}, "ALittle.JClientFileLoader");

if (ALittle.IFileSaver === undefined) throw new Error(" extends class:ALittle.IFileSaver is undefined");
ALittle.JClientFileSaver = JavaScript.Class(ALittle.IFileSaver, {
	Save : function(file_path, content) {
		if (window.wx !== undefined) {
			window.wx.setStorageSync(file_path, content);
			return true;
		}
		if (window.localStorage !== undefined) {
			window.localStorage.setItem(file_path, content);
			return true;
		}
		return false;
	},
}, "ALittle.JClientFileSaver");

ALittle.CreateConfigSystem = function(file_path, print_error) {
	return ALittle.NewObject(JavaScript.Template(ALittle.JsonConfig, "ALittle.JsonConfig<ALittle.JClientFileLoader, ALittle.JClientFileSaver>", ALittle.JClientFileLoader, ALittle.JClientFileSaver), file_path, print_error);
}

}