import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
    try {
        console.log('Testing database connection...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
        
        await prisma.$connect();
        console.log('✅ Database connected successfully!');
        
        const userCount = await prisma.user.count();
        console.log(`✅ Found ${userCount} users in database`);
        
        await prisma.$disconnect();
        console.log('✅ Database disconnected');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
