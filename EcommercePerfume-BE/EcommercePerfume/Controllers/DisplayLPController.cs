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

    public class DisplayLPController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();
        [AllowAnonymous]
        public IHttpActionResult Get()
        {
            //var line_perfumes = perfumeEntities.get_DSP_KM_SP().ToList();
            var line_perfumes = perfumeEntities.DONGSANPHAMs
                .Where(sp => sp.SanPhams.ToList().Count != 0)
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
                    SanPhams = perfume.SanPhams
                .Where(x => x.SOLUONGTON > 0)
                .Select(sp => new
                {
                    sp.MA_SP,
                    sp.DUNGTICH,
                    sp.SOLUONGTON,
                    sp.THAYDOIGIAs.Where(ttg => DateTime.Compare(ttg.NGAY, DateTime.Now) < 0)
                    .Select(ttg => new
                    {
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


        [AllowAnonymous]
        public IHttpActionResult Get(string id)
        {
            var perfume = perfumeEntities.DONGSANPHAMs.Find(id);
            if (perfume == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có sản phẩm nào"
                });
            }

            var res = new
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
                SanPhams = perfume.SanPhams.Select((sp, index) => new
                {
                    id = index,
                    sp.MA_SP,
                    sp.DUNGTICH,
                    sp.SOLUONGTON,
                    sp.THAYDOIGIAs.Where(ttg => DateTime.Compare(ttg.NGAY, DateTime.Now) < 0)
                    .Select(ttg => new {
                        ttg.GIA,
                        ttg.NGAY
                    }).OrderByDescending(ttg => ttg.NGAY).FirstOrDefault().GIA
                }),
                CT_KM = perfume.CT_KM.Where(ctkm =>
                DateTime.Compare(ctkm.KHUYENMAI.NGAYBD, DateTime.Now) < 0 && DateTime.Compare(ctkm.KHUYENMAI.NGAYKT, DateTime.Now) > 0)
                .Select(ct => new {
                    ct.MA_KM,
                    ct.MA_DSP,
                    ct.PHANTRAMKM
                }).OrderByDescending(x => x.PHANTRAMKM).FirstOrDefault()
            };
            return Ok(res);
        }


        [AllowAnonymous]
        public IHttpActionResult GetPerfumeByCategory(String MA_HANG)
        {
            var line_perfumes = perfumeEntities.DONGSANPHAMs
                .Where(x => x.MA_HANG.Trim() == MA_HANG.Trim() && x.SanPhams.ToList().Count != 0)
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
                        //GIA = sp.GIA,
                        sp.SOLUONGTON,
                        GIA = sp.THAYDOIGIAs.Where(ttg => DateTime.Compare(ttg.NGAY, DateTime.Now) < 0)
                        .Select(ttg => new {
                            ttg.GIA,
                            ttg.NGAY
                        }).OrderByDescending(ttg => ttg.NGAY).FirstOrDefault().GIA == null ? 0 :
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
                   ct.MA_KM,
                   ct.MA_DSP,
                   ct.PHANTRAMKM
               }).FirstOrDefault()
                }).OrderBy(ct => ct.MA_DSP)
           .ToList();

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