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
    
    public partial class CTVC
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CTVC()
        {
            this.NHANVIEN_GH = new HashSet<NHANVIEN_GH>();
        }
    
        public string MA_CTVC { get; set; }
        public string TEN { get; set; }
        public string DIACHI { get; set; }
        public string SODIENTHOAI { get; set; }
        public string EMAIL { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<NHANVIEN_GH> NHANVIEN_GH { get; set; }
    }
}
