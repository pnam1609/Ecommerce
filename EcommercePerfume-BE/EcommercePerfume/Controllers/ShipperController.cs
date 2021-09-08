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
    public class ShipperController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();
        [AllowAnonymous]
        public IHttpActionResult Get()
        {
            var shipper = perfumeEntities.get_all_shipper().ToList();


            if (shipper.Count == 0)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có nhân viên giao hàng nào"
                });
            }
            return Ok(shipper);
        }
        [JwtAuthentication]
        public IHttpActionResult Get(String id)
        {
            var nvgh = perfumeEntities.NHANVIEN_GH.Find(id);
            if (nvgh == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Mã nhân viên vận chuyển không tồn tại"
                });
            }
            var res = new
            {
                nvgh.MA_NVGH,
                nvgh.HOTEN,
                nvgh.EMAIL,
                nvgh.SODIENTHOAI,
                nvgh.NGAYSINH,
                nvgh.MA_CTVC
            };
            return Ok(res);
        }

        [JwtAuthentication]
        public IHttpActionResult Post([FromBody] NHANVIEN_GH nvgh)
        {
            //validate
            var nhanviengh = perfumeEntities.NHANVIEN_GH.Find(nvgh.MA_NVGH);
            if (nhanviengh != null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Mã nhân viên vận chuyển đã tồn tại"
                });
            }
            var ctvc = perfumeEntities.CTVCs.Find(nvgh.MA_CTVC);
            if(ctvc == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Mã công ty vận chuyển không tồn tại"
                });
            }
            var checkEmail = perfumeEntities.NHANVIEN_GH.Where(x => x.EMAIL == nvgh.EMAIL).Select(x => x.MA_NVGH).FirstOrDefault();
            if (checkEmail != null)
            {
                return Ok(new
                {
                    result = -3,
                    message = "Email này đã tồn tại"
                });
            }
            perfumeEntities.NHANVIEN_GH.Add(nvgh);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Thêm nhân viên vận chuyển thành công"
            });
        }

        [JwtAuthentication]
        public IHttpActionResult Put([FromBody] NHANVIEN_GH nvgh)
        {
            //validate
            var nhanVienGH = perfumeEntities.NHANVIEN_GH.Find(nvgh.MA_NVGH);
            if (nhanVienGH == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Mã nhân viên vận chuyển không tồn tại"
                });
            }
            var ctvc = perfumeEntities.CTVCs.Find(nvgh.MA_CTVC);
            if (ctvc == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Mã công ty vận chuyển không tồn tại"
                });
            }
            var checkEmail = perfumeEntities.NHANVIEN_GH.Where(x => x.EMAIL == nvgh.EMAIL && x.MA_NVGH != nhanVienGH.MA_NVGH)
                .Select(x => x.MA_NVGH).FirstOrDefault();
            if (checkEmail != null)
            {
                return Ok(new
                {
                    result = -3,
                    message = "Email này đã tồn tại"
                });
            }

            nhanVienGH.EMAIL = nvgh.EMAIL;
            nhanVienGH.SODIENTHOAI = nvgh.SODIENTHOAI;
            nhanVienGH.HOTEN = nvgh.HOTEN;
            nhanVienGH.MA_CTVC = nvgh.MA_CTVC;
            nhanVienGH.NGAYSINH = nvgh.NGAYSINH;

            perfumeEntities.SaveChanges();

            return Ok(new
            {
                result = 1,
                message = "Sửa nhân viên vận chuyển thành công"
            });
        }

        [JwtAuthentication]
        public IHttpActionResult Delete(String id)
        {
            var nhanVienGH = perfumeEntities.NHANVIEN_GH.Find(id);
            if (nhanVienGH == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Mã nhân viên vận chuyển không tồn tại"
                });
            }
            var hd = perfumeEntities.HOADONs.Where(x => x.MA_NVGH == id).Select(x => x.MA_HOADON).FirstOrDefault();
            if (hd != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Nhân viên giao hàng đã giao cho 1 đơn hàng nên không thể xóa"
                });
            }
            perfumeEntities.NHANVIEN_GH.Remove(nhanVienGH);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Xoá nhân viên vận chuyển thành công"
            });
        }
    }
}