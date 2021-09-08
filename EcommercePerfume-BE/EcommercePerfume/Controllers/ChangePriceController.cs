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
    public class ChangePriceController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();


        [JwtAuthentication]// put và post dùng chung nếu có thì sửa giá còn nếu k thì thêm
        public IHttpActionResult Put([FromBody] THAYDOIGIA t)
        {
            var ttg = perfumeEntities.THAYDOIGIAs.Find(t.MA_SP, t.NGAY);
            if(ttg != null)
            {
                ttg.GIA = t.GIA;
            }
            else
            {
                if(t.GIA <= 0)
                {
                    return Ok(new
                    {
                        result = -1,
                        message = "Dữ liệu của "+ t.MA_SP + " bị thiếu vui lòng kiểm tra lại"
                    });
                }
                perfumeEntities.THAYDOIGIAs.Add(t);
            }
            perfumeEntities.SaveChanges();

            return Ok(new
            {
                result = 1,
                message = "Sửa thay đổi giá thành công"
            });
        }
    }
}