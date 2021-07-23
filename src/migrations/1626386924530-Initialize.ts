import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1626386924530 implements MigrationInterface {
    name = 'Initialize1626386924530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_29a05908a0fa0728526d2833657" UNIQUE ("username"), CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "updoot" ("value" integer NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, CONSTRAINT "PK_6476d7e464bcb8571004134515c" PRIMARY KEY ("userId", "postId"))`);
        await queryRunner.query(`CREATE TABLE "Post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "points" integer NOT NULL DEFAULT '0', "creatorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c4d3b3dcd73db0b0129ea829f9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "updoot" ADD CONSTRAINT "FK_9df9e319a273ad45ce509cf2f68" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "updoot" ADD CONSTRAINT "FK_fd6b77bfdf9eae6691170bc9cb5" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Post" ADD CONSTRAINT "FK_d0d77a39af2832707801e6021ef" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Post" DROP CONSTRAINT "FK_d0d77a39af2832707801e6021ef"`);
        await queryRunner.query(`ALTER TABLE "updoot" DROP CONSTRAINT "FK_fd6b77bfdf9eae6691170bc9cb5"`);
        await queryRunner.query(`ALTER TABLE "updoot" DROP CONSTRAINT "FK_9df9e319a273ad45ce509cf2f68"`);
        await queryRunner.query(`DROP TABLE "Post"`);
        await queryRunner.query(`DROP TABLE "updoot"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
