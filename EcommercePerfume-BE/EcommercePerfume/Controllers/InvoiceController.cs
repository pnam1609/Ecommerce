using PerfumeEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using WebApi.Jwt.Filters;

namespace EcommercePerfume.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class InvoiceController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();

        [JwtAuthentication]
        public IHttpActionResult Get()
        {
            //var invoices = perfumeEntities.get_all_invoice().ToList();
            //if (invoices.Count == 0)
            //{
            //    return Ok(new
            //    {
            //        result = -1,
            //        message = "Không có hóa đơn nào"
            //    });
            //}
            var invoices = perfumeEntities.HOADONs.Select(hd => new
            {
                hd.MA_HOADON,
                hd.MASOTHUE,
                hd.NGAYTAOHD,
                hd.TONGTIEN,
                hd.MA_NV,
                hd.MA_NVGH,
                hd.ID_PHIEUDAT,
                hd.PHIEUDAT.NGAYGIAO,
                CT_HD = hd.PHIEUDAT.CT_PHIEUDAT.Select(ctpd => new
                {
                    ctpd.SOLUONG,
                    ctpd.GIA,
                    ctpd.SanPham.DONGSANPHAM.TEN,
                    ctpd.SanPham.DONGSANPHAM.XUATXU,
                    ctpd.SanPham.DONGSANPHAM.GIOITINH,
                    ctpd.SanPham.DUNGTICH,
                }),
                hd.PHIEUDAT.HOTEN,
                hd.PHIEUDAT.SODIENTHOAI,
                hd.PHIEUDAT.DIACHI,
                TENNVGH = hd.NHANVIEN_GH.HOTEN

            }).ToList();
            return Ok(invoices);
        }



        [JwtAuthentication]
        public IHttpActionResult Post([FromBody] HOADON hd)
        {
            var hoadon = perfumeEntities.HOADONs.Find(hd.MA_HOADON);
            if(hoadon != null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Mã hóa đơn này đã tồn tại"
                });
            }
            var pd = perfumeEntities.PHIEUDATs.Find(hd.ID_PHIEUDAT);
            var nv = perfumeEntities.NHANVIENs.Find(hd.MA_NV);
            var nvgh = perfumeEntities.NHANVIEN_GH.Find(hd.MA_NVGH);
            if (pd == null || nv == null || nvgh ==null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "ID Phiếu đặt hoặc mã nhân viên hoặc mã nhân viên gh không tồn tại"
                });
            }
            if(hd.NGAYTAOHD == null || hd.TONGTIEN <=0 || hd.MASOTHUE <= 0 )
            {
                return Ok(new
                {
                    result = -3,
                    message = "Dữ liệu trống vui lòng kiểm tra lại"
                });
            }

            perfumeEntities.HOADONs.Add(hd);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Tạo hóa đơn thành công"
            });
        }
    }
}