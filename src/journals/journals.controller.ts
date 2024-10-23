import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { CreateJournalDto } from './dto/create.journal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { UpdateJournalDto } from './dto/update.journal.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { SwaggerExamples } from '../common/swagger.examples';

interface Request {
    user: JwtPayload;
}

@ApiTags('journals')
@Controller('journals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class JournalsController {
    constructor(private readonly journalsService: JournalsService) {}

    @Post('create')
    @ApiOperation({ summary: 'Create a new journal entry' })
    @ApiBody({ type: CreateJournalDto })
    @ApiResponse({ 
        status: 201, 
        description: 'The journal entry has been successfully created.',
        schema: { example: SwaggerExamples.JournalEntry }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    create(@Req() req: Request, @Body() body: CreateJournalDto) {
        const user = req.user;
        return this.journalsService.createJournalEntry(user.id, body);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a journal entry' })
    @ApiParam({ name: 'id', description: 'Journal entry ID', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiBody({ type: UpdateJournalDto })
    @ApiResponse({ 
        status: 200, 
        description: 'The journal entry has been successfully updated.',
        schema: { example: SwaggerExamples.UpdatedJournalEntry }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Journal entry not found.' })
    update(@Param('id') id: string, @Req() req: Request, @Body() body: UpdateJournalDto) {
        const user = req.user;
        return this.journalsService.updateJournalEntry(user.id, id, body);
    }

    @Get()
    @ApiOperation({ summary: 'Get all journal entries' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
    @ApiQuery({ name: 'search', required: false, description: 'Search term for filtering entries', example: 'meeting' })
    @ApiQuery({ name: 'category', required: false, description: 'Category for filtering entries', example: 'Work' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Start date for filtering entries', example: '2023-06-01' })
    @ApiQuery({ name: 'endDate', required: false, description: 'End date for filtering entries', example: '2023-06-30' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns a list of journal entries.',
        schema: { example: SwaggerExamples.JournalEntries }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    getAll(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Req() req: Request,
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const pageInt = parseInt(page, 10) || 1;
        const limitInt = parseInt(limit, 10) || 5;
        const userId = req.user.id;
        return this.journalsService.getAllJournalEntries(userId, pageInt, limitInt, search, category, startDate, endDate);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific journal entry' })
    @ApiParam({ name: 'id', description: 'Journal entry ID', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns the specified journal entry.',
        schema: { example: SwaggerExamples.JournalEntry }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Journal entry not found.' })
    getOne(@Param('id') id: string, @Req() req: Request) {
        const user = req.user;
        return this.journalsService.getJournalEntry(user.id, id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a journal entry' })
    @ApiParam({ name: 'id', description: 'Journal entry ID', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'The journal entry has been successfully deleted.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Journal entry not found.' })
    delete(@Param('id') id: string, @Req() req: Request) {
        const user = req.user;
        return this.journalsService.deleteJournalEntry(user.id, id);
    }
}
