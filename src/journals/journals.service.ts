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

    async getAllJournalEntries(userId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;
        const entries = await this.prismaService.journalEntry.findMany({
            where: {userId},    
            skip,
            take: limit,
        });

        return entries;

    }


    async getJournalEntry(userId: string, journalId: string) {
        const entry = await this.prismaService.journalEntry.findUnique({
            where: {
                id: journalId
            }
        })

        if(!entry) {
            throw new HttpException('Journal entry not found', 404)
        }

        if (entry.userId !== userId) {
            throw new NotFoundException(`You do not have permission to view this journal entry`);
          }
    
        return entry;
    }
}
