-- AlterTable
ALTER TABLE "User" DROP COLUMN "birthDate",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "facebookUsername" TEXT,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "instagramUsername" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "tiktokUsername" TEXT,
ADD COLUMN     "websiteUrl" TEXT,
ADD COLUMN     "xUsername" TEXT,
ADD COLUMN     "youtubeUsername" TEXT;

