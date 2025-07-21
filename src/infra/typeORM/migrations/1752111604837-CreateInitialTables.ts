import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1752111604837 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE categories (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL
            );
          `);

    await queryRunner.query(`
            CREATE TABLE products (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              price DECIMAL(10, 2) NOT NULL,
              description VARCHAR(255) NOT NULL,
              image VARCHAR(255) NOT NULL,
              category_id INT,
              CONSTRAINT FK_category_product FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE
            );
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS products;`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories;`);
  }
}
