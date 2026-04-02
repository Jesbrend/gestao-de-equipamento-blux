using AutoMapper;
using EquipmentManagement.API.Domain.Entities;
using EquipmentManagement.API.Domain.Enums;
using EquipmentManagement.API.DTOs.Equipment;

namespace EquipmentManagement.API.Mappings;

public class EquipmentProfile : Profile
{
    public EquipmentProfile()
    {
        CreateMap<Equipment, EquipmentResponseDto>()
            .ForCtorParam("status", opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<EquipmentCreateDto, Equipment>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src =>
                Enum.Parse<EquipmentStatus>(src.Status, true)))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

        CreateMap<EquipmentUpdateDto, Equipment>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src =>
                Enum.Parse<EquipmentStatus>(src.Status, true)))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
    }
}
