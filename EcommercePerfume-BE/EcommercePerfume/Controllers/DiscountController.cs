using PerfumeEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace EcommercePerfume.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DiscountController : ApiController
    {
        
        PerfumeEntities perfumeEntities = new PerfumeEntities();

        [AllowAnonymous]
        public IHttpActionResult Get()
        {
            //var line_perfumes = perfumeEntities.get_DSP_KM_SP().ToList();
            var line_perfumes = perfumeEntities.DONGSANPHAMs.Select(perfume => new
            {
                perfume.MA_DSP,
                perfume.TEN,
                perfume.GIOITINH,
                perfume.XUATXU,
                perfume.MOTA,
                perfume.HINHANH,
                perfume.DOLUUHUONG,
                HANG = new
                {
                    perfume.HANG.MA_HANG,
                    perfume.HANG.TENHANG,
                },
                SanPhams = perfume.SanPhams.Select(sp => new
                {
                    sp.MA_SP,
                    sp.DUNGTICH,
                    //sp.GIA,
                    sp.SOLUONGTON,
                    sp.THAYDOIGIAs.Where(ttg => DateTime.Compare(ttg.NGAY, DateTime.Now) < 0)
                    .Select(ttg => new {
                        ttg.GIA,
                        ttg.NGAY
                    }).OrderByDescending(ttg => ttg.NGAY).FirstOrDefault().GIA
                }).FirstOrDefault(),
                CT_KM = perfume.CT_KM.Where(ctkm =>
                DateTime.Compare(ctkm.KHUYENMAI.NGAYBD, DateTime.Now) < 0 && DateTime.Compare(ctkm.KHUYENMAI.NGAYKT, DateTime.Now) > 0)
                .OrderBy(ct => ct.PHANTRAMKM)
                .Select(ct => new
                {
                    ct.MA_KM,
                    ct.MA_DSP,
                    ct.PHANTRAMKM
                }).FirstOrDefault()
            });

            var lpDiscount = line_perfumes.Where(sp => sp.SanPhams != null && sp.CT_KM != null)
                .OrderByDescending(sp => sp.CT_KM.PHANTRAMKM)
                .ToList();


            if (lpDiscount.Count == 0)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có sản phẩm nào"
                });
            }
            return Ok(lpDiscount);
        }
    }
}