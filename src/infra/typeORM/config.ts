// adapters/typeORM/TypeORMConfig.ts
import { DataSource } from "typeorm";
import { ProductEntity } from "./entities/product";
import { CategoryEntity } from "./entities/category";

import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST_PRODUTOS || "localhost",
  port: 3306,
  username: process.env.DB_USER_PRODUTOS,
  password: process.env.DB_PASSWORD_PRODUTOS,
  database: process.env.DB_DATABASE || "produtos_service",
  logging: true,
  synchronize: false,
  entities: [CategoryEntity, ProductEntity],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
});
