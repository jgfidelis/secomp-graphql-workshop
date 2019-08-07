"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fetch = require("node-fetch");
var orderFormId = "bf9a4f0d64c448e4b1cfedd03b833d83";
var http = function (url, headers, method, body) {
    if (headers === void 0) { headers = {}; }
    if (method === void 0) { method = "GET"; }
    return __awaiter(_this, void 0, void 0, function () {
        var fetchData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, fetch(url, { headers: headers, method: method, body: body })];
                case 1:
                    fetchData = _a.sent();
                    return [2, fetchData.json()];
            }
        });
    });
};
var queries = {
    helloWorld: function (_, args) {
        return "Hello world!";
    },
    product: function (_, args) { return __awaiter(_this, void 0, void 0, function () {
        var slug, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    slug = args.slug;
                    return [4, http("http://boticario.vtexcommercestable.com.br/api/catalog_system/pub/products/search/" + slug + "/p")];
                case 1:
                    results = _a.sent();
                    return [2, results[0]];
            }
        });
    }); },
    minicart: function () {
        return http("http://boticario.vtexcommercestable.com.br/api/checkout/pub/orderForm/" + orderFormId + "?sc=1");
    }
};
var itemResolvers = {
    Item: {
        price: function (item) {
            return item.sellers[0].commertialOffer.Price;
        },
        imageUrl: function (item) {
            return item.images[0].imageUrl;
        }
    }
};
var minicartResolvers = {
    Minicart: {
        itemCount: function (orderForm) {
            return orderForm.items.length;
        },
        cacheId: function (orderForm) { return orderForm.orderFormId; }
    }
};
var productResolvers = {
    Product: {
        categoryNames: function (product) { return __awaiter(_this, void 0, void 0, function () {
            var categoriesIds, wholeTreeDirty, wholeTreeClean, ids, categories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        categoriesIds = product.categoriesIds;
                        wholeTreeDirty = categoriesIds[0];
                        wholeTreeClean = wholeTreeDirty.slice(1).slice(0, -1);
                        ids = wholeTreeClean.split("/");
                        return [4, Promise.all(ids.map(function (id) {
                                return http("http://boticario.vtexcommercestable.com.br/api/catalog_system/pub/category/" + id);
                            }))];
                    case 1:
                        categories = _a.sent();
                        return [2, categories.map(function (_a) {
                                var name = _a.name;
                                return name;
                            })];
                }
            });
        }); },
        firstItem: function (product) { return product.items[0]; }
    }
};
var mutations = {
    addItemToCart: function (_, args, ctx) {
        var itemId = args.itemId;
        var payload = {
            orderItems: [{ id: itemId, quantity: 1, seller: "1" }]
        };
        return http("http://boticario.vtexcommercestable.com.br/api/checkout/pub/orderForm/" + orderFormId + "/items?sc=1", "POST", JSON.stringify(payload));
    }
};
var resolverMap = __assign({}, productResolvers, itemResolvers, minicartResolvers, { Query: __assign({}, queries), Mutation: __assign({}, mutations) });
exports.default = resolverMap;
