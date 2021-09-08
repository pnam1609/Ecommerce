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
    public class ReceiptController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();
        [AllowAnonymous]
        public IHttpActionResult Get()
        {
            //var pn = perfumeEntities.get_all_PN().ToList();
            var phieuNhap = perfumeEntities.PHIEUNHAPs.Select(pn => new
            {
                pn.MA_PHIEUNHAP,
                pn.NGAYTAO,
                pn.MA_NV,
                pn.MA_DDH,
                CT_PHIEUNHAP = pn.CT_PHIEUNHAP.Select(ct => new
                {
                    ct.MA_PHIEUNHAP,
                    ct.MA_SP,
                    ct.SOLUONG,
                    ct.GIA
                })
            }).ToList();
            if (phieuNhap.Count == 0)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có phiếu nhập"
                });
            }
            return Ok(phieuNhap);
        }

        [AllowAnonymous]
        public IHttpActionResult Get(String id)
        {
            var pn = perfumeEntities.PHIEUNHAPs.Find(id);
            if(pn == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có phiếu nhập nào"
                });
            }
            var res = new
            {
                pn.MA_PHIEUNHAP,
                pn.NGAYTAO,
                pn.MA_NV,
                pn.MA_DDH,
                CT_PHIEUNHAP = pn.CT_PHIEUNHAP.Select(ct => new
                {
                    ct.MA_PHIEUNHAP,
                    ct.MA_SP,
                    ct.SOLUONG,
                    ct.GIA
                })
            };
            return Ok(res);
        }

        [JwtAuthentication]
        public IHttpActionResult Post([FromBody] PHIEUNHAP pn)
        {
            if(pn == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu rỗng"
                });
            }
            var phieunhap = perfumeEntities.PHIEUNHAPs.Find(pn.MA_PHIEUNHAP);
            if (phieunhap != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Mã phiếu nhập đã tồn tại"
                });
            }

            perfumeEntities.PHIEUNHAPs.Add(pn);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Thêm Phiếu nhập thành công"
            });
        }
    }
}