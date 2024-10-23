import { JournalsService } from './journals.service';
import { CreateJournalDto } from './dto/create.journal.dto';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { UpdateJournalDto } from './dto/update.journal.dto';
interface Request {
    user: JwtPayload;
}
export declare class JournalsController {
    private readonly journalsService;
    constructor(journalsService: JournalsService);
    create(req: Request, body: CreateJournalDto): Promise<{
        id: string;
        title: string;
        content: string;
        category: string;
        date: Date;
        userId: string;
    }>;
    update(id: string, req: Request, body: UpdateJournalDto): Promise<{
        id: string;
        title: string;
        content: string;
        category: string;
        date: Date;
        userId: string;
    }>;
    getAll(page: string, limit: string, req: Request, search?: string, category?: string, startDate?: string, endDate?: string): Promise<{
        entries: {
            id: string;
            title: string;
            content: string;
            category: string;
            date: Date;
            userId: string;
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
    getOne(id: string, req: Request): Promise<{
        id: string;
        title: string;
        content: string;
        category: string;
        date: Date;
        userId: string;
    }>;
    delete(id: string, req: Request): Promise<void>;
}
export {};
