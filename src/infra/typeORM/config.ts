// adapters/typeORM/TypeORMConfig.ts
import { DataSource } from "typeorm";
import { ProductEntity } from "./entities/product";
import { CategoryEntity } from "./entities/category";

import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "produtos_service",
  logging: true,
  synchronize: false,
  entities: [CategoryEntity, ProductEntity],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
});
