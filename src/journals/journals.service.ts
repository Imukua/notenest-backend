import { HttpException, Injectable } from '@nestjs/common';
import { create } from 'domain';
import { use } from 'passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalDto } from './dto/create.journal.dto';

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
}
