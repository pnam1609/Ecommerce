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
    public class CheckQuantityController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();
        [AllowAnonymous]
        public IHttpActionResult Post([FromBody]PHIEUDAT pd)
        {
            if(pd.CT_PHIEUDAT == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Giỏ hàng trống vui lòng kiểm tra lại"
                });
            }
            foreach(var i in pd.CT_PHIEUDAT)
            {
                var sp = perfumeEntities.SanPhams.Find(i.MA_SP);
                if(sp.SOLUONGTON < i.SOLUONG)
                {
                    return Ok(new
                    {
                        result = -2,
                        message = "Số lượng tồn của " + sp.DONGSANPHAM.TEN + ", dung tich " + sp.DUNGTICH + " ml chỉ còn " + sp.SOLUONGTON
                    });
                }
            }
            return Ok(new
            {
                result = 1,
                message = "Đủ số lượng cho phiếu đặt"
            });
        }
    }
}