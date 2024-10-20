import { Test, TestingModule } from '@nestjs/testing';
import { JournalsService } from './journals.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, NotFoundException } from '@nestjs/common';
import { CreateJournalDto } from './dto/create.journal.dto';
import { UpdateJournalDto } from './dto/update.journal.dto';

describe('JournalsService', () => {
  let service: JournalsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalsService,
        {
          provide: PrismaService,
          useValue: {
            journalEntry: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              groupBy: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<JournalsService>(JournalsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createJournalEntry', () => {
    it('should create a journal entry successfully', async () => {
      const createJournalDto: CreateJournalDto = {
        title: 'Test Journal',
        content: 'Test Content',
        category: 'Test Category',
      };
      const userId = 'test-user-id';
      const mockCreatedEntry = { 
        id: 'test-id', 
        ...createJournalDto, 
        userId, 
        date: new Date() 
      };

      jest.spyOn(prismaService.journalEntry, 'create').mockResolvedValue(mockCreatedEntry);

      const result = await service.createJournalEntry(userId, createJournalDto);

      expect(result).toEqual(mockCreatedEntry);
      expect(prismaService.journalEntry.create).toHaveBeenCalledWith({
        data: { ...createJournalDto, userId },
      });
    });

    it('should throw an error if required fields are missing', async () => {
      const incompleteDto = { title: 'Test Journal' };
      const userId = 'test-user-id';

      await expect(service.createJournalEntry(userId, incompleteDto as CreateJournalDto)).rejects.toThrow(HttpException);
    });
  });

  describe('updateJournalEntry', () => {
    it('should update a journal entry successfully', async () => {
      const updateJournalDto: UpdateJournalDto = {
        title: 'Updated Title',
        content: 'Updated Content',
        category: 'Updated Category',
      };
      const userId = 'test-user-id';
      const journalId = 'test-journal-id';
      const mockUpdatedEntry = { 
        id: journalId, 
        title: updateJournalDto.title,
        content: updateJournalDto.content,
        category: updateJournalDto.category,
        userId, 
        date: new Date() 
      };

      jest.spyOn(prismaService.journalEntry, 'findUnique').mockResolvedValue({ 
        id: journalId, 
        userId, 
        title: 'Old Title', 
        content: 'Old Content', 
        category: 'Old Category', 
        date: new Date() 
      });
      jest.spyOn(prismaService.journalEntry, 'update').mockResolvedValue(mockUpdatedEntry);

      const result = await service.updateJournalEntry(userId, journalId, updateJournalDto);

      expect(result).toEqual(mockUpdatedEntry);
      expect(prismaService.journalEntry.update).toHaveBeenCalledWith({
        where: { id: journalId },
        data: updateJournalDto,
      });
    });

    it('should throw NotFoundException if journal entry does not exist', async () => {
      const updateJournalDto: UpdateJournalDto = { title: 'Updated Title' };
      const userId = 'test-user-id';
      const journalId = 'non-existent-id';

      jest.spyOn(prismaService.journalEntry, 'findUnique').mockResolvedValue(null);

      await expect(service.updateJournalEntry(userId, journalId, updateJournalDto)).rejects.toThrow(HttpException);
    });
  });

  describe('getAllJournalEntries', () => {
    it('should return paginated journal entries with category counts', async () => {
      const userId = 'test-user-id';
      const mockEntries = [{ 
        id: '1', 
        title: 'Test Journal', 
        content: 'Test Content', 
        category: 'Test Category', 
        date: new Date(), 
        userId 
      }];
      const mockCount = 1;
      const mockGroupBy = jest.fn().mockResolvedValue([
        { category: 'Personal Development', _count: { category: 1 } },
        { category: 'Work', _count: { category: 2 } },
        { category: 'Travel', _count: { category: 0 } },
      ]);

      jest.spyOn(prismaService.journalEntry, 'findMany').mockResolvedValue(mockEntries);
      jest.spyOn(prismaService.journalEntry, 'count').mockResolvedValue(mockCount);
      prismaService.journalEntry.groupBy = mockGroupBy;

      const result = await service.getAllJournalEntries(userId, 1, 10);

      expect(result.entries).toEqual(mockEntries);
      expect(result.totalEntries).toBe(mockCount);
      expect(result.categoryCounts).toEqual({
        PersonalDevelopment: 1,
        Work: 2,
        Travel: 0,
      });
      expect(mockGroupBy).toHaveBeenCalled();
    });
  });

  describe('getJournalEntry', () => {
    it('should return a specific journal entry', async () => {
      const userId = 'test-user-id';
      const journalId = 'test-journal-id';
      const mockEntry = { 
        id: journalId, 
        title: 'Test Journal', 
        content: 'Test Content', 
        category: 'Test Category', 
        date: new Date(), 
        userId 
      };

      jest.spyOn(prismaService.journalEntry, 'findUnique').mockResolvedValue(mockEntry);

      const result = await service.getJournalEntry(userId, journalId);

      expect(result).toEqual(mockEntry);
      expect(prismaService.journalEntry.findUnique).toHaveBeenCalledWith({
        where: { id: journalId, userId },
      });
    });

    it('should throw NotFoundException if journal entry does not exist', async () => {
      const userId = 'test-user-id';
      const journalId = 'non-existent-id';

      jest.spyOn(prismaService.journalEntry, 'findUnique').mockResolvedValue(null);

      await expect(service.getJournalEntry(userId, journalId)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteJournalEntry', () => {
    it('should delete a journal entry successfully', async () => {
      const userId = 'test-user-id';
      const journalId = 'test-journal-id';

      jest.spyOn(prismaService.journalEntry, 'findUnique').mockResolvedValue({ 
        id: journalId, 
        title: 'Test Journal', 
        content: 'Test Content', 
        category: 'Test Category', 
        date: new Date(), 
        userId 
      });
      jest.spyOn(prismaService.journalEntry, 'delete').mockResolvedValue({ 
        id: journalId, 
        title: 'Test Journal', 
        content: 'Test Content', 
        category: 'Test Category', 
        date: new Date(), 
        userId 
      });

      await service.deleteJournalEntry(userId, journalId);

      expect(prismaService.journalEntry.delete).toHaveBeenCalledWith({
        where: { id: journalId },
      });
    });

    it('should throw NotFoundException if journal entry does not exist', async () => {
      const userId = 'test-user-id';
      const journalId = 'non-existent-id';

      jest.spyOn(prismaService.journalEntry, 'findUnique').mockResolvedValue(null);

      await expect(service.deleteJournalEntry(userId, journalId)).rejects.toThrow(NotFoundException);
    });
  });
});
