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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JournalsService = class JournalsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async createJournalEntry(userId, data) {
        const { title, content, category } = data;
        if (!title || !content || !category) {
            throw new common_1.HttpException('Missing required fields', 400);
        }
        return this.prismaService.journalEntry.create({
            data: {
                title,
                content,
                category,
                userId
            }
        });
    }
    async updateJournalEntry(userId, journalId, data) {
        const existingEntry = await this.prismaService.journalEntry.findUnique({
            where: {
                id: journalId
            }
        });
        if (!existingEntry) {
            throw new common_1.HttpException('Journal entry not found', 404);
        }
        if (existingEntry.userId !== userId) {
            throw new common_1.NotFoundException(`You do not have permission to update this journal entry`);
        }
        const { title, content, category } = data;
        if (!title || !content || !category) {
            throw new common_1.HttpException('Missing required fields', 400);
        }
        return this.prismaService.journalEntry.update({
            where: { id: journalId },
            data: {
                title: data.title,
                content: data.content,
                category: data.category,
            },
        });
    }
    async getAllJournalEntries(userId, page, limit, search, category, startDate, endDate) {
        const skip = (page - 1) * limit;
        const filters = {
            userId,
        };
        if (search) {
            filters.OR = [
                { title: { contains: search, mode: "insensitive" } },
            ];
        }
        if (category) {
            filters.category = category;
        }
        if (startDate && endDate) {
            filters.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        const totalEntries = await this.prismaService.journalEntry.count({
            where: filters,
        });
        const totalPages = Math.ceil(totalEntries / limit);
        const entries = await this.prismaService.journalEntry.findMany({
            where: filters,
            skip,
            take: limit,
            orderBy: { date: 'desc' },
        });
        const categoryCounts = await this.prismaService.journalEntry.groupBy({
            by: ['category'],
            where: { userId },
            _count: {
                category: true,
            },
            having: {
                category: { in: ['Personal Development', 'Work', 'Travel'] },
            },
        });
        const hasNextPage = skip + limit < totalEntries;
        return {
            entries,
            totalEntries,
            hasNextPage,
            totalPages,
            categoryCounts: {
                PersonalDevelopment: categoryCounts.find(c => c.category === 'Personal Development')?._count.category || 0,
                Work: categoryCounts.find(c => c.category === 'Work')?._count.category || 0,
                Travel: categoryCounts.find(c => c.category === 'Travel')?._count.category || 0,
            },
        };
    }
    async getJournalEntry(userId, journalId) {
        const entry = await this.prismaService.journalEntry.findUnique({
            where: {
                id: journalId,
                userId: userId
            }
        });
        if (!entry) {
            throw new common_1.HttpException('Journal entry not found', 404);
        }
        return entry;
    }
    async deleteJournalEntry(userId, id) {
        const journalEntry = await this.prismaService.journalEntry.findUnique({
            where: {
                id,
                userId,
            },
        });
        if (!journalEntry) {
            throw new common_1.NotFoundException('Journal entry not found');
        }
        await this.prismaService.journalEntry.delete({
            where: { id },
        });
    }
};
exports.JournalsService = JournalsService;
exports.JournalsService = JournalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JournalsService);
//# sourceMappingURL=journals.service.js.map