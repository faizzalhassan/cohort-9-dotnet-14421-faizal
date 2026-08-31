namespace Taskify.Business.DTOs.Tasks;

public class AdminTaskStatisticsResponse
{
    public int Pending { get; set; }

    public int InProgress { get; set; }

    public int Completed { get; set; }

    public int Cancelled { get; set; }

    public int Overdue { get; set; }
}