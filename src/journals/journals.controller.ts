import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { CreateJournalDto } from './dto/create.journal.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { JwtPayload } from 'src/auth/strategies/jwt.strategy';


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

}
