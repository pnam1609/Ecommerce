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
    using System.Collections.Generic;
    
    public partial class PHIEUNHAP
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public PHIEUNHAP()
        {
            this.CT_PHIEUNHAP = new HashSet<CT_PHIEUNHAP>();
            this.DONDATHANGs = new HashSet<DONDATHANG>();
        }
    
        public int ID_PHIEUNHAP { get; set; }
        public System.DateTime NGAYTAO { get; set; }
        public Nullable<int> ID_NV { get; set; }
        public Nullable<int> ID_DDH { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CT_PHIEUNHAP> CT_PHIEUNHAP { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DONDATHANG> DONDATHANGs { get; set; }
        public virtual DONDATHANG DONDATHANG { get; set; }
        public virtual NHANVIEN NHANVIEN { get; set; }
    }
}
