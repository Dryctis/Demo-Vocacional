-- CreateTable
CREATE TABLE "public"."UserSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Answer" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "response" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."UserSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
