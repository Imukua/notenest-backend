import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { CreateJournalDto } from './dto/create.journal.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { JwtPayload } from 'src/auth/strategies/jwt.strategy';
import { UpdateJournalDto } from './dto/update.journal.dto';


interface Request {
    user: JwtPayload;
}
@Controller('journals')
export class JournalsController {
    constructor(private readonly journalsService: JournalsService) {}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    create(@Req() req: Request, @Body() body: CreateJournalDto) {
        const user = req.user
       return this.journalsService.createJournalEntry(user.id, body)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param("id") id:string, @Req() req: Request, @Body() body: UpdateJournalDto) {
        console.log(id)
        const user = req.user
       return this.journalsService.updateJournalEntry(user.id,id, body)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(
        @Query('page')  page: string,
        @Query('limit') limit: string,
        @Req() req: Request,
        @Query("search") search?: string,
        @Query("category") category?: string,
        @Query("startDate") startDate?: string,
        @Query("endDate") endDate?: string,  
        
    ) {
    
        const pageInt = parseInt(page, 10) || 1;
        const limitInt = parseInt(limit, 10) || 5;
        const userId = req.user.id;
        return this.journalsService.getAllJournalEntries(userId, pageInt, limitInt, search, category, startDate, endDate);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param("id") id:string, @Req() req: Request) {
        const user = req.user
        return this.journalsService.getJournalEntry(user.id,id)
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param("id") id:string, @Req() req: Request) {
        const user = req.user
        return this.journalsService.deleteJournalEntry(user.id,id)
    }
        

}
