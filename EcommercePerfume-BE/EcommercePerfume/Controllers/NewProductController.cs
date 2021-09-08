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
    public class NewProductController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();
        [AllowAnonymous]
        public IHttpActionResult Get()
        {
            DateTime now = DateTime.Now;
            now = now.AddDays(-14);
            //var newproduct = perfumeEntities.PHIEUNHAPs.Where(x => DateTime.Compare(x.NGAYTAO, now) > 0)
            //    .Select(x => x.CT_PHIEUNHAP.Select(ctpn => ctpn.SanPham.MA_DSP).Distinct());
            var newproduct = perfumeEntities.CT_PHIEUNHAP.Where(x => DateTime.Compare(x.PHIEUNHAP.NGAYTAO, now) > 0)
                .Select(ctpn => ctpn.SanPham.MA_DSP).Distinct().ToList();

            var line_perfumes = perfumeEntities.DONGSANPHAMs
                .Where(sp => sp.SanPhams.ToList().Count != 0 && newproduct.Contains(sp.MA_DSP))
                .Select(perfume => new
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
                .Select(ct => new {
                    MA_KM = ct.MA_KM,
                    MA_DSP = ct.MA_DSP,
                    PHANTRAMKM = ct.PHANTRAMKM
                }).FirstOrDefault()
                }).ToList();

            if (line_perfumes.Count == 0)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có sản phẩm nào"
                });
            }
            return Ok(line_perfumes);
        }
    }
}