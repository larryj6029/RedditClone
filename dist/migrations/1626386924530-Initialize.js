"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Initialize1626386924530 = void 0;
class Initialize1626386924530 {
    constructor() {
        this.name = 'Initialize1626386924530';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "User" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_29a05908a0fa0728526d2833657" UNIQUE ("username"), CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "updoot" ("value" integer NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, CONSTRAINT "PK_6476d7e464bcb8571004134515c" PRIMARY KEY ("userId", "postId"))`);
            yield queryRunner.query(`CREATE TABLE "Post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "points" integer NOT NULL DEFAULT '0', "creatorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c4d3b3dcd73db0b0129ea829f9f" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "updoot" ADD CONSTRAINT "FK_9df9e319a273ad45ce509cf2f68" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "updoot" ADD CONSTRAINT "FK_fd6b77bfdf9eae6691170bc9cb5" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "Post" ADD CONSTRAINT "FK_d0d77a39af2832707801e6021ef" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "Post" DROP CONSTRAINT "FK_d0d77a39af2832707801e6021ef"`);
            yield queryRunner.query(`ALTER TABLE "updoot" DROP CONSTRAINT "FK_fd6b77bfdf9eae6691170bc9cb5"`);
            yield queryRunner.query(`ALTER TABLE "updoot" DROP CONSTRAINT "FK_9df9e319a273ad45ce509cf2f68"`);
            yield queryRunner.query(`DROP TABLE "Post"`);
            yield queryRunner.query(`DROP TABLE "updoot"`);
            yield queryRunner.query(`DROP TABLE "User"`);
        });
    }
}
exports.Initialize1626386924530 = Initialize1626386924530;
//# sourceMappingURL=1626386924530-Initialize.js.map