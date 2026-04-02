using System.Text;
using EquipmentManagement.API.Domain.Entities;
using EquipmentManagement.API.DTOs.Equipment;
using EquipmentManagement.API.Interfaces;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace EquipmentManagement.API.Services;

public class ReportService(IEquipmentRepository repository) : IReportService
{
    public async Task<byte[]> GenerateCsvAsync(EquipmentQueryDto query, CancellationToken cancellationToken = default)
    {
        var equipments = await repository.GetAllForReportAsync(query, cancellationToken);

        var sb = new StringBuilder();
        sb.AppendLine("Nome,Tipo,Número de Série,Status,Data de Aquisição");

        foreach (var e in equipments)
        {
            var line = $"\"{EscapeCsv(e.Name)}\",\"{EscapeCsv(e.Type)}\",\"{EscapeCsv(e.SerialNumber)}\",\"{e.Status}\",\"{e.AcquisitionDate:dd/MM/yyyy}\"";
            sb.AppendLine(line);
        }

        return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
    }

    public async Task<byte[]> GeneratePdfAsync(EquipmentQueryDto query, CancellationToken cancellationToken = default)
    {
        var equipments = (await repository.GetAllForReportAsync(query, cancellationToken)).ToList();

        QuestPDF.Settings.License = LicenseType.Community;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header().Element(ComposeHeader);
                page.Content().Element(content => ComposeContent(content, equipments));
                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span("Página ");
                    text.CurrentPageNumber();
                    text.Span(" de ");
                    text.TotalPages();
                });
            });
        });

        return document.GeneratePdf();
    }

    private static void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text("Relatório de Equipamentos")
                    .FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);
                column.Item().Text($"Gerado em: {DateTime.Now:dd/MM/yyyy HH:mm}")
                    .FontSize(9).FontColor(Colors.Grey.Medium);
            });
        });
    }

    private static void ComposeContent(IContainer container, List<Equipment> equipments)
    {
        container.PaddingVertical(20).Column(column =>
        {
            column.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(3);
                    columns.RelativeColumn(2);
                    columns.RelativeColumn(2);
                    columns.RelativeColumn(2);
                    columns.RelativeColumn(2);
                });

                table.Header(header =>
                {
                    header.Cell().Element(HeaderCellStyle).Text("Nome");
                    header.Cell().Element(HeaderCellStyle).Text("Tipo");
                    header.Cell().Element(HeaderCellStyle).Text("Número de Série");
                    header.Cell().Element(HeaderCellStyle).Text("Status");
                    header.Cell().Element(HeaderCellStyle).Text("Aquisição");

                    static IContainer HeaderCellStyle(IContainer container) =>
                        container.DefaultTextStyle(x => x.SemiBold().FontColor(Colors.White))
                            .PaddingVertical(5).PaddingHorizontal(8)
                            .Background(Colors.Blue.Medium);
                });

                foreach (var (equipment, index) in equipments.Select((e, i) => (e, i)))
                {
                    var bgColor = index % 2 == 0 ? Colors.White : Colors.Grey.Lighten3;

                    table.Cell().Element(c => CellStyle(c, bgColor)).Text(equipment.Name);
                    table.Cell().Element(c => CellStyle(c, bgColor)).Text(equipment.Type);
                    table.Cell().Element(c => CellStyle(c, bgColor)).Text(equipment.SerialNumber);
                    table.Cell().Element(c => CellStyle(c, bgColor)).Text(equipment.Status.ToString());
                    table.Cell().Element(c => CellStyle(c, bgColor)).Text(equipment.AcquisitionDate.ToString("dd/MM/yyyy"));
                }

                static IContainer CellStyle(IContainer container, string bgColor) =>
                    container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2)
                        .Background(bgColor).PaddingVertical(5).PaddingHorizontal(8);
            });

            column.Item().PaddingTop(10).Text($"Total de equipamentos: {equipments.Count}")
                .FontSize(9).FontColor(Colors.Grey.Medium);
        });
    }

    private static string EscapeCsv(string value) => value.Replace("\"", "\"\"");
}
