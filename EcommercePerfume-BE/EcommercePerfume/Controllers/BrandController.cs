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
    public class BrandController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();

        [AllowAnonymous]
        public IHttpActionResult Get()
        {
            var brands = perfumeEntities.get_all_hang().ToList();
            if (brands == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có nhãn hàng nào cả"
                });
            }
            return Ok(brands);
        }

        //[AllowAnonymous]
        ////[JwtAuthentication]
        //public IHttpActionResult Get(String id)
        //{
        //    var hang = perfumeEntities.HANGs.Find(id);
        //    if (hang == null)
        //    {
        //        return Ok(new
        //        {
        //            result = -2,
        //            message = "Hãng này không tồn tại"
        //        });
        //    }
        //    var productBelongHang = perfumeEntities.get_name_product_belong_hang(id).ToList();
        //    return Ok(productBelongHang);
        //}
        [JwtAuthentication]
        public IHttpActionResult Get(String id)
        {
            //var hang = perfumeEntities.HANGs.Find(id);
            var hang = perfumeEntities.HANGs.Where(h => h.MA_HANG == id)
                .Select(h => new
                {
                    h.MA_HANG,
                    h.TENHANG,
                    h.EMAIL,
                    h.SODIENTHOAI,
                    h.DIACHI
                }).ToList().FirstOrDefault();
            if (hang == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Hãng này không tồn tại"
                });
            }
            return Ok(hang);
        }

        [JwtAuthentication]
        public IHttpActionResult Post([FromBody] HANG brand)
        {
            if(brand == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu rỗng"
                });
            }
            
            var bra = perfumeEntities.HANGs.Where(h=> h.MA_HANG == brand.MA_HANG || h.EMAIL == brand.EMAIL.Trim())
                .Select(x=>x.MA_HANG).FirstOrDefault();
            if(bra != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Mã hãng hoặc email này đã tồn tài"
                });
            }
            // thiếu validate các field
            perfumeEntities.HANGs.Add(brand);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Thêm hãng thành công"
            });
        }

        [JwtAuthentication]
        public IHttpActionResult Put([FromBody] HANG brand)
        {
            var bran = perfumeEntities.HANGs.Find(brand.MA_HANG);
            if (bran == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Hãng không tồn tại để sửa"
                });
            }

            bran.TENHANG = brand.TENHANG;
            bran.EMAIL = brand.EMAIL;
            bran.SODIENTHOAI = brand.SODIENTHOAI;
            bran.DIACHI = brand.DIACHI;

            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Sửa sản phẩm thành công"
            });
        }

        [JwtAuthentication]
        public IHttpActionResult Delete(String id)
        {
            var brand = perfumeEntities.HANGs.Find(id);
            if (brand == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Hãng không tồn tại để xóa"
                });
            }

            var DSP = brand.DONGSANPHAMs.Where(x=> x.MA_HANG.Trim() == id)
                .Select(DONGSANPHAM => DONGSANPHAM.MA_DSP).ToList();
            
            if (DSP.Count != 0)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Hãng đã có dòng sản phẩm không thể xóa"
                });
            }
            var DDH = brand.DONDATHANGs.Where(x => x.MA_HANG.Trim() == id)
                .Select(DONDATHANG => DONDATHANG.MA_DDH).ToList();
            if (DDH.Count != 0)
            {
                return Ok(new
                {
                    result = -3,
                    message = "Hãng đã có đơn đặt hàng không thể xóa"
                });
            }

            perfumeEntities.HANGs.Remove(brand);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Xóa hãng thành công"
            });
        }
    }
}