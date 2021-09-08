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
    public class PerfumeController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();

        [AllowAnonymous]
        public IHttpActionResult Get()
        {
            var perfumes = perfumeEntities.get_all_product().ToList();
            if (perfumes.Count == 0)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có sản phẩm nào"
                });
            }
            return Ok(perfumes);
        }

        [AllowAnonymous]
        public IHttpActionResult Get(string id)
        {
            var perfume = perfumeEntities.SanPhams.Find(id);
            if(perfume == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không tìm thấy sản phẩm nào có mã sản phẩm như vậy!"
                });
            }
            var res = new
            {
                MA_SP = perfume.MA_SP,
                DUNGTICH = perfume.DUNGTICH,
                GIA = perfume.GIA,
                SOLUONGTON = perfume.SOLUONGTON,
                MA_DSP = perfume.MA_DSP,
            };
            return Ok(res);
        }


        //[JwtAuthentication]
        [JwtAuthentication]
        public IHttpActionResult Post([FromBody] SanPham sp)
        {
            if (sp.MA_SP == "" || sp.DUNGTICH <= 0 || sp.GIA <= 0 || sp.SOLUONGTON <= 0 || sp.MA_DSP == "")
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu còn thiếu hoặc bị bỏ trống"
                });
            }
            var sanpham = perfumeEntities.SanPhams.Find(sp.MA_SP);
            if (sanpham != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Mã sản phẩm này đã tồn tại"
                });
            }
            var dsp = perfumeEntities.DONGSANPHAMs.Find(sp.MA_DSP);
            if(dsp == null)
            {
                return Ok(new
                {
                    result = -3,
                    message = "Mã dòng sản phẩm không chính xác"
                });
            }
            
            
            perfumeEntities.SanPhams.Add(sp);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Thêm nước hoa thành công"
            });
        }

        //[JwtAuthentication]
        [JwtAuthentication]
        public IHttpActionResult Put([FromBody] SanPham sp)
        {

            if (sp == null || sp.MA_SP == "" || sp.DUNGTICH <= 0 || sp.GIA <= 0 || sp.SOLUONGTON <= 0 || sp.MA_DSP == "")
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu còn thiếu hoặc bị bỏ trống"
                });
            }
            var sanpham = perfumeEntities.SanPhams.Find(sp.MA_SP);
            if(sanpham == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Mã sản phẩm không tồn tại!"
                });
            }

            var dsp = perfumeEntities.DONGSANPHAMs.Find(sp.MA_DSP);
            if (dsp == null)
            {
                return Ok(new
                {
                    result = -3,
                    message = "Mã dòng sản phẩm không chính xác"
                });
            }

            sanpham.DUNGTICH = sp.DUNGTICH;
            sanpham.MA_DSP = sp.MA_DSP;
            sanpham.SOLUONGTON = sp.SOLUONGTON;
            sanpham.GIA = sp.GIA;

            perfumeEntities.SaveChanges();

            return Ok(new
            {
                result = 1,
                message = "Sửa nước hoa thành công"
            });
        }

        //[JwtAuthentication]
        [JwtAuthentication]
        public IHttpActionResult Delete(string id)
        {
            var sanpham = perfumeEntities.SanPhams.Find(id);
            if (sanpham == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu thiếu vui lòng kiểm tra lại dữ liệu hoặc sản phẩm không tồn tại!"
                });
            }

            var listCTDDH = sanpham.CT_DDH.Select(CTDDH => CTDDH.MA_DDH).FirstOrDefault();
            if(listCTDDH != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Sản phẩm đã có đơn đặt hàng không thể xóa"
                });
            }
            var listCT_PD = sanpham.CT_PHIEUDAT.Select(CT_PHIEUDAT => CT_PHIEUDAT.MA_SP).FirstOrDefault();
            if (listCT_PD != null)
            {
                return Ok(new
                {
                    result = -3,
                    message = "Sản phẩm đã có phiếu đặt không thể xóa"
                });
            }
            var listCT_PN = sanpham.CT_PHIEUNHAP.Select(CT_PHIEUNHAP => CT_PHIEUNHAP.MA_PHIEUNHAP).FirstOrDefault();
            if (listCT_PN != null)
            {
                return Ok(new
                {
                    result = -4,
                    message = "Sản phẩm đã có phiếu nhập không thể xóa"
                });
            }

            perfumeEntities.SanPhams.Remove(sanpham);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Xóa sản phẩm thành công"
            });
        }
    }
}