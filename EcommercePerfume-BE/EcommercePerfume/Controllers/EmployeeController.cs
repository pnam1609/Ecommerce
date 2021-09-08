using EcommercePerfume.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PerfumeEntity;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;
using WebApi.Jwt;
using WebApi.Jwt.Filters;

namespace EcommercePerfume.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class EmployeeController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();

        [JwtAuthentication]
        public IHttpActionResult Get()
        {
            var employees = perfumeEntities.get_employee().ToList();
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
        [JwtAuthentication]
        public IHttpActionResult Get(string id)
        {
            var employee = perfumeEntities.NHANVIENs.Where(x => x.MA_NV == id)
                .Select(x => new
                {
                    MA_NV = x.MA_NV,
                    HOTEN = x.HOTEN,
                    NGAYSINH = x.NGAYSINH,
                    DIACHI = x.DIACHI,
                    SODIENTHOAI = x.SODIENTHOAI,
                    EMAIL = x.EMAIL,
                    PASS = x.PASS
                }).FirstOrDefault();
            if (employee == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Nhân viên không tồn tại"
                });
            }
            return Ok(employee);
        }

        [AllowAnonymous]
        public IHttpActionResult Get(string username, string password)
        {
            //var employees = perfumeEntities.get_all_employee().ToList();
            var employee = perfumeEntities.NHANVIENs.Where(nv => nv.EMAIL == username).FirstOrDefault();
            if (employee == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Sai tài khoản đăng nhập hoặc mật khẩu"
                });
            }
            //================================================
            var nv1 = new NHANVIEN();
            nv1.MA_NV = employee.MA_NV;
            nv1.EMAIL = employee.EMAIL;
            nv1.HOTEN = employee.HOTEN;

            //================================================
            if (employee != null && employee.PASS == password)
            {
                var res = new
                {
                    result = 1,
                    role = "NHANVIEN",
                    token = JwtManager.GenerateToken(nv1)
                };
                return Ok(res);
            }
            //throw new HttpResponseException(HttpStatusCode.Unauthorized);
            return Ok(new
            {
                result = -1,
                message = "Sai tài khoản đăng nhập hoặc mật khẩu"
            });
        }

        [JwtAuthentication]
        public IHttpActionResult Post ([FromBody] NHANVIEN nv)
        {
            if(nv == null )
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trốn hoặc thiếu"
                });
            }
            var checkNV = perfumeEntities.NHANVIENs.Find(nv.MA_NV);
            if(checkNV != null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Mã nhân viên đã tồn tại"
                });
            }
            var checkEmail = perfumeEntities.NHANVIENs.Where(x => x.EMAIL == nv.EMAIL).ToList();
            if (checkEmail.Count >= 1)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Email trùng vui lòng chọn email khác"
                });
            }

            perfumeEntities.NHANVIENs.Add(nv);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Thêm nhân viên thành công"
            });
        }

        
        [JwtAuthentication]
        public IHttpActionResult Put([FromBody] NHANVIEN nv)
        {
            var checkNV = perfumeEntities.NHANVIENs.Find(nv.MA_NV);
            if (checkNV == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Nhân viên không tồn tại để sửa tồn tại"
                });
            }
            if (nv == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trốn hoặc thiếu"
                });
            }
            if (checkNV.EMAIL != nv.EMAIL)
            {
                var checkEmail = perfumeEntities.NHANVIENs.Where(x => x.EMAIL == nv.EMAIL).ToList();
                if(checkEmail.Count >= 1)
                {
                    return Ok(new
                    {
                        result = -2,
                        message = "Email trùng vui lòng chọn email khác"
                    });
                }
            }
            checkNV.HOTEN = nv.HOTEN;
            checkNV.NGAYSINH = nv.NGAYSINH;
            checkNV.DIACHI = nv.DIACHI;
            checkNV.SODIENTHOAI = nv.SODIENTHOAI;
            checkNV.EMAIL = nv.EMAIL;
            checkNV.PASS = nv.PASS;

            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Sửa nhân viên thành công"
            });
        }

        [JwtAuthentication]
        public IHttpActionResult Delete(String id)
        {
            var checkNV = perfumeEntities.NHANVIENs.Find(id);
            if (checkNV == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Nhân viên không tồn tại để sửa tồn tại"
                });
            }
            var checkDDH = perfumeEntities.DONDATHANGs.Where(x => x.MA_NV == id).FirstOrDefault();
            if(checkDDH != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Nhân viên đã tạo đơn đặt hàng không thể xóa"
                });
            }

            var checkPN = perfumeEntities.PHIEUNHAPs.Where(x => x.MA_NV == id).FirstOrDefault();
            if (checkPN != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Nhân viên đã tạo Phiếu nhập không thể xóa"
                });
            }

            var checkPD = perfumeEntities.PHIEUDATs.Where(x => x.MA_NV == id).FirstOrDefault();
            if (checkPD != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Nhân viên đã tạo phiếu đặt không thể xóa"
                });
            }

            var checkHD = perfumeEntities.HOADONs.Where(x => x.MA_NV == id).FirstOrDefault();
            if (checkHD != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Nhân viên đã tạo hóa đơn không thể xóa"
                });
            }

            var checkKM = perfumeEntities.KHUYENMAIs.Where(x => x.MA_NV == id).FirstOrDefault();
            if (checkKM != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Nhân viên đã tạo đợt khuyến mãi không thể xóa"
                });
            }

            var checkPT = perfumeEntities.KHUYENMAIs.Where(x => x.MA_NV == id).FirstOrDefault();
            if (checkPT != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Nhân viên đã tạo phiếu trả không thể xóa"
                });
            }

            perfumeEntities.NHANVIENs.Remove(checkNV);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Xóa nhân viên thành công"
            });
        }
    }
}