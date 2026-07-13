import dbConnect from '@/config/db'; 

export async function GET() {
  await dbConnect();
}