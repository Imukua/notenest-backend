"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalsController = void 0;
const common_1 = require("@nestjs/common");
const journals_service_1 = require("./journals.service");
const create_journal_dto_1 = require("./dto/create.journal.dto");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const update_journal_dto_1 = require("./dto/update.journal.dto");
let JournalsController = class JournalsController {
    constructor(journalsService) {
        this.journalsService = journalsService;
    }
    create(req, body) {
        const user = req.user;
        return this.journalsService.createJournalEntry(user.id, body);
    }
    update(id, req, body) {
        console.log(id);
        const user = req.user;
        return this.journalsService.updateJournalEntry(user.id, id, body);
    }
    getAll(page, limit, req, search, category, startDate, endDate) {
        const pageInt = parseInt(page, 10) || 1;
        const limitInt = parseInt(limit, 10) || 5;
        const userId = req.user.id;
        return this.journalsService.getAllJournalEntries(userId, pageInt, limitInt, search, category, startDate, endDate);
    }
    getOne(id, req) {
        const user = req.user;
        return this.journalsService.getJournalEntry(user.id, id);
    }
    delete(id, req) {
        const user = req.user;
        return this.journalsService.deleteJournalEntry(user.id, id);
    }
};
exports.JournalsController = JournalsController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_journal_dto_1.CreateJournalDto]),
    __metadata("design:returntype", void 0)
], JournalsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_journal_dto_1.UpdateJournalDto]),
    __metadata("design:returntype", void 0)
], JournalsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Query)("search")),
    __param(4, (0, common_1.Query)("category")),
    __param(5, (0, common_1.Query)("startDate")),
    __param(6, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], JournalsController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JournalsController.prototype, "getOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JournalsController.prototype, "delete", null);
exports.JournalsController = JournalsController = __decorate([
    (0, common_1.Controller)('journals'),
    __metadata("design:paramtypes", [journals_service_1.JournalsService])
], JournalsController);
//# sourceMappingURL=journals.controller.js.map