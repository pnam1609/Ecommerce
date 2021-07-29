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
    public class PerfumeController : ApiController
    {
        PERFUMEEntities perfumeEntities = new PERFUMEEntities();

        public IHttpActionResult Post([FromBody] SANPHAM sp)
        {
            var dsp = perfumeEntities.DONGSANPHAMs.Find(sp.ID_DSP);
            if(dsp == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "id dòng sản phẩm không chính xác"
                });
            }
            perfumeEntities.SANPHAMs.Add(sp);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Thêm nước hoa thành công"
            });
        }
        public IHttpActionResult Put([FromBody] SANPHAM sp)
        {
            var sanpham = perfumeEntities.SANPHAMs.Find(sp);

            if(sanpham == null || sp == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu thiếu vui lòng kiểm tra lại dữ liệu hoặc sản phẩm không tồn tại!"
                });
            }

            sanpham.DUNGTICH = sp.DUNGTICH;
            sanpham.ID_DSP = sp.ID_DSP;
            sanpham.GIA = sp.GIA;

            perfumeEntities.SaveChanges();

            return Ok(new
            {
                result = 1,
                message = "Sửa nước hoa thành công"
            });

        }
    }
}