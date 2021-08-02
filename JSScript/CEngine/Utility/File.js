{
if (typeof ALittle === "undefined") window.ALittle = {};


ALittle.LocalFile = JavaScript.Class(undefined, {
	Clear : function() {
		this._js_file = undefined;
	},
	Load : function(path) {
		this.Clear();
		{
			let [content, buffer] = JavaScript.File_LoadFile(path);
			if (content === undefined && buffer === undefined) {
				return false;
			}
			if (buffer === undefined) {
				buffer = StringToUTF8Array(content).buffer;
			}
			if (buffer === undefined) {
				return false;
			}
			this._js_file = new DataView(buffer);
		}
		return true;
	},
	GetSize : function() {
		if (this._js_file === undefined) {
			return 0;
		} else {
			return this._js_file.byteLength;
		}
	},
	ReadChar : function(offset) {
		return this._js_file.getInt8(offset);
	},
	ReadUChar : function(offset) {
		return this._js_file.getUint8(offset);
	},
	ReadShort : function(offset) {
		return this._js_file.getInt16(offset, true);
	},
	ReadUShort : function(offset) {
		return this._js_file.getUint16(offset, true);
	},
	ReadInt : function(offset) {
		return this._js_file.getInt32(offset, true);
	},
	ReadUInt : function(offset) {
		return this._js_file.getUint32(offset, true);
	},
	ReadFloat : function(offset) {
		return this._js_file.getFloat32(offset, true);
	},
	ReadDouble : function(offset) {
		return this._js_file.getFloat64(offset, true);
	},
}, "ALittle.LocalFile");

ALittle.File_BaseFilePath = function() {
	return "";
}

ALittle.File_ExternalFilePath = function() {
	return "";
}

ALittle.File_CopyFileFromAsset = function(src_path, dst_path) {
	return JavaScript.File_CopyFile(src_path, dst_path);
}

ALittle.File_SaveFile = function(target_path, content, size) {
	return JavaScript.File_SaveFile(target_path, content, undefined);
}

ALittle.File_Md5 = function(path) {
	let [content] = JavaScript.File_LoadFile(path);
	if (content === undefined) {
		return "";
	}
	return md5(content);
}

ALittle.File_ReadTextFromFile = function(file_path, crypt_mode) {
	{
		let [content, buffer] = JavaScript.File_LoadFile(file_path);
		return content;
	}
}

ALittle.File_WriteTextToFile = function(content, file_path) {
	return ALittle.File_SaveFile(file_path, content, -1);
}

ALittle.File_ReadJsonFromFile = function(file_path, crypt_mode) {
	return [ALittle.File_ReadJsonFromStdFile(file_path)];
}

ALittle.File_ReadJsonFromAsset = function(file_path, crypt_mode) {
	return [ALittle.File_ReadJsonFromStdFile(file_path)];
}

ALittle.File_WriteJsonToFile = function(content, file_path) {
	return ALittle.File_SaveFile(file_path, lua.cjson.encode(content), -1);
}

ALittle.DeleteLog = function(day_count_before) {
	if (day_count_before <= 0) {
		return;
	}
	let log_path = ALittle.File_ExternalFilePath() + "Log";
	if (ALittle.File_GetFileAttr(log_path) === undefined) {
		return;
	}
	let cut_time = ALittle.Time_GetCurTime() - day_count_before * 3600 * 24;
	let file_map = ALittle.File_GetFileAttrByDir(log_path);
	let ___OBJECT_1 = file_map;
	for (let path in ___OBJECT_1) {
		let attr = ___OBJECT_1[path];
		if (attr === undefined) continue;
		if (attr.create_time <= cut_time) {
			ALittle.File_DeleteFile(path);
		}
	}
}

}