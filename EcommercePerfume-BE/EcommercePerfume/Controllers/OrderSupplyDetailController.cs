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
    public class OrderSupplyDetailController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();
        [AllowAnonymous]
        public IHttpActionResult Get(string id)
        {
            var CTDDH = perfumeEntities.CT_DDH.Select(ct => ct.MA_DDH == id);
            if(CTDDH == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Đơn đặt hàng này rỗng"
                });
            }
            return Ok(CTDDH);
        }

        [JwtAuthentication]
        public IHttpActionResult Delete(String MA_DDH,String MA_SP)
        {
            var detailOS = perfumeEntities.CT_DDH.Find(MA_DDH, MA_SP);
            if(detailOS == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Chi tiết đơn đặt hàng này không tồn tại"
                });
            }
            perfumeEntities.CT_DDH.Remove(detailOS);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Xóa chi tiết đơn đặt hàng thành công"
            });
        }
    }
}