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
    public class EmployeeController : ApiController
    {
        PERFUMEEntities perfumeEntities = new PERFUMEEntities();
        // GET api/<controller>
        public IHttpActionResult Get()
        {
            var employees = perfumeEntities.get_all_employee().ToList();
            if (employees.Count == 0)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có nhân viên nào"
                });
            }

            return Ok(employees);
        }
        
    }
}