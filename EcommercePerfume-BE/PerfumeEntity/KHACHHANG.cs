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
    
    public partial class KHACHHANG
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public KHACHHANG()
        {
            this.PHIEUDATs = new HashSet<PHIEUDAT>();
        }
    
        public string MA_KH { get; set; }
        public string HOTEN { get; set; }
        public System.DateTime NGAYSINH { get; set; }
        public string DIACHI { get; set; }
        public string SODIENTHOAI { get; set; }
        public string EMAIL { get; set; }
        public string PASS { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PHIEUDAT> PHIEUDATs { get; set; }
    }
}
