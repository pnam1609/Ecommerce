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
    public class DetailPromotionController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();
        [JwtAuthentication]
        public IHttpActionResult Delete(String MA_KM,String MA_DSP)
        {
            var ctkm = perfumeEntities.CT_KM.Find(MA_KM, MA_DSP);
            if(ctkm == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Chi tiết khuyến mãi này không tồn tại k thể xóa"
                });
            }
            perfumeEntities.CT_KM.Remove(ctkm);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Xóa thành công Chi tiết khuyến mãi" 
            });
        }
    }
}