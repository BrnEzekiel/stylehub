-- CreateTable
CREATE TABLE "StyleDIYPost" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "videoUrl" VARCHAR(500),
    "imageUrl" VARCHAR(500),
    "productId" UUID,
    "serviceId" UUID,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StyleDIYPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleDIYComment" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StyleDIYComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleDIYRecommendation" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sellerId" UUID,
    "providerId" UUID,
    "productId" UUID,
    "serviceId" UUID,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StyleDIYRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StyleDIYPost_userId_idx" ON "StyleDIYPost"("userId");

-- CreateIndex
CREATE INDEX "StyleDIYPost_productId_idx" ON "StyleDIYPost"("productId");

-- CreateIndex
CREATE INDEX "StyleDIYPost_serviceId_idx" ON "StyleDIYPost"("serviceId");

-- CreateIndex
CREATE INDEX "StyleDIYPost_createdAt_idx" ON "StyleDIYPost"("createdAt");

-- CreateIndex
CREATE INDEX "StyleDIYComment_postId_idx" ON "StyleDIYComment"("postId");

-- CreateIndex
CREATE INDEX "StyleDIYComment_userId_idx" ON "StyleDIYComment"("userId");

-- CreateIndex
CREATE INDEX "StyleDIYRecommendation_postId_idx" ON "StyleDIYRecommendation"("postId");

-- CreateIndex
CREATE INDEX "StyleDIYRecommendation_userId_idx" ON "StyleDIYRecommendation"("userId");

-- AddForeignKey
ALTER TABLE "StyleDIYPost" ADD CONSTRAINT "StyleDIYPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleDIYPost" ADD CONSTRAINT "StyleDIYPost_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleDIYPost" ADD CONSTRAINT "StyleDIYPost_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleDIYComment" ADD CONSTRAINT "StyleDIYComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "StyleDIYPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleDIYComment" ADD CONSTRAINT "StyleDIYComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleDIYRecommendation" ADD CONSTRAINT "StyleDIYRecommendation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "StyleDIYPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleDIYRecommendation" ADD CONSTRAINT "StyleDIYRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleDIYRecommendation" ADD CONSTRAINT "StyleDIYRecommendation_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleDIYRecommendation" ADD CONSTRAINT "StyleDIYRecommendation_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleDIYRecommendation" ADD CONSTRAINT "StyleDIYRecommendation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleDIYRecommendation" ADD CONSTRAINT "StyleDIYRecommendation_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
