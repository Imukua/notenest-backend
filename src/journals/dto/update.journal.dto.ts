import { ApiProperty } from '@nestjs/swagger';

export class UpdateJournalDto {
    @ApiProperty({ example: 'Updated Journal Title', description: 'The updated title of the journal entry', required: false })
    title?: string;

    @ApiProperty({ example: 'This is the updated content...', description: 'The updated content of the journal entry', required: false })
    content?: string;
    
    @ApiProperty({ example: 'Work', description: 'The updated category of the journal entry', required: false })
    category?: string;
}
