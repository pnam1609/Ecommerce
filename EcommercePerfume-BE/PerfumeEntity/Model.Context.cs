//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PerfumeEntity
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class PerfumeEntities : DbContext
    {
        public PerfumeEntities()
            : base("name=PerfumeEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<CT_DDH> CT_DDH { get; set; }
        public virtual DbSet<CT_KM> CT_KM { get; set; }
        public virtual DbSet<CT_PHIEUDAT> CT_PHIEUDAT { get; set; }
        public virtual DbSet<CT_PHIEUNHAP> CT_PHIEUNHAP { get; set; }
        public virtual DbSet<CT_PHIEUTRA> CT_PHIEUTRA { get; set; }
        public virtual DbSet<CTVC> CTVCs { get; set; }
        public virtual DbSet<DONDATHANG> DONDATHANGs { get; set; }
        public virtual DbSet<DONGSANPHAM> DONGSANPHAMs { get; set; }
        public virtual DbSet<HANG> HANGs { get; set; }
        public virtual DbSet<HOADON> HOADONs { get; set; }
        public virtual DbSet<KHACHHANG> KHACHHANGs { get; set; }
        public virtual DbSet<KHUYENMAI> KHUYENMAIs { get; set; }
        public virtual DbSet<NHANVIEN> NHANVIENs { get; set; }
        public virtual DbSet<NHANVIEN_GH> NHANVIEN_GH { get; set; }
        public virtual DbSet<PHIEUDAT> PHIEUDATs { get; set; }
        public virtual DbSet<PHIEUNHAP> PHIEUNHAPs { get; set; }
        public virtual DbSet<PHIEUTRA> PHIEUTRAs { get; set; }
        public virtual DbSet<SanPham> SanPhams { get; set; }
        public virtual DbSet<sysdiagram> sysdiagrams { get; set; }
        public virtual DbSet<THAYDOIGIA> THAYDOIGIAs { get; set; }
    }
}
