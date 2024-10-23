import { ApiProperty } from '@nestjs/swagger';

export class CreateJournalDto {
    @ApiProperty({ example: 'My First Journal Entry', description: 'The title of the journal entry' })
    title: string;

    @ApiProperty({ example: 'Today was a great day...', description: 'The content of the journal entry' })
    content: string;

    @ApiProperty({ example: 'Personal', description: 'The category of the journal entry' })
    category: string;
}
