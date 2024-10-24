-- CreateTable
CREATE TABLE "_QuestToUser" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuestToUser_AB_unique" ON "_QuestToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestToUser_B_index" ON "_QuestToUser"("B");

-- AddForeignKey
ALTER TABLE "_QuestToUser" ADD CONSTRAINT "_QuestToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Quest"("quest_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestToUser" ADD CONSTRAINT "_QuestToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("keycloak_user_id") ON DELETE CASCADE ON UPDATE CASCADE;
