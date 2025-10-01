import { Module } from "@nestjs/common";
import { ItemService } from "./item.service";
import { ItemController } from "./item.controller";
import { ItemRepository } from "./repository/item.repository";
import { PrismaService } from "src/database/prisma.service";

@Module({
    controllers: [ItemController],
    providers: [ItemService, ItemRepository
        , PrismaService]
})
export class ItemModule {}