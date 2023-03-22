"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = exports.SafeJSONParse = exports.Sleep = exports.IsEmptyString = exports.Log = void 0;
const tslib_1 = require("tslib");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const enums_1 = require("./types/enums");
const Log = (message, color = enums_1.ColorLog.FgBlue, date = false) => console.log(color, `${date ? new Date().toLocaleString() + ": " : ""}${message}`);
exports.Log = Log;
const IsEmptyString = (str) => typeof str !== "string" || str.trim().length <= 0;
exports.IsEmptyString = IsEmptyString;
const Sleep = (duration, fn) => new Promise((res) => setTimeout(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (fn)
        yield fn();
    res();
}), duration));
exports.Sleep = Sleep;
const SafeJSONParse = (jsonBytes) => {
    try {
        return JSON.parse(jsonBytes);
    }
    catch (err) {
        return null;
    }
};
exports.SafeJSONParse = SafeJSONParse;
const Hash = (str) => {
    if ((0, exports.IsEmptyString)(str))
        return null;
    return crypto_1.default.createHash("sha256").update(str).digest("hex");
};
exports.Hash = Hash;
//# sourceMappingURL=globalUtils.js.map