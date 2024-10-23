export declare const SwaggerExamples: {
    JournalEntry: {
        id: string;
        title: string;
        content: string;
        category: string;
        userId: string;
        createdAt: string;
        updatedAt: string;
    };
    UpdatedJournalEntry: {
        id: string;
        title: string;
        content: string;
        category: string;
        userId: string;
        createdAt: string;
        updatedAt: string;
    };
    JournalEntries: {
        entries: {
            id: string;
            title: string;
            content: string;
            category: string;
            userId: string;
            createdAt: string;
            updatedAt: string;
        }[];
        totalEntries: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
    };
};
