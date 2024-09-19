-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "voucherMilisats" INTEGER NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventDoneSatsback" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "eventSatsbackId" TEXT NOT NULL,

    CONSTRAINT "EventDoneSatsback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_publicKey_key" ON "Volunteer"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "EventDoneSatsback_eventId_key" ON "EventDoneSatsback"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventDoneSatsback_eventSatsbackId_key" ON "EventDoneSatsback"("eventSatsbackId");
