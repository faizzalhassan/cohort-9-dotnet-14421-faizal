using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Taskify.Repository.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTaskIdFromTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tasks_TaskId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "TaskId",
                table: "Tasks");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TaskId",
                table: "Tasks",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_TaskId",
                table: "Tasks",
                column: "TaskId",
                unique: true);
        }
    }
}
