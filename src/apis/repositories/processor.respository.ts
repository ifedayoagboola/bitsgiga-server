import { PrismaClient } from '@prisma/client';
import { Processor } from '@src/interfaces/processors';

const prisma = new PrismaClient();

export const createProcessorRepo = async (data: Processor): Promise<Processor> => {
  const processor = await prisma.processor.create({
    data: data
  });
  return processor;
};

export const findProcessorRepo = async (filters: { id: string }): Promise<Processor | null> => {
  const processor = await prisma.processor.findUnique({
    where: filters
  });
  return processor;
};

export const fetchProcessorsRepo = async (filters: Partial<Processor>): Promise<Processor[]> => {
  const processor = await prisma.processor.findMany({
    where: { ...filters }
  });

  return processor;
};

export const updateProcessorRepo = async (filters: { id: string }, data: Partial<Processor>): Promise<Processor> => {
  const updatedProcessor = await prisma.processor.update({
    data: data,
    where: filters
  });
  return updatedProcessor;
};
