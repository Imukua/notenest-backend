import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalDto } from './dto/create.journal.dto';
import { UpdateJournalDto } from './dto/update.journal.dto';
export declare class JournalsService {
    private prismaService;
    constructor(prismaService: PrismaService);
    createJournalEntry(userId: string, data: CreateJournalDto): Promise<{
        id: string;
        userId: string;
        title: string;
        content: string;
        category: string;
        date: Date;
    }>;
    updateJournalEntry(userId: string, journalId: string, data: UpdateJournalDto): Promise<{
        id: string;
        userId: string;
        title: string;
        content: string;
        category: string;
        date: Date;
    }>;
    getAllJournalEntries(userId: string, page: number, limit: number, search?: string, category?: string, startDate?: string, endDate?: string): Promise<{
        entries: {
            id: string;
            userId: string;
            title: string;
            content: string;
            category: string;
            date: Date;
        }[];
        totalEntries: number;
        hasNextPage: boolean;
        totalPages: number;
        categoryCounts: {
            PersonalDevelopment: number;
            Work: number;
            Travel: number;
        };
    }>;
    getJournalEntry(userId: string, journalId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        content: string;
        category: string;
        date: Date;
    }>;
    deleteJournalEntry(userId: string, id: string): Promise<void>;
}
