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
    public class HotSellController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();
        [AllowAnonymous]
        public IHttpActionResult Get()
        {
            DateTime DateforHotSell = DateTime.Now.AddDays(-30);

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
                    sp.SOLUONGTON,
                    sp.THAYDOIGIAs.Where(ttg => DateTime.Compare(ttg.NGAY, DateTime.Now) < 0)
                    .Select(ttg => new {
                        ttg.GIA,
                        ttg.NGAY
                    }).OrderByDescending(ttg => ttg.NGAY).FirstOrDefault().GIA,
                    SL = sp.CT_PHIEUDAT.Where(ctpd => ctpd.PHIEUDAT.TRANGTHAI != 3 
                    && DateTime.Compare(ctpd.PHIEUDAT.NGAYDAT, DateforHotSell) > 0)
                        .Sum(x => x.SOLUONG) == null ? 0 :
                        sp.CT_PHIEUDAT.Where(ctpd => ctpd.PHIEUDAT.TRANGTHAI != 3 
                        && DateTime.Compare(ctpd.PHIEUDAT.NGAYDAT, DateforHotSell) > 0)
                        .Sum(x => x.SOLUONG)
                }),
                CT_KM = perfume.CT_KM.Where(ctkm =>
                DateTime.Compare(ctkm.KHUYENMAI.NGAYBD, DateTime.Now) < 0 
                && DateTime.Compare(ctkm.KHUYENMAI.NGAYKT, DateTime.Now) > 0)
                .OrderBy(ct => ct.PHANTRAMKM)
                .Select(ct => new {
                    ct.MA_KM,
                    ct.MA_DSP,
                    ct.PHANTRAMKM
                })
            }).ToList();

            var hs = line_perfumes.Where(x => x.SanPhams.ToList().Count != 0)
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
                SLBAN = perfume.SanPhams.Select(x=> x.SL).Sum(),
                SanPhams = perfume.SanPhams.Select(sp => new
                {
                    sp.MA_SP,
                    sp.DUNGTICH,
                    sp.GIA,
                    sp.SOLUONGTON,
                    
                }).FirstOrDefault(),
                CT_KM = perfume.CT_KM.Select(x => x).FirstOrDefault()
            }).OrderByDescending(x=>x.SLBAN)
            .Take(6)
            .ToList();

            //var hotSell = perfumeEntities.SanPhams.Select

            return Ok(hs);
        }
    }
}