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
    public class ShippingCompanyController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();

        [JwtAuthentication]
        public IHttpActionResult Get()
        {
            var ctvc = perfumeEntities.CTVCs.Select(x=> new
            {
                x.MA_CTVC,
                x.TEN,
                x.EMAIL,
                x.SODIENTHOAI,
                x.DIACHI
            }).ToList();
            if (ctvc.Count == 0)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có Công ty vận chuyển nào"
                });
            }
            return Ok(ctvc);
        }

        [JwtAuthentication]
        public IHttpActionResult Get(String id)
        {
            var ctvc = perfumeEntities.CTVCs
                .Where(x=> x.MA_CTVC == id)
                .Select(x => new
            {
                x.MA_CTVC,
                x.TEN,
                x.EMAIL,
                x.SODIENTHOAI,
                x.DIACHI
            }).ToList().FirstOrDefault();
            if (ctvc == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Mã công ty vận chuyển không tồn tại"
                });
            }
            return Ok(ctvc);
        }

        [JwtAuthentication]
        public IHttpActionResult Post([FromBody] CTVC ctvc)
        {
            //validate
            var company = perfumeEntities.CTVCs.Find(ctvc.MA_CTVC);
            if(company != null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Mã công ty vận chuyển đã tồn tại"
                });
            }
            var checkEmail = perfumeEntities.CTVCs.Where(x => x.EMAIL == ctvc.EMAIL).Select(x => x.MA_CTVC).FirstOrDefault();
            if(checkEmail != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Email này đã tồn tại"
                });
            }
            perfumeEntities.CTVCs.Add(ctvc);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Thêm công ty vận chuyển thành công"
            });
        }

        [JwtAuthentication]
        public IHttpActionResult Put([FromBody] CTVC ctvc)
        {
            //validate
            var company = perfumeEntities.CTVCs.Find(ctvc.MA_CTVC);
            if (company == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Mã công ty vận chuyển đã tồn tại"
                });
            }
            var checkEmail = perfumeEntities.CTVCs.Where(x => x.EMAIL == ctvc.EMAIL && x.MA_CTVC != company.MA_CTVC)
                .Select(x => x.MA_CTVC).FirstOrDefault();
            if (checkEmail != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Email này đã tồn tại"
                });
            }

            company.EMAIL = ctvc.EMAIL;
            company.SODIENTHOAI = ctvc.SODIENTHOAI;
            company.TEN = ctvc.TEN;
            company.DIACHI = ctvc.DIACHI;

            perfumeEntities.SaveChanges();

            return Ok(new
            {
                result = 1,
                message = "Sửa công ty vận chuyển thành công"
            });
        }

        [JwtAuthentication]
        public IHttpActionResult Delete(String id)
        {
            var company = perfumeEntities.CTVCs.Find(id);
            if(company == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Mã công ty vận chuyển không tồn tại"
                });
            }
            var nvgh = perfumeEntities.NHANVIEN_GH.Where(x => x.MA_CTVC == id).Select(x=>x.MA_NVGH).FirstOrDefault();
            if(nvgh != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Công ty vận chuyển đã có nhân viên giao hàng không thể xóa"
                });
            }
            perfumeEntities.CTVCs.Remove(company);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Xoá công ty vận chuyển thành công"
            });
        }
    }
}