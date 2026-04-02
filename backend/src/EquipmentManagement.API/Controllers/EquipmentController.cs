using EquipmentManagement.API.DTOs.Equipment;
using EquipmentManagement.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EquipmentManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class EquipmentController(
    IEquipmentService equipmentService,
    IReportService reportService,
    ILogger<EquipmentController> logger) : ControllerBase
{
    /// <summary>Lista equipamentos com paginação, filtros e ordenação.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResultDto<EquipmentResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] EquipmentQueryDto query, CancellationToken cancellationToken)
    {
        var result = await equipmentService.GetPagedAsync(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>Obtém um equipamento por ID.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(EquipmentResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await equipmentService.GetByIdAsync(id, cancellationToken);
        return Ok(result);
    }

    /// <summary>Cria um novo equipamento.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(EquipmentResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create([FromBody] EquipmentCreateDto dto, CancellationToken cancellationToken)
    {
        var result = await equipmentService.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>Atualiza um equipamento existente.</summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(EquipmentResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Update(Guid id, [FromBody] EquipmentUpdateDto dto, CancellationToken cancellationToken)
    {
        var result = await equipmentService.UpdateAsync(id, dto, cancellationToken);
        return Ok(result);
    }

    /// <summary>Remove um equipamento.</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await equipmentService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }

    /// <summary>Gera relatório de equipamentos em CSV.</summary>
    [HttpGet("report/csv")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DownloadCsv([FromQuery] EquipmentQueryDto query, CancellationToken cancellationToken)
    {
        var bytes = await reportService.GenerateCsvAsync(query, cancellationToken);
        var fileName = $"equipamentos_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
        return File(bytes, "text/csv", fileName);
    }

    /// <summary>Gera relatório de equipamentos em PDF.</summary>
    [HttpGet("report/pdf")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DownloadPdf([FromQuery] EquipmentQueryDto query, CancellationToken cancellationToken)
    {
        var bytes = await reportService.GeneratePdfAsync(query, cancellationToken);
        var fileName = $"equipamentos_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";
        return File(bytes, "application/pdf", fileName);
    }
}
