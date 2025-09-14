import { User } from '@src/interfaces/user';
import prisma from '@src/apis/middleware/db';
import { filter } from 'compression';

export const createUserRepo = async (userData: Partial<User>): Promise<User> => {
  const { first_name, last_name, email, password } = userData;
  let createdUser = await prisma.user.create({
    data: {
      first_name,
      last_name,
      email,
      password,
      ...userData
    }
  });
  return createdUser;
};

export const createBulkRepo = async (userData: Partial<User[]>): Promise<User[]> => {
  
  await prisma.user.createMany({
    data: userData
  });
  return [];
};

export const findAuthUser = async (filters: Partial<User>): Promise<User | undefined> => {
  let user = await prisma.user.findFirst({
    where: { ...filters }
  });
  return user;
};

export const findUserRepo = async (filters: Partial<User>): Promise<User | undefined> => {
  let user = await prisma.user.findFirst({
    where: { ...filters },
    orderBy: {
      created_at: 'desc'
    }
  });
  return user;
};

export const fetchUserDetailsRepo = async (filters: Partial<User>): Promise<User | undefined> => {
  let user = await prisma.user.findFirst({
    where: { ...filters }
  });
  return user;
};

export const updateUserRepo = async (filters: Partial<User>, data: Partial<User>): Promise<User | undefined> => {
  const updatedUser = await prisma.user.update({
    data: {
      ...data
    },
    where: { id: filters.id }
  });
  return updatedUser;
};
