"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("../common/api"));
const bundlr_1 = __importDefault(require("../common/bundlr"));
const fund_1 = __importDefault(require("../common/fund"));
const upload_1 = __importDefault(require("../common/upload"));
const utils_1 = __importDefault(require("../common/utils"));
const currencies_1 = __importDefault(require("./currencies"));
class WebBundlr extends bundlr_1.default {
    constructor(url, currency, provider, config) {
        var _a;
        const parsed = new URL(url);
        super(parsed);
        this.api = new api_1.default({ protocol: parsed.protocol.slice(0, -1), port: parsed.port, host: parsed.hostname, timeout: (_a = config === null || config === void 0 ? void 0 : config.timeout) !== null && _a !== void 0 ? _a : 100000 });
        this.currencyConfig = (0, currencies_1.default)(currency.toLowerCase(), provider, config === null || config === void 0 ? void 0 : config.providerUrl, config === null || config === void 0 ? void 0 : config.contractAddress);
        this.currency = this.currencyConfig.name;
        this.utils = new utils_1.default(this.api, this.currency, this.currencyConfig);
        this.uploader = new upload_1.default(this.api, this.utils, this.currency, this.currencyConfig);
        this.funder = new fund_1.default(this.utils);
        this.address = "Please run `await bundlr.ready()`";
    }
}
exports.default = WebBundlr;
//# sourceMappingURL=bundlr.js.map