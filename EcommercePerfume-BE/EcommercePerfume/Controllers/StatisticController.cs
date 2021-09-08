using PerfumeEntity;
using System;
using System.Collections;
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
    public class StatisticController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();

        [JwtAuthentication]
        public IHttpActionResult Get(int Year)
        {
            if(Year > DateTime.Now.Year)
            {
                return Ok(new
                {
                    result = -1,
                    message = "không thể thông kê vì chưa tới thời gian"
                });
            }
            else
            {
                IList statistics = new List<int>();
                int month = 1;
                if(Year == DateTime.Now.Year)//Year là năm người dùng chọn
                {
                    month = DateTime.Now.Month;
                }
                else
                {
                    month = 12;
                }
                for (int i = 1; i <= month; i++)
                {
                    var firstDayOfMonth = new DateTime(Year, i, 1);
                    var lastDayOfMonth = firstDayOfMonth.AddMonths(1);
                    try
                    {
                        var statistic = perfumeEntities.HOADONs
                        .Where(x => DateTime.Compare(x.NGAYTAOHD, firstDayOfMonth) > 0 
                            && DateTime.Compare(x.NGAYTAOHD, lastDayOfMonth) <= 0)
                        .Sum(x => x.TONGTIEN);
                        statistics.Add(statistic);
                    }
                    catch
                    {
                        statistics.Add(0);
                    }

                }
                return Ok(statistics);
            }
        }
    }
}