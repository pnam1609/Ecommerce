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
    
    public partial class PHIEUDAT
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public PHIEUDAT()
        {
            this.CT_PHIEUDAT = new HashSet<CT_PHIEUDAT>();
            this.HOADONs = new HashSet<HOADON>();
        }
    
        public int ID_PHIEUDAT { get; set; }
        public string HOTEN { get; set; }
        public string SODIENTHOAI { get; set; }
        public string DIACHI { get; set; }
        public System.DateTime NGAYDAT { get; set; }
        public System.DateTime NGAYGIAO { get; set; }
        public int TRANGTHAI { get; set; }
        public string MA_KH { get; set; }
        public string MA_NV { get; set; }
        public string TRANSACTIONID { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CT_PHIEUDAT> CT_PHIEUDAT { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<HOADON> HOADONs { get; set; }
        public virtual KHACHHANG KHACHHANG { get; set; }
        public virtual NHANVIEN NHANVIEN { get; set; }
    }
}
