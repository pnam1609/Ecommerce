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
    public class PromotionController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();
        [AllowAnonymous]
        public IHttpActionResult Get()
        {
            var promotions = perfumeEntities.KHUYENMAIs.Select(x => new
            {
                x.MA_KM,
                x.TEN,
                x.NGAYBD,
                x.NGAYKT,
                x.MA_NV,
                x.MOTA,
                CT_KM = x.CT_KM.Select(ctkm=> new
                {
                    ctkm.MA_KM,
                    ctkm.MA_DSP,
                    ctkm.PHANTRAMKM
                })
            }).ToList();

            if(promotions.Count == 0)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có khuyến mãi nào"
                });
            }
            return Ok(promotions);
        }

        [AllowAnonymous]
        public IHttpActionResult Get(String id)
        {
            var x = perfumeEntities.KHUYENMAIs.Find(id);
            if(x == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Mã khuyến mãi " + id + " không tồn tại"
                });
            }
            var res = new
            {
                x.MA_KM,
                x.TEN,
                x.NGAYBD,
                x.NGAYKT,
                x.MA_NV,
                x.MOTA,
                CT_KM = x.CT_KM.Select((ctkm,index) => new
                {
                    id = index,
                    ctkm.MA_KM,
                    ctkm.MA_DSP,
                    ctkm.PHANTRAMKM
                })
            };

            return Ok(res);
        }
        [JwtAuthentication]
        public IHttpActionResult Post([FromBody] KHUYENMAI km)
        {
            var khuyenmai = perfumeEntities.KHUYENMAIs.Find(km.MA_KM);
            if(khuyenmai != null)
            {
                return Ok(new
                {
                    result =-1,
                    message = "Mã khuyến mãi này đã tồn tại"
                });
            }
            var nv = perfumeEntities.NHANVIENs.Find(km.MA_NV);
            if (nv == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Mã nhân viên này không đã tồn tại"
                });
            }
            

            foreach (var element in km.CT_KM.ToList())
            {
                var dsp = perfumeEntities.DONGSANPHAMs.Find(element.MA_DSP);
                if (dsp == null)
                {
                    return Ok(new
                    {
                        result = -3,
                        message = "Mã " + element.MA_DSP + " Không tồn tại vui lòng kiểm tra lại"
                    });
                }
            }

            //validate
            perfumeEntities.KHUYENMAIs.Add(km);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Tạo khuyến mãi thành công"
            });
        }

        [JwtAuthentication]
        public IHttpActionResult Put([FromBody] KHUYENMAI km)
        {
            var khuyenmai = perfumeEntities.KHUYENMAIs.Find(km.MA_KM);
            if (khuyenmai == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Mã khuyến mãi này không tồn tại"
                });
            }
            var nv = perfumeEntities.NHANVIENs.Find(km.MA_NV);
            if (nv == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Mã nhân viên này không đã tồn tại"
                });
            }

            // thiếu  validate

            khuyenmai.NGAYBD = km.NGAYBD;
            khuyenmai.NGAYKT = km.NGAYKT;
            khuyenmai.MOTA = km.MOTA;
            khuyenmai.TEN = km.TEN;

            foreach(var  i in km.CT_KM.ToList())
            {
                var dsp = perfumeEntities.DONGSANPHAMs.Find(i.MA_DSP);
                if(dsp == null)
                {
                    return Ok(new
                    {
                        result = -3,
                        message = "Mã dòng sản phẩm "+i.MA_DSP +" không tồn tại"
                    });
                }
                var ctkm = perfumeEntities.CT_KM.Find(km.MA_KM, i.MA_DSP);

                if(ctkm != null)
                {
                    ctkm.PHANTRAMKM = i.PHANTRAMKM;
                }
                else
                {
                    i.MA_KM = km.MA_KM;
                    perfumeEntities.CT_KM.Add(i);
                }
            }

            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Sửa khuyến mãi thành công"
            });
        }

        [JwtAuthentication]
        public IHttpActionResult Delete(String id)
        {
            var km = perfumeEntities.KHUYENMAIs.Find(id);
            if (km == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không tìm thấy đợt khuyến mãi để xóa"
                });
            }
            var ctkm = km.CT_KM.Select(x => x.MA_KM).FirstOrDefault();
            if(ctkm != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Đợt khuyến mãi này đã có chi tiết khuyến mãi không thể xóa"
                });
            }
            perfumeEntities.KHUYENMAIs.Remove(km);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Xóa đợt khuyến mãi thành công"
            });
        }
    }
}