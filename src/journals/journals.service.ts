import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { create } from 'domain';
import { use } from 'passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalDto } from './dto/create.journal.dto';
import { UpdateJournalDto } from './dto/update.journal.dto';

@Injectable()
export class JournalsService {
    constructor(private prismaService: PrismaService) {}

    async createJournalEntry(userId: string, data: CreateJournalDto) {
        const {title, content, category} = data;
        if(!title || !content || !category) {
            throw new HttpException('Missing required fields', 400)
        }

        return this.prismaService.journalEntry.create({
            data: {
                title,
                content,
                category,
                userId
            }
        })   
    }


    async updateJournalEntry(userId: string, journalId: string, data: UpdateJournalDto) {

        const existingEntry = await this.prismaService.journalEntry.findUnique({
            where: {
                id: journalId
            }
        })

        if(!existingEntry) {
            throw new HttpException('Journal entry not found', 404)
        }

        if (existingEntry.userId !== userId) {
            throw new NotFoundException(`You do not have permission to update this journal entry`);
          }
    
        const {title, content, category} = data;
        if(!title || !content || !category) {
            throw new HttpException('Missing required fields', 400)
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

async getAllJournalEntries(
    userId: string,
    page: number,
    limit: number,
    search?: string,
    category?: string,
    startDate?: string,
    endDate?: string
) {
    const skip = (page - 1) * limit;

    const filters: any = {
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

    // Get the total count of entries with the same filters
    const totalEntries = await this.prismaService.journalEntry.count({
        where: filters,
    });
    const totalPages = Math.ceil(totalEntries / limit);

    // Fetch the journal entries with pagination
    const entries = await this.prismaService.journalEntry.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
    });

    // Get the count of entries for specific categories
    const categoryCounts = await this.prismaService.journalEntry.groupBy({
        by: ['category'],
        where: { userId }, // Ensure the count is specific to the user
        _count: {
            category: true,
        },
        having: {
            category: { in: ['Personal Development', 'Work', 'Travel'] },
        },
    });

    // Calculate if there is a next page
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


    async getJournalEntry(userId: string, journalId: string) {
        const entry = await this.prismaService.journalEntry.findUnique({
            where: {
                id: journalId,
                userId: userId
            }
        })

        if(!entry) {
            throw new HttpException('Journal entry not found', 404)
        }
    
        return entry;
    }

    async deleteJournalEntry(userId: string, id: string): Promise<void> {
        const journalEntry = await this.prismaService.journalEntry.findUnique({
            where: {
                id,
                userId, 
            },
        });
    
        if (!journalEntry) {
            throw new NotFoundException('Journal entry not found');
        }
    
        await this.prismaService.journalEntry.delete({
            where: { id },
        });
    }
    
}
