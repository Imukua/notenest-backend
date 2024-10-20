import { Test, TestingModule } from '@nestjs/testing';
import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';
import { CreateJournalDto } from './dto/create.journal.dto';
import { UpdateJournalDto } from './dto/update.journal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

describe('JournalsController', () => {
  let controller: JournalsController;
  let journalsService: JournalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalsController],
      providers: [
        {
          provide: JournalsService,
          useValue: {
            createJournalEntry: jest.fn(),
            updateJournalEntry: jest.fn(),
            getAllJournalEntries: jest.fn(),
            getJournalEntry: jest.fn(),
            deleteJournalEntry: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<JournalsController>(JournalsController);
    journalsService = module.get<JournalsService>(JournalsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a journal entry', async () => {
      const createJournalDto: CreateJournalDto = {
        title: 'Test Journal',
        content: 'Test Content',
        category: 'Test Category',
      };
      const mockUser = { id: 'user-id', username: 'testuser' };
      const mockCreatedEntry = { 
        id: 'entry-id', 
        ...createJournalDto, 
        userId: mockUser.id,
        date: new Date()
      };

      jest.spyOn(journalsService, 'createJournalEntry').mockResolvedValue(mockCreatedEntry);

      const result = await controller.create({ user: mockUser } as any, createJournalDto);

      expect(result).toEqual(mockCreatedEntry);
      expect(journalsService.createJournalEntry).toHaveBeenCalledWith(mockUser.id, createJournalDto);
    });
  });

  describe('update', () => {
    it('should update a journal entry', async () => {
      const updateJournalDto: UpdateJournalDto = {
        title: 'Updated Journal',
        content: 'Updated Content',
        category: 'Updated Category',
      };
      const mockUser = { id: 'user-id', username: 'testuser' };
      const entryId = 'entry-id';
      const mockUpdatedEntry = { 
        id: entryId, 
        title: updateJournalDto.title!,
        content: updateJournalDto.content!,
        category: updateJournalDto.category!,
        userId: mockUser.id,
        date: new Date()
      };

      jest.spyOn(journalsService, 'updateJournalEntry').mockResolvedValue(mockUpdatedEntry);

      const result = await controller.update(entryId, { user: mockUser } as any, updateJournalDto);

      expect(result).toEqual(mockUpdatedEntry);
      expect(journalsService.updateJournalEntry).toHaveBeenCalledWith(mockUser.id, entryId, updateJournalDto);
    });
  });

  describe('getAll', () => {
    it('should get all journal entries with pagination and filters', async () => {
      const mockUser = { id: 'user-id', username: 'testuser' };
      const mockQuery = {
        page: '1',
        limit: '10',
        search: 'test',
        category: 'personal',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      };
      const mockResult = {
        entries: [{ 
          id: 'entry-id', 
          title: 'Test Journal',
          content: 'Test Content',
          category: 'Test Category',
          date: new Date(),
          userId: mockUser.id
        }],
        totalEntries: 1,
        hasNextPage: false,
        totalPages: 1,
        categoryCounts: {
          PersonalDevelopment: 0,
          Work: 1,
          Travel: 0
        }
      };

      jest.spyOn(journalsService, 'getAllJournalEntries').mockResolvedValue(mockResult);

      const result = await controller.getAll(
        mockQuery.page,
        mockQuery.limit,
        { user: mockUser } as any,
        mockQuery.search,
        mockQuery.category,
        mockQuery.startDate,
        mockQuery.endDate
      );

      expect(result).toEqual(mockResult);
      expect(journalsService.getAllJournalEntries).toHaveBeenCalledWith(
        mockUser.id,
        1,
        10,
        mockQuery.search,
        mockQuery.category,
        mockQuery.startDate,
        mockQuery.endDate
      );
    });
  });

  describe('getOne', () => {
    it('should get a specific journal entry', async () => {
      const mockUser = { id: 'user-id', username: 'testuser' };
      const entryId = 'entry-id';
      const mockEntry = { 
        id: entryId, 
        title: 'Test Journal', 
        content: 'Test Content',
        category: 'Test Category',
        date: new Date(),
        userId: mockUser.id 
      };

      jest.spyOn(journalsService, 'getJournalEntry').mockResolvedValue(mockEntry);

      const result = await controller.getOne(entryId, { user: mockUser } as any);

      expect(result).toEqual(mockEntry);
      expect(journalsService.getJournalEntry).toHaveBeenCalledWith(mockUser.id, entryId);
    });
  });

  describe('delete', () => {
    it('should delete a journal entry', async () => {
      const mockUser = { id: 'user-id', username: 'testuser' };
      const entryId = 'entry-id';

      jest.spyOn(journalsService, 'deleteJournalEntry').mockResolvedValue(undefined);

      await controller.delete(entryId, { user: mockUser } as any);

      expect(journalsService.deleteJournalEntry).toHaveBeenCalledWith(mockUser.id, entryId);
    });
  });
});
