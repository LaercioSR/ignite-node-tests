import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AddColumnStatementsReceiverId1644632436999 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn("statements",
        new TableColumn({
          name: "receiver_id",
          type: "uuid",
          isNullable: true
        })
      )
      await queryRunner.createForeignKey("statements",
        new TableForeignKey(
          {
            name: "FKStatementReceiver",
            columnNames: ["receiver_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
          })
      )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey("statements", "FKStatementReceiver")
      await queryRunner.dropColumn("statements", "receiver_id")
    }

}
